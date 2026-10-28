import "server-only";
import type { DatabaseSync } from "node:sqlite";
import {
  expenseKinds,
  projectExpenseBudgets,
  type ExpenseResources,
} from "@/features/planner-finance/domain/expense-budgets";
import { financeBookSchema } from "@/features/planner-finance/domain/finance-ledger-schema";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { PaymentError } from "@/server/payments/errors";
export function syncWorkspaceExpenseBudgets(
  db: DatabaseSync,
  id: string,
  override: ExpenseResources = {},
) {
  db.exec("SAVEPOINT expense_budget_sync");
  try {
    const current = db
      .prepare(
        "SELECT data,revision FROM workspace_resources WHERE workspace_id=? AND kind='finance'",
      )
      .get(id);
    const previous = current ? (JSON.parse(String(current["data"])) as CustomerBudget[]) : [];
    const sources: ExpenseResources = {};
    for (const kind of expenseKinds) {
      const row = db
        .prepare("SELECT data FROM workspace_resources WHERE workspace_id=? AND kind=?")
        .get(id, kind);
      sources[kind] = override[kind] ?? (row ? (JSON.parse(String(row["data"])) as unknown[]) : []);
    }
    const ledger = db.prepare("SELECT data FROM workspace_finance WHERE workspace_id=?").get(id);
    const book = ledger ? financeBookSchema.parse(JSON.parse(String(ledger["data"]))) : null;
    const next = projectExpenseBudgets(
      previous,
      sources,
      book?.allocations ?? [],
      new Date().toISOString(),
    );
    if (JSON.stringify(next) !== JSON.stringify(previous)) {
      db.prepare(
        "INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,'finance',?,?) ON CONFLICT(workspace_id,kind) DO UPDATE SET data=excluded.data,revision=excluded.revision",
      ).run(id, JSON.stringify(next), Number(current?.["revision"] ?? 0) + 1);
      if (book) {
        book.revision += 1;
        db.prepare("UPDATE workspace_finance SET data=? WHERE workspace_id=?").run(
          JSON.stringify(book),
          id,
        );
      }
    }
    db.exec("RELEASE expense_budget_sync");
  } catch (cause) {
    db.exec("ROLLBACK TO expense_budget_sync; RELEASE expense_budget_sync");
    if (cause instanceof PaymentError) throw cause;
    throw new PaymentError(
      cause instanceof Error ? cause.message : "Anggaran belum dapat diselaraskan.",
      409,
    );
  }
}
