import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { FinanceBook } from "@/features/planner-finance/types/finance-ledger";
import { workspaceOwnerSide } from "./couple-side";
export function bindFinanceMembers(db: DatabaseSync, id: string, book: FinanceBook) {
  const owner = String(
    db.prepare("SELECT owner FROM customer_workspaces WHERE id=?").get(id)!["owner"],
  );
  const side = workspaceOwnerSide(db, id, owner);
  const active = db
    .prepare("SELECT account,role FROM workspace_members WHERE workspace_id=?")
    .all(id);
  const previous = JSON.stringify(book.members);
  book.members = book.members.filter((m) => active.some((a) => a["account"] === m.actorId));
  if (side) {
    db.prepare("UPDATE customer_workspaces SET owner_side=COALESCE(owner_side,?) WHERE id=?").run(
      side,
      id,
    );
    for (const member of active) {
      const actorId = String(member["account"]),
        binding = member["role"] === "owner" ? side : side === "groom" ? "bride" : "groom";
      const current = book.members.find((m) => m.actorId === actorId);
      if (current) current.side = binding;
      else book.members.push({ actorId, actorName: "Pasangan", side: binding });
    }
  }
  return previous !== JSON.stringify(book.members);
}
