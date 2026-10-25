import type { SubscriptionSnapshot } from "@/features/plans/domain/subscription";
export interface PurchaseOffer {
  subscription: SubscriptionSnapshot;
  newBuyer: boolean;
  upgradeCredit: number;
  upgradeSourceId: string | null;
  upgradeValidUntil: string | null;
  lifetimeAmount: number;
  reminderDays: number | null;
}
