import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";
import { workspaceOwnerSide } from "./couple-side";

export function initializeAdminMembership(db: DatabaseSync) {
  db.exec(`CREATE TABLE IF NOT EXISTS workspace_membership_audit (
    id INTEGER PRIMARY KEY, actor TEXT NOT NULL, workspace_id TEXT NOT NULL,
    target TEXT NOT NULL, action TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL);`);
}

export function listAdminMemberships(db: DatabaseSync, account: string) {
  return db
    .prepare(
      `SELECT w.id,w.full_name,w.revision,m.role,
    (SELECT account FROM workspace_members p WHERE p.workspace_id=w.id AND p.role='partner') AS partner,
    (SELECT hash FROM workspace_invites i WHERE i.workspace_id=w.id AND i.accepted_by IS NULL AND i.expires_at>? LIMIT 1) AS invite
    FROM workspace_members m JOIN customer_workspaces w ON w.id=m.workspace_id
    WHERE m.account=? ORDER BY w.id`,
    )
    .all(Date.now(), account)
    .map((row) => ({
      id: String(row.id),
      name: String(row.full_name),
      role: String(row.role),
      revision: Number(row.revision),
      partner: row.partner === null ? null : String(row.partner),
      invite: row.invite === null ? null : String(row.invite),
    }));
}

export function cancelAdminInvite(
  db: DatabaseSync,
  actor: string,
  id: string,
  invite: string,
  reason: string,
) {
  if (
    !actor.trim() ||
    !id.trim() ||
    !/^[a-f0-9]{64}$/.test(invite) ||
    !reason.trim() ||
    reason.length > 500
  )
    throw new PaymentError("Periksa undangan dan alasan perubahan.", 400);
  db.exec("BEGIN IMMEDIATE");
  try {
    const row = db
      .prepare(
        "SELECT w.owner FROM workspace_invites i JOIN customer_workspaces w ON w.id=i.workspace_id WHERE i.workspace_id=? AND i.hash=? AND i.accepted_by IS NULL AND i.expires_at>?",
      )
      .get(id, invite, Date.now());
    if (!row)
      throw new PaymentError("Undangan telah berubah. Muat ulang sebelum melanjutkan.", 409);
    db.prepare("DELETE FROM workspace_invites WHERE workspace_id=? AND hash=?").run(id, invite);
    db.prepare(
      "INSERT INTO workspace_membership_audit(actor,workspace_id,target,action,reason,created_at) VALUES(?,?,?,'cancel_invite',?,?)",
    ).run(actor, id, String(row.owner), reason.trim(), new Date().toISOString());
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function revokeAdminPartner(
  db: DatabaseSync,
  actor: string,
  id: string,
  target: string,
  reason: string,
  expectedRevision: number,
) {
  if (
    !actor.trim() ||
    !id.trim() ||
    !target.trim() ||
    !reason.trim() ||
    reason.length > 500 ||
    !Number.isSafeInteger(expectedRevision) ||
    expectedRevision < 0
  )
    throw new PaymentError("Periksa anggota dan alasan perubahan.", 400);
  db.exec("BEGIN IMMEDIATE");
  try {
    const row = db
      .prepare(
        `SELECT w.revision, w.owner, m.account FROM customer_workspaces w
      LEFT JOIN workspace_members m ON m.workspace_id=w.id AND m.role='partner' WHERE w.id=?`,
      )
      .get(id);
    if (!row) throw new PaymentError("Workspace tidak ditemukan.", 404);
    if (row.account !== target || row.revision !== expectedRevision)
      throw new PaymentError("Keanggotaan telah berubah. Muat ulang sebelum melanjutkan.", 409);
    const side = workspaceOwnerSide(db, id, String(row.owner));
    db.prepare(
      "DELETE FROM workspace_members WHERE workspace_id=? AND account=? AND role='partner'",
    ).run(id, target);
    db.prepare("DELETE FROM workspace_invites WHERE workspace_id=?").run(id);
    db.prepare(
      "UPDATE customer_workspaces SET owner_side=COALESCE(owner_side,?), revision=revision+1 WHERE id=?",
    ).run(side, id);
    db.prepare(
      "INSERT INTO workspace_membership_audit(actor,workspace_id,target,action,reason,created_at) VALUES(?,?,?,'revoke',?,?)",
    ).run(actor, id, target, reason.trim(), new Date().toISOString());
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
