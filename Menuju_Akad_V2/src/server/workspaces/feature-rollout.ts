import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { PaymentError } from "@/server/payments/errors";
import { validateRollout, type RolloutPolicy } from "./feature-rollout-validation";
import {
  isControllableFeature,
  type AvailabilityFeature,
} from "@/features/customer-workspace/domain/feature-availability-catalog";
import type { DashboardAudience } from "@/features/customer-workspace/domain/dashboard-card-catalog";
import type { PlanId } from "@/features/plans/types/plans";

export type RolloutContext = {
  audience: DashboardAudience;
  plan: PlanId;
  workspaceId: string | null;
};

export const defaultRollout: RolloutPolicy = {
  audiences: ["guest", "owner", "partner"],
  plans: ["free", "premium", "lifetime"],
  workspaces: [],
};
export function initializeRollouts(db: DatabaseSync) {
  db.exec(`CREATE TABLE IF NOT EXISTS feature_rollout_heads(feature TEXT PRIMARY KEY, revision INTEGER NOT NULL, draft TEXT, reason TEXT);
  CREATE TABLE IF NOT EXISTS feature_rollout_history(feature TEXT NOT NULL, revision INTEGER NOT NULL, policy TEXT NOT NULL, reason TEXT NOT NULL, actor TEXT NOT NULL, created_at TEXT NOT NULL, effective_at TEXT NOT NULL, cancelled INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(feature,revision));`);
}
export function readRollout(db: DatabaseSync, feature: AvailabilityFeature) {
  if (!isControllableFeature(feature)) throw new PaymentError("Fitur tidak valid.", 400);
  const head = db
    .prepare("SELECT revision,draft,reason FROM feature_rollout_heads WHERE feature=?")
    .get(feature);
  const history = db
    .prepare(
      "SELECT revision,policy,reason,actor,created_at,effective_at,cancelled FROM feature_rollout_history WHERE feature=? ORDER BY revision DESC",
    )
    .all(feature)
    .map((row) => ({
      revision: Number(row.revision),
      policy: JSON.parse(String(row.policy)) as RolloutPolicy,
      reason: String(row.reason),
      actor: String(row.actor),
      createdAt: String(row.created_at),
      effectiveAt: String(row.effective_at),
      cancelled: row.cancelled === 1,
    }));
  return {
    revision: head ? Number(head.revision) : 0,
    draft: head?.draft ? (JSON.parse(String(head.draft)) as RolloutPolicy) : null,
    reason: head?.reason ? String(head.reason) : "",
    history,
  };
}
export function policyAllows(policy: RolloutPolicy, context: RolloutContext) {
  return (
    policy.audiences.includes(context.audience) &&
    policy.plans.includes(context.plan) &&
    (!policy.workspaces.length ||
      (context.workspaceId !== null && policy.workspaces.includes(context.workspaceId)))
  );
}
export function rolloutAllowed(
  db: DatabaseSync,
  feature: AvailabilityFeature,
  context: RolloutContext,
  now = new Date(),
) {
  const row = db
    .prepare(
      "SELECT policy FROM feature_rollout_history WHERE feature=? AND cancelled=0 AND effective_at<=? ORDER BY revision DESC LIMIT 1",
    )
    .get(feature, now.toISOString());
  return policyAllows(
    row ? (JSON.parse(String(row.policy)) as RolloutPolicy) : defaultRollout,
    context,
  );
}
function transaction<T>(db: DatabaseSync, fn: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
function check(db: DatabaseSync, feature: AvailabilityFeature, expected: number) {
  const current = readRollout(db, feature);
  if (current.revision !== expected)
    throw new PaymentError("Konfigurasi telah berubah. Muat ulang sebelum melanjutkan.", 409);
  return current;
}
export function saveRolloutDraft(
  db: DatabaseSync,
  actor: string,
  feature: AvailabilityFeature,
  policy: RolloutPolicy,
  reason: string,
  revision: number,
) {
  validateRollout(feature, policy, actor, reason, revision);
  return transaction(db, () => {
    check(db, feature, revision);
    db.prepare(
      "INSERT INTO feature_rollout_heads(feature,revision,draft,reason) VALUES(?,?,?,?) ON CONFLICT(feature) DO UPDATE SET revision=excluded.revision,draft=excluded.draft,reason=excluded.reason",
    ).run(feature, revision + 1, JSON.stringify(policy), reason.trim());
    return readRollout(db, feature);
  });
}
export function publishRollout(
  db: DatabaseSync,
  actor: string,
  feature: AvailabilityFeature,
  revision: number,
  scheduledAt: string | null,
) {
  if (
    !actor.trim() ||
    !Number.isSafeInteger(revision) ||
    revision < 0 ||
    (scheduledAt !== null &&
      (typeof scheduledAt !== "string" ||
        !Number.isFinite(Date.parse(scheduledAt)) ||
        Date.parse(scheduledAt) <= Date.now()))
  )
    throw new PaymentError("Jadwal atau konfigurasi tidak valid.", 400);
  return transaction(db, () => {
    const current = check(db, feature, revision);
    if (!current.draft) throw new PaymentError("Simpan draf sebelum publikasi.", 400);
    validateRollout(feature, current.draft, actor, current.reason, revision);
    const now = new Date().toISOString();
    db.prepare(
      "UPDATE feature_rollout_history SET cancelled=1 WHERE feature=? AND effective_at>?",
    ).run(feature, now);
    db.prepare(
      "INSERT INTO feature_rollout_history(feature,revision,policy,reason,actor,created_at,effective_at) VALUES(?,?,?,?,?,?,?)",
    ).run(
      feature,
      revision + 1,
      JSON.stringify(current.draft),
      current.reason,
      actor,
      now,
      scheduledAt ? new Date(scheduledAt).toISOString() : now,
    );
    db.prepare(
      "UPDATE feature_rollout_heads SET revision=?,draft=NULL,reason=NULL WHERE feature=?",
    ).run(revision + 1, feature);
    return readRollout(db, feature);
  });
}
export function rollbackRollout(
  db: DatabaseSync,
  actor: string,
  feature: AvailabilityFeature,
  target: number,
  reason: string,
  revision: number,
) {
  return transaction(db, () => {
    const current = check(db, feature, revision);
    const previous =
      target === 0
        ? { policy: defaultRollout }
        : current.history.find(
            (item) =>
              item.revision === target &&
              !item.cancelled &&
              item.effectiveAt <= new Date().toISOString(),
          );
    if (!previous) throw new PaymentError("Versi yang dipilih tidak tersedia untuk rollback.", 400);
    validateRollout(feature, previous.policy, actor, reason, revision);
    const now = new Date().toISOString();
    db.prepare(
      "UPDATE feature_rollout_history SET cancelled=1 WHERE feature=? AND effective_at>?",
    ).run(feature, now);
    db.prepare(
      "INSERT INTO feature_rollout_history(feature,revision,policy,reason,actor,created_at,effective_at) VALUES(?,?,?,?,?,?,?)",
    ).run(feature, revision + 1, JSON.stringify(previous.policy), reason.trim(), actor, now, now);
    db.prepare(
      "UPDATE feature_rollout_heads SET revision=?,draft=NULL,reason=NULL WHERE feature=?",
    ).run(revision + 1, feature);
    return readRollout(db, feature);
  });
}
