import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { getPlan, type PaidPlanId } from "@/features/plans/domain/catalog";
import type { PlanId } from "@/features/plans/types/plans";
import type {
  PlanPricingItem,
  PlanPricingAuditEntry,
} from "@/features/superadmin/types/pricing";
import { PaymentError } from "./errors";

export type { PlanPricingItem, PlanPricingAuditEntry };

export function initializePlanPricing(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS plan_pricing_settings (
      plan_id TEXT PRIMARY KEY CHECK(plan_id IN ('free','premium','lifetime')),
      amount INTEGER NOT NULL CHECK(amount >= 0),
      version INTEGER NOT NULL CHECK(version >= 0),
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS plan_pricing_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id TEXT NOT NULL,
      actor TEXT NOT NULL,
      old_amount INTEGER NOT NULL,
      new_amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      version INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_plan_pricing_audit ON plan_pricing_audit(id DESC);
  `);
}

export function getEffectivePlanPrice(db: DatabaseSync, planId: PlanId): number {
  if (planId === "free") return 0;
  try {
    const row = db
      .prepare("SELECT amount FROM plan_pricing_settings WHERE plan_id=?")
      .get(planId) as { amount?: number } | undefined;
    if (row && typeof row.amount === "number") return row.amount;
  } catch {
    // fallback if table is not yet initialized
  }
  return getPlan(planId).originalAmount;
}

export function readPlanPricing(db: DatabaseSync): PlanPricingItem[] {
  initializePlanPricing(db);
  const plans: PlanId[] = ["free", "premium", "lifetime"];
  return plans.map((id) => {
    const def = getPlan(id);
    const row = db
      .prepare("SELECT amount, version, updated_at FROM plan_pricing_settings WHERE plan_id=?")
      .get(id) as { amount: number; version: number; updated_at: string } | undefined;
    const amount = row ? Number(row.amount) : def.originalAmount;
    return {
      planId: id,
      label: def.label,
      amount,
      defaultAmount: def.originalAmount,
      isCustom: amount !== def.originalAmount,
      version: row ? Number(row.version) : 0,
      updatedAt: row?.updated_at ?? null,
    };
  });
}

export function readPlanPricingAudit(db: DatabaseSync, limit = 30): PlanPricingAuditEntry[] {
  initializePlanPricing(db);
  const rows = db
    .prepare(
      `SELECT id, plan_id AS planId, actor, old_amount AS oldAmount, new_amount AS newAmount,
       reason, version, created_at AS createdAt FROM plan_pricing_audit ORDER BY id DESC LIMIT ?`,
    )
    .all(limit) as unknown as PlanPricingAuditEntry[];
  return rows;
}

export function updatePlanPrice(
  db: DatabaseSync,
  actor: string,
  planId: PaidPlanId,
  newAmount: number,
  reason: string,
  expectedVersion: number,
): { planId: PaidPlanId; amount: number; version: number } {
  const note = reason.trim();
  if (planId !== "premium" && planId !== "lifetime") {
    throw new PaymentError("Hanya paket berbayar yang dapat disesuaikan harganya.", 400);
  }
  if (!Number.isSafeInteger(newAmount) || newAmount < 10000 || newAmount > 100000000) {
    throw new PaymentError("Harga paket harus berupa angka valid antara Rp 10.000 dan Rp 100.000.000.", 400);
  }
  if (!note || note.length < 3 || note.length > 500) {
    throw new PaymentError("Alasan perubahan wajib diisi (antara 3 hingga 500 karakter).", 400);
  }
  if (!actor.trim()) {
    throw new PaymentError("Identitas superadmin tidak valid.", 401);
  }

  initializePlanPricing(db);
  db.exec("BEGIN IMMEDIATE");
  try {
    const currentList = readPlanPricing(db);
    const current = currentList.find((p) => p.planId === planId);
    if (!current) throw new PaymentError("Paket tidak ditemukan.", 404);

    if (current.version !== expectedVersion) {
      throw new PaymentError("Pengaturan harga telah berubah. Silakan muat ulang halaman.", 409);
    }
    if (current.amount === newAmount) {
      throw new PaymentError("Harga baru sama dengan harga yang sedang aktif.", 400);
    }

    const nextVersion = current.version + 1;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO plan_pricing_settings(plan_id, amount, version, updated_at)
      VALUES(?, ?, ?, ?)
      ON CONFLICT(plan_id) DO UPDATE SET
        amount=excluded.amount,
        version=excluded.version,
        updated_at=excluded.updated_at
    `).run(planId, newAmount, nextVersion, now);

    db.prepare(`
      INSERT INTO plan_pricing_audit(plan_id, actor, old_amount, new_amount, reason, version, created_at)
      VALUES(?, ?, ?, ?, ?, ?, ?)
    `).run(planId, actor.trim(), current.amount, newAmount, note, nextVersion, now);

    db.exec("COMMIT");
    return { planId, amount: newAmount, version: nextVersion };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
