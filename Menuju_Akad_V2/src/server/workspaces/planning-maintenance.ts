import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";
import {
  isMaintainedPlanningFeature,
  type MaintainedPlanningFeature,
} from "@/features/customer-planning/domain/maintenance-catalog";
import type { TaskStatus } from "./task-maintenance";

export function initializePlanningMaintenance(db: DatabaseSync) {
  db.exec(`CREATE TABLE IF NOT EXISTS planning_maintenance (
    feature TEXT PRIMARY KEY, status TEXT NOT NULL CHECK(status IN ('active','maintenance')),
    version INTEGER NOT NULL CHECK(version>=0));
    INSERT OR IGNORE INTO planning_maintenance VALUES('calendar','active',0),('rundown','active',0),('emergency','active',0),('documents','active',0),('moodboard','active',0),('catering','active',0),('seserahan','active',0),('guests','active',0),('invitations','active',0),('studio-drafts','active',0),('finance','active',0),('pdf','active',0);
    CREATE TABLE IF NOT EXISTS planning_maintenance_audit (
      feature TEXT NOT NULL, version INTEGER NOT NULL, actor TEXT NOT NULL, old_status TEXT NOT NULL,
      new_status TEXT NOT NULL, reason TEXT NOT NULL, created_at TEXT NOT NULL,
      PRIMARY KEY(feature,version));`);
}
export function readPlanningMaintenance(
  db: DatabaseSync,
  feature: MaintainedPlanningFeature,
): { status: TaskStatus; version: number } {
  if (!isMaintainedPlanningFeature(feature)) throw new PaymentError("Fitur tidak ditemukan.", 404);
  const row = db
    .prepare("SELECT status,version FROM planning_maintenance WHERE feature=?")
    .get(feature);
  if (!row || (row.status !== "active" && row.status !== "maintenance"))
    throw new Error("Invalid maintenance configuration");
  return { status: row.status, version: Number(row.version) };
}
export function updatePlanningMaintenance(
  db: DatabaseSync,
  actor: string,
  feature: MaintainedPlanningFeature,
  status: TaskStatus,
  reason: string,
  expectedVersion: number,
) {
  const note = reason.trim();
  if (!isMaintainedPlanningFeature(feature)) throw new PaymentError("Fitur tidak ditemukan.", 404);
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
    const current = readPlanningMaintenance(db, feature);
    if (current.version !== expectedVersion)
      throw new PaymentError("Pengaturan telah berubah. Muat ulang sebelum menyimpan.", 409);
    if (current.status === status) throw new PaymentError("Status tersebut sudah aktif.", 409);
    const version = current.version + 1;
    db.prepare("UPDATE planning_maintenance SET status=?,version=? WHERE feature=?").run(
      status,
      version,
      feature,
    );
    db.prepare(
      "INSERT INTO planning_maintenance_audit(feature,version,actor,old_status,new_status,reason,created_at) VALUES(?,?,?,?,?,?,?)",
    ).run(feature, version, actor, current.status, status, note, new Date().toISOString());
    db.exec("COMMIT");
    return { status, version };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
