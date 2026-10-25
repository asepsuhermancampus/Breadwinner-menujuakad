import "server-only";
import { randomUUID } from "node:crypto";
import type { PaymentDatabase } from "./db";
import type { CheckoutPrincipal, PaymentEnvironment } from "./intent-types";
import { getPlan, type PaidPlanId } from "@/features/plans/domain/catalog";
import type { checkoutPrice, ReserveOptions } from "./checkout-price";
export function insertIntent(
  db: PaymentDatabase,
  environment: PaymentEnvironment,
  principal: CheckoutPrincipal,
  planId: PaidPlanId,
  price: ReturnType<typeof checkoutPrice>,
  options: ReserveOptions,
) {
  const id = randomUUID(),
    orderId = `MA-${Date.now()}-${randomUUID().slice(0, 8)}`,
    now = Date.now(),
    plan = getPlan(planId);
  const owner = principal.kind === "owner" ? principal.owner : `guest:${principal.hash}`;
  db.storage()
    .prepare(
      `INSERT INTO invoices(order_id,owner,environment,amount,original_amount,discount_amount,
    upgrade_credit_amount,status,last_checked_at,created_at,updated_at,purpose,plan_id,catalog_revision,duration_months,intent_id)
    VALUES(?,?,?,?,?,?,?,'creating',0,?,?,'subscription',?,?,?,?)`,
    )
    .run(
      orderId,
      owner,
      environment,
      price.amount,
      price.originalAmount,
      price.discountAmount,
      price.credit,
      now,
      now,
      planId,
      plan.revision,
      plan.durationMonths,
      id,
    );
  db.storage()
    .prepare(
      `INSERT INTO checkout_intents(id,guest_hash,owner,environment,plan_id,order_id,created_at,credit_source_id,credit_valid_until,renewal)
    VALUES(?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(
      id,
      principal.kind === "guest" ? principal.hash : null,
      principal.kind === "owner" ? principal.owner : null,
      environment,
      planId,
      orderId,
      now,
      price.source,
      price.until,
      options.renewal ? 1 : 0,
    );
  return id;
}
