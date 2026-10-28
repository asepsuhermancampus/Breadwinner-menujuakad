import type { SubscriptionSnapshot } from "@/features/plans/domain/subscription";
export interface CustomerProfile {
  fullName: string;
  partnerName: string | null;
  nickname?: string;
  partnerNickname?: string | null;
  photoUrl?: string | null;
  partnerPhotoUrl?: string | null;
}
export interface CustomerWorkspace {
  partnerAccess?: { state: "locked" | "invited" | "connected"; expiresAt?: string | null };
  ownerSide?: "groom" | "bride" | null;
  role: "owner" | "partner";
  id: string;
  profile: CustomerProfile;
  subscription: SubscriptionSnapshot;
  revision: number;
}
