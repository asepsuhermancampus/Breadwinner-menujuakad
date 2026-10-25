"use client";
import { createContext, useContext } from "react";
import type { PlanQuote } from "../checkout-types";
import type { PurchaseOffer } from "../purchase-offer";
import type { PaidPlanId } from "@/features/plans/domain/catalog";
export interface PlanPurchaseState {
  quote: PlanQuote | null;
  offer: PurchaseOffer | null;
  pending: boolean;
  loading: boolean;
  error: string;
  reserve: (plan: PaidPlanId, claim: boolean) => Promise<PlanQuote | null>;
}
export const PlanPurchaseContext = createContext<PlanPurchaseState | null>(null);
export function usePlanPurchase() {
  const state = useContext(PlanPurchaseContext);
  if (!state) throw new Error("Plan purchase provider missing");
  return state;
}
