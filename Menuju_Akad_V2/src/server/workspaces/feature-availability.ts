import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { CustomerWorkspace } from "@/features/customer-workspace/types";
import { rolloutAllowed } from "./feature-rollout";
import { PaymentError } from "@/server/payments/errors";
import {
  isAvailabilityFeature,
  isControllableFeature,
  type AvailabilityFeature,
} from "@/features/customer-workspace/domain/feature-availability-catalog";
import {
  isDashboardAudience,
  type DashboardAudience,
} from "@/features/customer-workspace/domain/dashboard-card-catalog";

export function initializeFeatureAvailability(db: DatabaseSync) {
  db.exec(`CREATE TABLE IF NOT EXISTS feature_availability (
    feature TEXT NOT NULL, audience TEXT NOT NULL, available INTEGER NOT NULL CHECK(available IN (0,1)),
    version INTEGER NOT NULL CHECK(version >= 0), PRIMARY KEY(feature,audience));
    CREATE TABLE IF NOT EXISTS feature_availability_audit (
    id INTEGER PRIMARY KEY, feature TEXT NOT NULL, audience TEXT NOT NULL, actor TEXT NOT NULL,
    old_available INTEGER NOT NULL, new_available INTEGER NOT NULL, reason TEXT NOT NULL,
    version INTEGER NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS feature_availability_migrations (name TEXT PRIMARY KEY);`);
  db.exec("SAVEPOINT guest_availability_migration");
  try {
    for (const feature of [
      "guests",
      "finance",
      "support",
      "vendors",
      "domain",
      "seserahan",
      "catering",
    ]) {
      const applied = db
        .prepare("INSERT OR IGNORE INTO feature_availability_migrations(name) VALUES(?)")
        .run(`${feature}-v1`);
      if (!applied.changes) continue;
      db.prepare(
        `INSERT INTO feature_availability_audit(feature,audience,actor,old_available,new_available,reason,version,created_at)
        SELECT feature,audience,'system',0,1,'Pengaturan lama dinetralkan sebelum fitur didukung',version+1,datetime('now')
        FROM feature_availability WHERE feature=? AND available=0`,
      ).run(feature);
      db.prepare(
        "UPDATE feature_availability SET available=1, version=version+1 WHERE feature=? AND available=0",
      ).run(feature);
    }
    db.exec("RELEASE guest_availability_migration");
  } catch (error) {
    db.exec("ROLLBACK TO guest_availability_migration; RELEASE guest_availability_migration");
    throw error;
  }
}
export function readFeatureAvailability(
  db: DatabaseSync,
  feature: AvailabilityFeature,
  audience: DashboardAudience,
  workspace?: CustomerWorkspace | null,
) {
  if (!isAvailabilityFeature(feature) || !isDashboardAudience(audience))
    throw new PaymentError("Fitur atau kelompok pengguna tidak valid.", 400);
  const row = db
    .prepare("SELECT available,version FROM feature_availability WHERE feature=? AND audience=?")
    .get(feature, audience);
  return {
    available:
      (isControllableFeature(feature) ? (row ? row.available === 1 : true) : true) &&
      (workspace === undefined ||
        rolloutAllowed(db, feature, {
          audience,
          plan: workspace?.subscription.planId ?? "free",
          workspaceId: workspace?.id ?? null,
        })),
    version: row ? Number(row.version) : 0,
  };
}
export function updateFeatureAvailability(
  db: DatabaseSync,
  actor: string,
  feature: AvailabilityFeature,
  audience: DashboardAudience,
  available: boolean,
  reason: string,
  expectedVersion: number,
) {
  const note = reason.trim();
  if (
    !isAvailabilityFeature(feature) ||
    !isControllableFeature(feature) ||
    !isDashboardAudience(audience) ||
    !actor.trim() ||
    typeof available !== "boolean" ||
    !note ||
    note.length > 500 ||
    !Number.isSafeInteger(expectedVersion) ||
    expectedVersion < 0
  )
    throw new PaymentError("Periksa fitur, kelompok pengguna, dan alasan perubahan.", 400);
  db.exec("BEGIN IMMEDIATE");
  try {
    const current = readFeatureAvailability(db, feature, audience);
    if (current.version !== expectedVersion)
      throw new PaymentError("Pengaturan telah berubah. Muat ulang sebelum menyimpan.", 409);
    if (current.available === available)
      throw new PaymentError("Pengaturan tersebut sudah aktif.", 409);
    const version = current.version + 1;
    db.prepare(
      "INSERT INTO feature_availability(feature,audience,available,version) VALUES(?,?,?,?) ON CONFLICT(feature,audience) DO UPDATE SET available=excluded.available,version=excluded.version",
    ).run(feature, audience, Number(available), version);
    db.prepare(
      "INSERT INTO feature_availability_audit(feature,audience,actor,old_available,new_available,reason,version,created_at) VALUES(?,?,?,?,?,?,?,?)",
    ).run(
      feature,
      audience,
      actor,
      Number(current.available),
      Number(available),
      note,
      version,
      new Date().toISOString(),
    );
    db.exec("COMMIT");
    return { available, version };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
