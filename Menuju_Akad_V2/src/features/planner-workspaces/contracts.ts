export type OnboardingStep = "profile" | "events" | "partner" | "success";
export type EventKind = "engagement" | "wedding";
export type PlanningScope = EventKind | "both";

export interface PersonProfile {
  fullName: string;
  nickname: string;
  father: string;
  mother: string;
  photoUrl: string | null;
}

export interface CoupleProfile {
  groom: PersonProfile;
  bride: PersonProfile;
  culture: string;
  actorRole: "bride" | "groom";
}

export interface EventPlan {
  id: string;
  kind: EventKind;
  date: string;
  city: string;
  venue: string;
  address: string;
  budgetIdr: number;
  guestEstimate: number;
}

export interface WorkspaceMembership {
  actorId: string;
  workspaceId: string;
  role: "owner" | "partner";
}

export interface PartnerInvite {
  token: string;
  workspaceId: string;
  ownerId: string;
  expiresAt: number;
  status: "pending" | "revoked" | "used";
  redeemedBy: string | null;
}

export interface OnboardingDraft {
  workspaceId: string;
  actorId: string;
  version: number;
  profile: CoupleProfile;
  scope: PlanningScope;
  events: Record<EventKind, EventPlan>;
  invite: PartnerInvite | null;
  members: WorkspaceMembership[];
}

export type WorkspaceErrorCode =
  | "offline"
  | "forbidden"
  | "stale"
  | "upload"
  | "expired"
  | "revoked"
  | "used"
  | "wrong-owner"
  | "duplicate-member"
  | "invalid";

export class WorkspaceFault extends Error {
  constructor(
    public readonly code: WorkspaceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "WorkspaceFault";
  }
}

export interface WorkspaceAdapter {
  now(): number;
  loadDraft(workspaceId: string): Promise<OnboardingDraft | null>;
  saveDraft(draft: OnboardingDraft, expectedVersion: number): Promise<OnboardingDraft>;
  uploadPhoto(file: File): Promise<string>;
  createInvite(workspaceId: string): Promise<PartnerInvite>;
  getInvite(token: string): Promise<PartnerInvite>;
  revokeInvite(token: string): Promise<PartnerInvite>;
  redeemInvite(token: string, actorId: string): Promise<PartnerInvite>;
}
