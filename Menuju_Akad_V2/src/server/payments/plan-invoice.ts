import "server-only";
import type { PaymentDatabase } from "./db";
import type { CheckoutIntent } from "./intent-types";
import { checkoutPrice } from "./checkout-price";
import { PaymentError } from "./errors";
import { toInvoiceView } from "./invoice-validation";
import { purchaseOffer } from "@/server/subscriptions/purchase-offer";
import { isWithinOriginalPrice } from "@/features/payments/domain/payment-pricing";
export function planInvoice(
  db: PaymentDatabase,
  intent: CheckoutIntent,
  owner: string,
  reveal = true,
) {
  let row = db.getByOrderId(intent.orderId)!;
  if (row.purpose !== "subscription" || row.plan_id !== intent.planId)
    throw new PaymentError("Pesanan tidak sesuai", 409);
  if (!row.cancelled_at && row.status !== "paid") {
    const offer = purchaseOffer(db.storage(), owner);
    const changed =
      (intent.discountAmount > 0 && !offer.newBuyer) ||
      offer.subscription.planId === "lifetime" ||
      (intent.planId === "premium" && offer.subscription.planId === "premium" && !intent.renewal) ||
      (intent.planId === "lifetime" && !intent.creditSourceId && offer.upgradeCredit > 0);
    if (changed) {
      db.storage()
        .prepare("UPDATE invoices SET cancelled_at=? WHERE order_id=? AND status!='paid'")
        .run(new Date().toISOString(), intent.orderId);
      row = db.getByOrderId(intent.orderId)!;
    } else if (!intent.revealedAt) {
      const price = checkoutPrice(
        db.storage(),
        { kind: "owner", owner },
        intent.planId,
        intent.discountAmount > 0,
        { renewal: intent.renewal },
      );
      if (price.credit !== intent.upgradeCredit || price.source !== intent.creditSourceId) {
        if (reveal)
          throw new PaymentError(
            "Harga atau kelayakan paket berubah. Batalkan pesanan dan pilih kembali paket.",
            409,
          );
        db.storage()
          .prepare("UPDATE invoices SET cancelled_at=? WHERE order_id=? AND status!='paid'")
          .run(new Date().toISOString(), intent.orderId);
        row = db.getByOrderId(intent.orderId)!;
      }
      if (
        reveal &&
        !row.cancelled_at &&
        row.qr_image &&
        row.status === "pending" &&
        isWithinOriginalPrice(row.amount, row.original_amount, row.total_amount)
      )
        db.storage()
          .prepare("UPDATE checkout_intents SET revealed_at=? WHERE id=? AND revealed_at IS NULL")
          .run(new Date().toISOString(), intent.id);
    }
  }
  if (
    reveal &&
    !row.cancelled_at &&
    row.total_amount !== null &&
    !isWithinOriginalPrice(row.amount, row.original_amount, row.total_amount)
  )
    throw new PaymentError(
      "Total pembayaran melebihi harga paket. Pembayaran tidak dilanjutkan.",
      409,
    );
  const issue = db
    .storage()
    .prepare("SELECT reason FROM payment_settlement_issues WHERE order_id=? AND owner=?")
    .get(row.order_id, owner);
  return {
    ...toInvoiceView(row),
    accessReady: Boolean(
      db
        .storage()
        .prepare("SELECT 1 FROM subscription_grants WHERE order_id=? AND owner=?")
        .get(row.order_id, owner),
    ),
    ...(issue ? { settlementIssue: String(issue["reason"]) } : {}),
  };
}
