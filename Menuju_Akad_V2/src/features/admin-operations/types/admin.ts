export type AdminRole = "superadmin" | "finance" | "support";
export type OverviewView = "executive" | "calendar" | "kyb" | "moderation";
export type ReviewItem = {
  id: string;
  vendor: string;
  kind: string;
  version: number;
  status: "pending" | "revision-required" | "approved" | "revision" | "false-positive";
  excerpt: string;
  signal: string;
  proofComplete: boolean;
};
export type ReviewAudit = {
  id: string;
  objectId: string;
  actor: string;
  reason: string;
  version: number;
  action: string;
  at: string;
};
export type ReviewState = { kyb: ReviewItem[]; moderation: ReviewItem[]; audit: ReviewAudit[] };
export type ReviewContext = {
  role: AdminRole;
  actor: string;
  online: boolean;
  sessionValid: boolean;
  canReview: boolean;
  now?: () => string;
};
export type ReviewDecision = {
  kind: "kyb" | "moderation";
  id: string;
  expectedVersion: number;
  action: "approved" | "revision" | "false-positive";
  reason: string;
  acknowledged: boolean;
  operationId: string;
};
export type CalendarRecord = {
  id: string;
  date: string;
  time: string;
  vendor: string;
  category: string;
  order: string;
  city: string;
  status: "hold" | "review" | "confirmed" | "blocked";
};
