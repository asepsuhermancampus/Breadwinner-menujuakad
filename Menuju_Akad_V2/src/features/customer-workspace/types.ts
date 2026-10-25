import type { SubscriptionSnapshot } from "@/features/plans/domain/subscription";
export interface CustomerProfile {
  fullName: string;
  partnerName: string | null;
}
export interface CustomerWorkspace {
  role: "owner" | "partner";
  id: string;
  profile: CustomerProfile;
  subscription: SubscriptionSnapshot;
  revision: number;
}
