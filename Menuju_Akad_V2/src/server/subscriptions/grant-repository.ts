import "server-only";
import { randomUUID } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import type { DbInvoice } from "@/server/payments/db-schema";
import { capabilitiesFor } from "@/features/plans/domain/capabilities";
import { addCalendarMonths } from "@/features/plans/domain/subscription-period";
import { isWithinOriginalPrice } from "@/features/payments/domain/payment-pricing";
import { readEntitlement } from "./entitlement-query";
import { recordSettlementIssue } from "./settlement-issue";

// Caller owns BEGIN/COMMIT so invoice, grant and notice commit together.
export function grantSettledInvoice(db: DatabaseSync, invoice: DbInvoice, now = new Date()): void {
  if (
    invoice.purpose !== "subscription" ||
    invoice.environment !== "production" ||
    invoice.status !== "paid" ||
    !invoice.plan_id ||
    invoice.owner.startsWith("guest:") ||
    !isWithinOriginalPrice(invoice.amount, invoice.original_amount, invoice.total_amount)
  )
    return;
  if (db.prepare("SELECT 1 FROM subscription_grants WHERE order_id=?").get(invoice.order_id))
    return;
  if (
    invoice.discount_amount > 0 &&
    db.prepare("SELECT 1 FROM subscription_grants WHERE owner=? LIMIT 1").get(invoice.owner)
  ) {
    recordSettlementIssue(db, invoice);
    return;
  }
  const before = readEntitlement(db, invoice.owner, now);
  if (before.planId === "lifetime") {
    recordSettlementIssue(db, invoice);
    return;
  }
  const startsAt =
    before.expiresAt && before.expiresAt > now.toISOString() ? before.expiresAt : now.toISOString();
  const expires =
    invoice.plan_id === "lifetime"
      ? null
      : addCalendarMonths(startsAt, invoice.duration_months ?? 6);
  const id = randomUUID(),
    capabilities = capabilitiesFor(invoice.plan_id);
  db.prepare(
    `INSERT INTO subscription_grants(id,order_id,owner,plan_id,granted_at,expires_at,capabilities)
    VALUES(?,?,?,?,?,?,?)`,
  ).run(
    id,
    invoice.order_id,
    invoice.owner,
    invoice.plan_id,
    now.toISOString(),
    expires,
    JSON.stringify(capabilities),
  );
  const added = capabilities.filter((item) => !before.capabilities.includes(item));
  db.prepare(
    `INSERT INTO subscription_notices(grant_id,owner,capabilities,state,step) VALUES(?,?,?,?,0)`,
  ).run(id, invoice.owner, JSON.stringify(added), added.length ? "new" : "completed");
}
