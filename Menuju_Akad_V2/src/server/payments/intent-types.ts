import type { PaidPlanId } from "@/features/plans/domain/catalog";
export type CheckoutPrincipal = { kind: "owner"; owner: string } | { kind: "guest"; hash: string };
export type PaymentEnvironment = "production" | "sandbox";
export interface CheckoutIntent {
  id: string;
  guestHash: string | null;
  owner: string | null;
  environment: PaymentEnvironment;
  planId: PaidPlanId;
  orderId: string;
  amount: number;
  originalAmount: number;
  discountAmount: number;
  upgradeCredit: number;
  cancelledAt: string | null;
  creditSourceId: string | null;
  creditValidUntil: string | null;
  revealedAt: string | null;
  renewal: boolean;
  createdAt: number;
}
