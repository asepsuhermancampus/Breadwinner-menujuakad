import type { RsvpStatus } from "@/features/guest-crm/types/guest";

export type FollowUpGuest = {
  id: string;
  name: string;
  category: string;
  side: string;
  quota: number;
  lastWaDate: string;
  lastSentAt: string | null;
  contactPhone: string;
  rsvpStatus: RsvpStatus;
  consent: "Diberikan" | "Tidak ada" | "Dicabut";
  selected: boolean;
};

export type FollowUpExclusionCode =
  "consent" | "phone" | "answered" | "cooldown" | "duplicate" | "missing";

export type FollowUpDispatchResult = {
  queuedIds: string[];
  excluded: { id: string; name: string; code: FollowUpExclusionCode; reason: string }[];
};

export type FollowUpFilters = {
  side: string;
  session: string;
  condition: string;
};
