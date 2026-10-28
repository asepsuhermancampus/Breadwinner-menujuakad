import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { CustomerWorkspace } from "@/features/customer-workspace/types";
export function partnerAccess(
  db: DatabaseSync,
  id: string,
): NonNullable<CustomerWorkspace["partnerAccess"]> {
  if (db.prepare("SELECT 1 FROM workspace_members WHERE workspace_id=? AND role='partner'").get(id))
    return { state: "connected" };
  const invite = db
    .prepare(
      "SELECT expires_at FROM workspace_invites WHERE workspace_id=? AND accepted_by IS NULL AND expires_at>?",
    )
    .get(id, Date.now());
  return invite
    ? { state: "invited", expiresAt: new Date(Number(invite["expires_at"])).toISOString() }
    : { state: "locked" };
}
