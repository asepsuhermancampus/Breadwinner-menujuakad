import type { PlanId } from "../types/plans";
import type { Capability } from "./capabilities";

export interface SubscriptionSnapshot {
  planId: PlanId;
  expiresAt: string | null;
  capabilities: readonly Capability[];
  latestGrantId: string | null;
}
