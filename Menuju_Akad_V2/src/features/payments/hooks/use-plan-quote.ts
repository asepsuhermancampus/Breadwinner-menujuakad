"use client";
import type { PaidPlanId } from "@/features/plans/domain/catalog";
import { usePlanPurchase } from "./plan-purchase-context";
export function usePlanQuote(planId: PaidPlanId | "free") {
  const state = usePlanPurchase();
  return {
    ...state,
    quote: state.quote?.planId === planId && !state.quote.cancelledAt ? state.quote : null,
    reserve: (claim: boolean) =>
      planId === "free" ? Promise.resolve(null) : state.reserve(planId, claim),
  };
}
