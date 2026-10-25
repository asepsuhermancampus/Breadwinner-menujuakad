import type { Capability } from "@/features/plans/domain/capabilities";
export interface SubscriptionNotice {
  grantId: string;
  capabilities: readonly Capability[];
  state: "new" | "started" | "dismissed" | "completed";
  step: number;
}
export type NoticeAction = "start" | "next" | "back" | "dismiss" | "complete";
