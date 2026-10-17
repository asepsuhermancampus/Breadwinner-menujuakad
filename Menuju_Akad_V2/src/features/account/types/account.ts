import type { PlanAdapter, PlanEntitlement, PlanInvoice } from "@/features/plans/types/plans";

export type AccountFailureCode = "invalid" | "offline" | "revoked" | "conflict" | "unavailable";

export type AccountResult<T> =
  { ok: true; data: T } | { ok: false; code: AccountFailureCode; message: string };

export type AccountProfile = {
  fullName: string;
  email: string;
  phone: string;
  culture: string;
  roleLabel: string;
  version: number;
};

export type PartnerProfile = {
  id: string;
  fullName: string;
  nickname: string;
  email: string;
  roleLabel: string;
  accessLabel: string;
  connected: boolean;
  version: number;
};

export type NotificationPreferences = {
  inApp: boolean;
  email: boolean;
  whatsApp: boolean;
  reducedMotion: boolean;
  partnerSync: boolean;
  discoverable: boolean;
  version: number;
};

export type DeviceSession = {
  id: string;
  label: string;
  location: string;
  lastActive: string;
  current: boolean;
};

export type AccountSnapshot = {
  profile: AccountProfile;
  partner: PartnerProfile | null;
  preferences: NotificationPreferences;
  sessions: DeviceSession[];
  entitlement: PlanEntitlement;
  memberships: { id: string; label: string; detail: string }[];
  asOf: string;
  verificationHint?: string | undefined;
  invoices?: PlanInvoice[] | undefined;
};

export type ProfileInput = Omit<AccountProfile, "version" | "roleLabel"> & {
  expectedVersion: number;
};

export interface AccountAdapter extends PlanAdapter {
  saveProfile(input: ProfileInput): Promise<AccountResult<AccountProfile>>;
  savePartner(input: {
    nickname: string;
    expectedVersion: number;
  }): Promise<AccountResult<PartnerProfile>>;
  unlinkPartner(input: {
    expectedVersion: number;
  }): Promise<AccountResult<{ disconnected: boolean }>>;
  savePreferences(
    input: Omit<NotificationPreferences, "version"> & { expectedVersion: number },
  ): Promise<AccountResult<NotificationPreferences>>;
  revokeSessions(input: { ids: string[] }): Promise<AccountResult<DeviceSession[]>>;
  verifyDeletion(input: { code: string }): Promise<AccountResult<{ proof: string }>>;
  deleteAccount(input: {
    proof: string;
    confirmation: string;
    acknowledged: boolean;
  }): Promise<AccountResult<{ deleted: boolean }>>;
}
