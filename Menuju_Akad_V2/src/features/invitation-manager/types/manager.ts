export type InvitationProjectState = "PUBLISHED" | "DRAFT";

export type InvitationProject = {
  id: string;
  kind: "WEDDING" | "ENGAGEMENT" | "WEDDING_VIP";
  state: InvitationProjectState;
  title: string;
  eventDateText: string;
  invitationCount: number | null;
  activeVersion: number | null;
  draftVersion: number | null;
  slug: string | null;
  draftSlug?: string | null;
  slugStatus: "LIVE" | "NOT_PUBLISHED";
  sourcePool: string | null;
  thumbnail: string;
};

export type InvitationManagerSummary = {
  projectCount: number;
  publishedCount: number;
  draftCount: number;
  weddingGuestPoolLabel: string;
  activeVersionLabel: string;
  activeVersionNote: string;
  packageLabel: string;
};

export type SlugCheckResult =
  | { status: "AVAILABLE"; slug: string }
  | { status: "TAKEN"; slug: string }
  | { status: "INVALID"; slug: string; reason: string };

export type DomainRecordRow = {
  type: "CNAME" | "TXT";
  host: string;
  value: string;
  detected: boolean;
  note: string;
};

export type DomainCheck = {
  id: "TXT_OWNERSHIP" | "CNAME_TARGET" | "HTTPS_CERT";
  label: string;
  state:
    | "Menunggu"
    | "Sesuai · simulasi"
    | "Terdeteksi · simulasi"
    | "Belum diterbitkan"
    | "Tercipta · simulasi";
  pass: boolean;
};

export type DomainSetup = {
  domain: string;
  records: DomainRecordRow[];
  checks: DomainCheck[];
  simulated: boolean;
  releaseNote: string;
};

export type ThemeComparisonRow = {
  aspect: string;
  editorial: string;
  cypress: string;
};

export type AnalyticsDay = { label: string; sessions: number };

export type AnalyticsFixture = {
  range: string;
  uniqueVisitors: number;
  sessions: number;
  personalOpens: number;
  onlineAnswers: number;
  onlineConversion: number;
  daily: AnalyticsDay[];
  devices: { label: string; sessions: number }[];
  funnel: { label: string; value: number }[];
  reconciliation: {
    onlineAttend: number;
    onlineDecline: number;
    manualAttend: number;
    manualDecline: number;
    crmAttend: number;
    crmDecline: number;
  };
};

export type ModerationItem = {
  id: string;
  guest: string;
  kind: "Foto" | "Ucapan";
  submittedAt: string;
  status: "Menunggu" | "Ditampilkan" | "Disembunyikan";
  publicName: string;
  consentEvidence: string;
  publicationConsent: boolean;
  version: number;
  audit: { status: string; reason: string; version: number; at: string; actor: string }[];
  body?: string;
  photo?: string;
};

export type ModerationSummary = {
  pendingTotal: number;
  pendingWishes: number;
  pendingPhotos: number;
  shown: number;
  hidden: number;
  mode: string;
};
