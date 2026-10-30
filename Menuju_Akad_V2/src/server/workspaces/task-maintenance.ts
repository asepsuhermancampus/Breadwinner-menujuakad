import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";

export type TaskStatus = "active" | "maintenance";

export function initializeTaskMaintenance(db: DatabaseSync) {
  db.exec(`CREATE TABLE IF NOT EXISTS task_maintenance (
    id INTEGER PRIMARY KEY CHECK(id=1), status TEXT NOT NULL CHECK(status IN ('active','maintenance')),
    version INTEGER NOT NULL CHECK(version>=0));
    INSERT OR IGNORE INTO task_maintenance(id,status,version) VALUES(1,'active',0);
    CREATE TABLE IF NOT EXISTS task_maintenance_audit (
      version INTEGER PRIMARY KEY, actor TEXT NOT NULL, old_status TEXT NOT NULL,
      new_status TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL);`);
}

export function readTaskMaintenance(db: DatabaseSync): { status: TaskStatus; version: number } {
  const row = db.prepare("SELECT status,version FROM task_maintenance WHERE id=1").get();
  if (!row || (row["status"] !== "active" && row["status"] !== "maintenance"))
    throw new Error("Invalid task maintenance configuration");
  return { status: row["status"], version: Number(row["version"]) };
}

export function updateTaskMaintenance(
  db: DatabaseSync,
  actor: string,
  status: TaskStatus,
  reason: string,
  expectedVersion: number,
) {
  const note = reason.trim();
  if (
    !actor.trim() ||
    !note ||
    note.length > 500 ||
    !Number.isSafeInteger(expectedVersion) ||
    expectedVersion < 0 ||
    !["active", "maintenance"].includes(status)
  )
    throw new PaymentError("Periksa status dan alasan perubahan.", 400);
  db.exec("BEGIN IMMEDIATE");
  try {
    const current = readTaskMaintenance(db);
    if (current.version !== expectedVersion)
      throw new PaymentError("Pengaturan telah berubah. Muat ulang sebelum menyimpan.", 409);
    if (current.status === status) throw new PaymentError("Status tersebut sudah aktif.", 409);
    const version = current.version + 1;
    db.prepare("UPDATE task_maintenance SET status=?,version=? WHERE id=1").run(status, version);
    db.prepare(
      "INSERT INTO task_maintenance_audit(version,actor,old_status,new_status,reason,created_at) VALUES(?,?,?,?,?,?)",
    ).run(version, actor, current.status, status, note, new Date().toISOString());
    db.exec("COMMIT");
    return { status, version };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
