import "server-only";
import type { ReviewTier } from "@/features/reviews/types";
import { getPaymentDatabase } from "@/server/payments/runtime";
import { readEntitlement } from "@/server/subscriptions/entitlement-query";

export function resolveUserPlanTier(
  user?: { id?: string; ownerKey?: string } | null,
): ReviewTier {
  if (!user) return "free";
  try {
    const ownerKey = user.ownerKey ?? user.id;
    if (!ownerKey) return "free";
    const paymentDb = getPaymentDatabase().storage();
    const entitlement = readEntitlement(paymentDb, ownerKey);
    if (entitlement.planId === "lifetime") return "lifetime";
    if (entitlement.planId === "premium") return "premium";
    return "free";
  } catch {
    return "free";
  }
}

