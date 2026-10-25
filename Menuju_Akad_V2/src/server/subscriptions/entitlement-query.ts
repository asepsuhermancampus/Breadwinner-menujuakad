import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { SubscriptionSnapshot } from "@/features/plans/domain/subscription";
import { capabilitiesFor } from "@/features/plans/domain/capabilities";

export function readEntitlement(
  db: DatabaseSync,
  owner: string,
  now = new Date(),
): SubscriptionSnapshot {
  const rows = db
    .prepare(
      `SELECT * FROM subscription_grants WHERE owner=?
    AND (expires_at IS NULL OR expires_at>?) ORDER BY CASE WHEN plan_id='lifetime' THEN 0 ELSE 1 END,
    expires_at DESC, granted_at DESC`,
    )
    .all(owner, now.toISOString());
  const grant = rows[0];
  const planId = grant ? (grant["plan_id"] as "premium" | "lifetime") : "free";
  return {
    planId,
    expiresAt: (grant?.["expires_at"] as string | null) ?? null,
    capabilities: capabilitiesFor(planId),
    latestGrantId: grant ? String(grant["id"]) : null,
  };
}
