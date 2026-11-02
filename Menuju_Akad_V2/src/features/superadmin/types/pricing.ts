import type { PlanId } from "@/features/plans/types/plans";

export interface PlanPricingItem {
  planId: PlanId;
  label: string;
  amount: number;
  defaultAmount: number;
  isCustom: boolean;
  version: number;
  updatedAt: string | null;
}

export interface PlanPricingAuditEntry {
  id: number;
  planId: string;
  actor: string;
  oldAmount: number;
  newAmount: number;
  reason: string;
  version: number;
  createdAt: string;
}

