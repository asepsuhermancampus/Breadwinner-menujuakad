import type { PaidPlanId } from "@/features/plans/domain/catalog";
import type { InvoiceStatus } from "./types";
export interface PlanQuote {
  intentId: string;
  planId: PaidPlanId;
  originalAmount: number;
  discountAmount: number;
  amount: number;
  uniqueAmount: number | null;
  totalAmount: number | null;
  status: InvoiceStatus;
  expiresAt: string | null;
  eligibility: "verified" | "requires-login";
  cancelledAt?: string | null;
  upgradeCredit?: number;
  upgradeValidUntil?: string | null;
  blockedReason?: string;
}
