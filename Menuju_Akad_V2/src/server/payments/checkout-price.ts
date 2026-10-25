import "server-only";
import type { DatabaseSync } from "node:sqlite";
import { pricePlan, type PaidPlanId } from "@/features/plans/domain/catalog";
import { purchaseOffer } from "@/server/subscriptions/purchase-offer";
import { PaymentError } from "./errors";
import type { CheckoutPrincipal } from "./intent-types";
export interface ReserveOptions {
  replaceIntentId?: string;
  renewal?: boolean;
}
export function checkoutPrice(
  db: DatabaseSync,
  principal: CheckoutPrincipal,
  plan: PaidPlanId,
  claim: boolean,
  options: ReserveOptions,
) {
  const offer = principal.kind === "owner" ? purchaseOffer(db, principal.owner) : null;
  if (
    offer?.subscription.planId === "lifetime" ||
    (offer?.subscription.planId === "premium" && plan === "premium" && !options.renewal)
  )
    throw new PaymentError(
      "Paket sudah aktif. Gunakan perpanjangan atau pilih paket lebih tinggi.",
      409,
    );
  if (claim && offer && !offer.newBuyer)
    throw new PaymentError("Diskon pengguna baru hanya untuk pembelian paket pertama.", 409);
  if (options.renewal && (plan !== "premium" || offer?.subscription.planId !== "premium"))
    throw new PaymentError("Perpanjangan hanya untuk Premium aktif.", 409);
  const price = pricePlan(plan, claim),
    credit = plan === "lifetime" ? (offer?.upgradeCredit ?? 0) : 0;
  return {
    ...price,
    amount: price.amount - credit,
    credit,
    source: credit ? offer!.upgradeSourceId : null,
    until: credit ? offer!.upgradeValidUntil : null,
  };
}
