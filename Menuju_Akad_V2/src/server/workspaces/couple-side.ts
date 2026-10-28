import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { financeBookSchema } from "@/features/planner-finance/domain/finance-ledger";

export function workspaceOwnerSide(db: DatabaseSync, workspaceId: string, owner: string) {
  const stored = db
    .prepare("SELECT owner_side FROM customer_workspaces WHERE id=?")
    .get(workspaceId)?.["owner_side"];
  if (stored === "groom" || stored === "bride") return stored;
  const ledger = db
    .prepare("SELECT data FROM workspace_finance WHERE workspace_id=?")
    .get(workspaceId);
  if (!ledger) return null;
  const book = financeBookSchema.parse(JSON.parse(String(ledger["data"])));
  const accounts = new Set(
    db
      .prepare("SELECT account FROM workspace_members WHERE workspace_id=?")
      .all(workspaceId)
      .map((row) => String(row["account"])),
  );
  const own = book.members.find((member) => member.actorId === owner);
  if (own) return own.side;
  const partner = book.members.find((member) => accounts.has(member.actorId));
  return partner ? (partner.side === "groom" ? "bride" : "groom") : null;
}
