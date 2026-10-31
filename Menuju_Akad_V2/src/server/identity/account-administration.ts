import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";
type Access = { role: "customer" | "admin" | "vendor" | "ambassador"; active: boolean };
type ExpectedAccess = {
  role: "customer" | "admin" | "superadmin" | "vendor" | "ambassador";
  active: boolean;
  version: number;
};
export function initializeAccountAdministration(db: DatabaseSync) {
  const columns = db.prepare("PRAGMA table_info(accounts)").all();
  if (!columns.some((column) => column.name === "access_revision"))
    db.exec("ALTER TABLE accounts ADD COLUMN access_revision INTEGER NOT NULL DEFAULT 0");
  db.exec(`CREATE TABLE IF NOT EXISTS account_access_audit (
    id INTEGER PRIMARY KEY, actor TEXT NOT NULL, target TEXT NOT NULL,
    old_role TEXT NOT NULL, new_role TEXT NOT NULL, old_active INTEGER NOT NULL,
    new_active INTEGER NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL);`);
}
export function changeAccountAccess(
  db: DatabaseSync,
  actor: string,
  target: string,
  next: Access,
  expected: ExpectedAccess,
  reason: string,
) {
  const note = reason.trim();
  if (
    !actor.trim() ||
    !target.trim() ||
    !note ||
    note.length > 500 ||
    !["customer", "admin", "vendor", "ambassador"].includes(next.role) ||
    typeof next.active !== "boolean" ||
    !["customer", "admin", "superadmin", "vendor", "ambassador"].includes(expected.role) ||
    typeof expected.active !== "boolean" ||
    !Number.isSafeInteger(expected.version) ||
    expected.version < 0
  )
    throw new PaymentError("Periksa perubahan dan alasan.", 400);
  db.exec("BEGIN IMMEDIATE");
  try {
    const administrator = db.prepare("SELECT role,active FROM accounts WHERE id=?").get(actor);
    if (!administrator || administrator.role !== "superadmin" || administrator.active !== 1)
      throw new PaymentError("Akses ditolak.", 403);
    const current = db
      .prepare("SELECT role,active,access_revision FROM accounts WHERE id=?")
      .get(target);
    if (!current) throw new PaymentError("Akun tidak ditemukan.", 404);
    if (target === actor || current.role === "superadmin")
      throw new PaymentError("Akun superadmin tidak dapat diubah di sini.", 403);
    if (
      current.role !== expected.role ||
      (current.active === 1) !== expected.active ||
      current.access_revision !== expected.version
    )
      throw new PaymentError("Data akun telah berubah. Muat ulang sebelum menyimpan.", 409);
    if (current.role === next.role && (current.active === 1) === next.active)
      throw new PaymentError("Tidak ada perubahan pada akun.", 409);
    db.prepare(
      "UPDATE accounts SET role=?,active=?,access_revision=access_revision+1 WHERE id=?",
    ).run(next.role, Number(next.active), target);
    db.prepare("DELETE FROM account_sessions WHERE account_id=?").run(target);
    db.prepare("INSERT OR IGNORE INTO legacy_revocations(account_id) VALUES (?)").run(target);
    db.prepare(
      "INSERT INTO account_access_audit(actor,target,old_role,new_role,old_active,new_active,reason,created_at) VALUES(?,?,?,?,?,?,?,?)",
    ).run(
      actor,
      target,
      String(current.role),
      next.role,
      Number(current.active),
      Number(next.active),
      note,
      new Date().toISOString(),
    );
    db.exec("COMMIT");
    return { id: target, ...next };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
