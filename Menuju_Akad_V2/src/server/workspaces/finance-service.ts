import "server-only";
import {
  applyFinanceRequest,
  emptyFinanceBook,
  financeBookSchema,
  financeSnapshot,
} from "@/features/planner-finance/domain/finance-ledger";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type {
  FinanceActor,
  FinanceBook,
  FinanceRequest,
} from "@/features/planner-finance/types/finance-ledger";
import { PaymentError } from "@/server/payments/errors";
import type { WorkspaceService } from "./service";
import { bindFinanceMembers } from "./finance-member-binding";
import { withFinanceProfileNames } from "./finance-profile-snapshot";

export function financeDomainError(error: unknown): PaymentError {
  const message = error instanceof Error ? error.message : "Perintah keuangan tidak valid.";
  return new PaymentError(
    message,
    /Anda hanya dapat|Pilih sisi tabungan akun/.test(message)
      ? 403
      : /berubah|telah digunakan|sudah selesai|sudah terhubung|Lepaskan alokasi/.test(message)
        ? 409
        : 400,
  );
}
export class FinanceService {
  constructor(private readonly workspaces: WorkspaceService) {}
  private requireMember(account: string, workspaceId?: string) {
    let workspace;
    try {
      workspace = this.workspaces.requireWorkspace(account, workspaceId);
    } catch (error) {
      if (error instanceof PaymentError && error.httpStatus === 404)
        throw new PaymentError("Akses workspace ditolak.", 403);
      throw error;
    }
    if (
      !this.workspaces.db
        .prepare("SELECT 1 FROM workspace_members WHERE workspace_id=? AND account=?")
        .get(workspace.id, account)
    )
      throw new PaymentError("Akses workspace ditolak.", 403);
    return workspace.id;
  }
  private state(workspaceId: string): {
    book: FinanceBook;
    budgets: CustomerBudget[];
    resourceRevision: number;
  } {
    const db = this.workspaces.db;
    const ledger = db
      .prepare("SELECT data FROM workspace_finance WHERE workspace_id=?")
      .get(workspaceId);
    const resource = db
      .prepare(
        "SELECT data,revision FROM workspace_resources WHERE workspace_id=? AND kind='finance'",
      )
      .get(workspaceId);
    return {
      book: ledger
        ? financeBookSchema.parse(JSON.parse(String(ledger["data"])))
        : emptyFinanceBook(),
      budgets: resource ? (JSON.parse(String(resource["data"])) as CustomerBudget[]) : [],
      resourceRevision: resource ? Number(resource["revision"]) : 0,
    };
  }
  read(account: string, workspaceId?: string) {
    const db = this.workspaces.db;
    db.exec("BEGIN IMMEDIATE");
    try {
      const id = this.requireMember(account, workspaceId);
      const { book, budgets } = this.state(id);
      const bindingsChanged = bindFinanceMembers(db, id, book);
      if (bindingsChanged) {
        book.revision += 1;
      }
      const snapshot = withFinanceProfileNames(db, id, financeSnapshot(book, budgets, account));
      db.prepare("INSERT OR IGNORE INTO workspace_finance(workspace_id,data) VALUES(?,?)").run(
        id,
        JSON.stringify(book),
      );
      if (bindingsChanged)
        db.prepare("UPDATE workspace_finance SET data=? WHERE workspace_id=?").run(
          JSON.stringify(book),
          id,
        );
      db.exec("COMMIT");
      return snapshot;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
  execute(
    actor: FinanceActor,
    request: FinanceRequest,
    workspaceId?: string,
    now = new Date().toISOString(),
  ) {
    const db = this.workspaces.db;
    db.exec("BEGIN IMMEDIATE");
    try {
      const id = this.requireMember(actor.id, workspaceId);
      const { book, budgets, resourceRevision } = this.state(id);
      bindFinanceMembers(db, id, book);
      const current = book;
      let result;
      try {
        result = applyFinanceRequest(current, budgets, actor, request, now);
      } catch (error) {
        throw financeDomainError(error);
      }
      bindFinanceMembers(db, id, result.book);
      db.prepare(
        "INSERT INTO workspace_finance(workspace_id,data) VALUES(?,?) ON CONFLICT(workspace_id) DO UPDATE SET data=excluded.data",
      ).run(id, JSON.stringify(result.book));
      if (JSON.stringify(result.budgets) !== JSON.stringify(budgets))
        db.prepare(
          "INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,'finance',?,?) ON CONFLICT(workspace_id,kind) DO UPDATE SET data=excluded.data,revision=excluded.revision",
        ).run(id, JSON.stringify(result.budgets), resourceRevision + 1);
      const snapshot = withFinanceProfileNames(
        db,
        id,
        financeSnapshot(result.book, result.budgets, actor.id),
      );
      db.exec("COMMIT");
      return snapshot;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}
