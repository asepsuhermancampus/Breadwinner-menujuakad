import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { financeBookSchema } from "@/features/planner-finance/domain/finance-ledger";
import type { SavingsSide } from "@/features/planner-finance/types/finance-ledger";
export const oppositeSide = (side: SavingsSide): SavingsSide =>
  side === "groom" ? "bride" : "groom";
// Correcting position keeps each person's balance and allocation history together.
export function updateProfileSide(
  db: DatabaseSync,
  id: string,
  previous: SavingsSide | null | undefined,
  next: SavingsSide | undefined,
) {
  if (!next || next === previous) return;
  const row = db.prepare("SELECT data FROM workspace_finance WHERE workspace_id=?").get(id);
  if (previous && row) {
    const book = financeBookSchema.parse(JSON.parse(String(row["data"])));
    for (const item of [...book.members, ...book.entries, ...book.allocations])
      item.side = oppositeSide(item.side);
    book.revision += 1;
    db.prepare("UPDATE workspace_finance SET data=? WHERE workspace_id=?").run(
      JSON.stringify(book),
      id,
    );
  }
  db.prepare("UPDATE customer_workspaces SET owner_side=? WHERE id=?").run(next, id);
}
