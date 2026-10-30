import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";
import {
  dashboardCardLabels,
  isDashboardAudience,
  isDashboardCard,
  type DashboardAudience,
  type DashboardCard,
} from "@/features/customer-workspace/domain/dashboard-card-catalog";
export function initializeDashboardCards(db: DatabaseSync) {
  db.exec(`CREATE TABLE IF NOT EXISTS dashboard_card_settings (
    card TEXT NOT NULL, audience TEXT NOT NULL, visible INTEGER NOT NULL CHECK(visible IN (0,1)),
    version INTEGER NOT NULL CHECK(version>=0), PRIMARY KEY(card,audience));
    CREATE TABLE IF NOT EXISTS dashboard_card_audit (
      id INTEGER PRIMARY KEY, card TEXT NOT NULL, audience TEXT NOT NULL, actor TEXT NOT NULL,
      old_visible INTEGER NOT NULL, new_visible INTEGER NOT NULL, reason TEXT NOT NULL,
      version INTEGER NOT NULL, created_at TEXT NOT NULL);`);
}
export function readDashboardCards(db: DatabaseSync, audience: DashboardAudience) {
  if (!isDashboardAudience(audience)) throw new PaymentError("Kelompok pengguna tidak valid.", 400);
  return (Object.keys(dashboardCardLabels) as DashboardCard[]).map((card) => {
    const row = db
      .prepare("SELECT visible,version FROM dashboard_card_settings WHERE card=? AND audience=?")
      .get(card, audience);
    return {
      card,
      audience,
      visible: row ? row.visible === 1 : true,
      version: row ? Number(row.version) : 0,
    };
  });
}
export function updateDashboardCard(
  db: DatabaseSync,
  actor: string,
  card: DashboardCard,
  audience: DashboardAudience,
  visible: boolean,
  reason: string,
  expectedVersion: number,
) {
  const note = reason.trim();
  if (
    !isDashboardCard(card) ||
    !isDashboardAudience(audience) ||
    !actor.trim() ||
    typeof visible !== "boolean" ||
    !note ||
    note.length > 500 ||
    !Number.isSafeInteger(expectedVersion) ||
    expectedVersion < 0
  )
    throw new PaymentError("Periksa card, kelompok pengguna, dan alasan perubahan.", 400);
  db.exec("BEGIN IMMEDIATE");
  try {
    const current = readDashboardCards(db, audience).find((item) => item.card === card)!;
    if (current.version !== expectedVersion)
      throw new PaymentError("Pengaturan telah berubah. Muat ulang sebelum menyimpan.", 409);
    if (current.visible === visible) throw new PaymentError("Tampilan tersebut sudah aktif.", 409);
    const version = current.version + 1;
    db.prepare(
      "INSERT INTO dashboard_card_settings(card,audience,visible,version) VALUES(?,?,?,?) ON CONFLICT(card,audience) DO UPDATE SET visible=excluded.visible,version=excluded.version",
    ).run(card, audience, Number(visible), version);
    db.prepare(
      "INSERT INTO dashboard_card_audit(card,audience,actor,old_visible,new_visible,reason,version,created_at) VALUES(?,?,?,?,?,?,?,?)",
    ).run(
      card,
      audience,
      actor,
      Number(current.visible),
      Number(visible),
      note,
      version,
      new Date().toISOString(),
    );
    db.exec("COMMIT");
    return { card, audience, visible, version };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
