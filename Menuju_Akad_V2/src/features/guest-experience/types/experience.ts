export type GuestSection =
  "home" | "story" | "guide" | "gallery" | "rsvp" | "wishes" | "moments" | "gifts";

export type GuestNavigationItem = {
  section: GuestSection;
  label: string;
  icon: string;
};

export type RsvpSession = {
  id: string;
  name: string;
  time: string;
  maxQuota: number;
  status: "ATTENDING" | "DECLINED";
  pax: number;
};

export type SessionRsvpDraft = {
  sessions: RsvpSession[];
  updatedAt: string;
};

export type WishEntry = {
  id: string;
  publicName: string;
  body: string;
};

export type MomentUpload = {
  fileName: string;
  fileSizeMb: number;
  mimeType: "image/jpeg" | "image/png";
  consent: boolean;
  status: "DRAFT" | "QUEUED" | "MODERATION" | "REJECTED";
};

export type GiftAccount = {
  bank: string;
  recipient: string;
  maskedAccount: string;
};

export type GuestExperienceContent = {
  eyebrow: string;
  heading: string;
  couple: { name: string; family: string }[];
  story: { year: string; description: string }[];
  eventNote: { title: string; body: string };
  dressTones: string[];
  gallery: { src: string; alt: string; caption: string }[];
  wishes: WishEntry[];
  giftsInactive: boolean;
};

export type SessionValidation =
  { ok: true } | { ok: false; reason: "deadline" | "quota" | "invalid" };
