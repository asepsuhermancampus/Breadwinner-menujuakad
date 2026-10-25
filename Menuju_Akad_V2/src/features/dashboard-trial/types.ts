export type TrialResourceKind =
  | "tasks"
  | "documents"
  | "guests"
  | "finance"
  | "invitations"
  | "moodboard"
  | "studio-drafts"
  | "calendar"
  | "rundown"
  | "seserahan"
  | "emergency"
  | "catering"
  | "vendor-favorites";
export type TrialFeatureKind = TrialResourceKind | "pdf";
export interface TrialSnapshot {
  version: 2;
  revision: number;
  used: Partial<Record<TrialFeatureKind, number>>;
  resources: Partial<Record<TrialResourceKind, unknown[]>>;
  documentTemplate?: number;
}
export type TrialCommitResult =
  | { ok: true; snapshot: TrialSnapshot; changed: boolean }
  | { ok: false; reason: "limit" | "invalid" | "conflict" | "storage"; message: string };
