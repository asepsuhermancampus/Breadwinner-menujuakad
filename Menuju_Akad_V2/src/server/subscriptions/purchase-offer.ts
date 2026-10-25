import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { getPlan } from "@/features/plans/domain/catalog";
import { addCalendarMonths } from "@/features/plans/domain/subscription-period";
import type { PurchaseOffer } from "@/features/payments/purchase-offer";
import { readEntitlement } from "./entitlement-query";
export function purchaseOffer(db: DatabaseSync, owner: string, now = new Date()): PurchaseOffer {
  const subscription = readEntitlement(db, owner, now);
  const rows = db
    .prepare(
      `SELECT g.*,i.amount FROM subscription_grants g
    JOIN invoices i ON i.order_id=g.order_id WHERE g.owner=? AND i.status='paid'
    AND i.environment='production' ORDER BY g.granted_at ASC,g.rowid ASC`,
    )
    .all(owner);
  let first = rows.findIndex((row) => row["id"] === subscription.latestGrantId);
  while (
    first > 0 &&
    rows[first - 1]!["plan_id"] === "premium" &&
    String(rows[first - 1]!["expires_at"]) >= String(rows[first]!["granted_at"])
  )
    first--;
  const source = first >= 0 && subscription.planId === "premium" ? rows[first] : null;
  const until = source ? addCalendarMonths(String(source["granted_at"]), 2) : null;
  const credit = source && until! >= now.toISOString() ? Number(source["amount"]) : 0;
  const remaining =
    subscription.planId === "premium" && subscription.expiresAt
      ? Date.parse(subscription.expiresAt) - now.getTime()
      : 0;
  return {
    subscription,
    newBuyer: rows.length === 0,
    upgradeCredit: credit,
    upgradeSourceId: credit ? String(source!["id"]) : null,
    upgradeValidUntil: until,
    lifetimeAmount: getPlan("lifetime").originalAmount - credit,
    reminderDays:
      remaining > 0 && remaining <= 15 * 86400000 ? Math.ceil(remaining / 86400000) : null,
  };
}
