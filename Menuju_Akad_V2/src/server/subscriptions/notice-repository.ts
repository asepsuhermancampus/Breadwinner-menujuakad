import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { SubscriptionNotice, NoticeAction } from "@/features/subscriptions/types";
import { advanceNotice } from "@/features/subscriptions/domain/guide-state";
import { PaymentError } from "@/server/payments/errors";
export function readNotice(db: DatabaseSync, owner: string): SubscriptionNotice | null {
  const row = db
    .prepare(
      `SELECT n.* FROM subscription_notices n JOIN subscription_grants g ON g.id=n.grant_id
    WHERE n.owner=? AND n.state IN ('new','started') AND (g.expires_at IS NULL OR g.expires_at>?)
    ORDER BY g.granted_at DESC LIMIT 1`,
    )
    .get(owner, new Date().toISOString());
  return row
    ? {
        grantId: String(row["grant_id"]),
        capabilities: JSON.parse(String(row["capabilities"])) as SubscriptionNotice["capabilities"],
        state: row["state"] as SubscriptionNotice["state"],
        step: Number(row["step"]),
      }
    : null;
}
export function updateNotice(
  db: DatabaseSync,
  owner: string,
  grantId: string,
  action: NoticeAction,
  expectedStep: number,
) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const row = db
      .prepare("SELECT * FROM subscription_notices WHERE owner=? AND grant_id=?")
      .get(owner, grantId);
    if (!row) throw new PaymentError("Panduan tidak ditemukan", 404);
    const current: SubscriptionNotice = {
      grantId,
      capabilities: JSON.parse(String(row["capabilities"])) as SubscriptionNotice["capabilities"],
      state: row["state"] as SubscriptionNotice["state"],
      step: Number(row["step"]),
    };
    const next = advanceNotice(current, action, expectedStep);
    db.prepare("UPDATE subscription_notices SET state=?,step=? WHERE owner=? AND grant_id=?").run(
      next.state,
      next.step,
      owner,
      grantId,
    );
    db.exec("COMMIT");
    return next;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
