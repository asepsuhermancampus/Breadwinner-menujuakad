export type PlatformOperationsView =
  "notifications" | "helpdesk" | "cms" | "health" | "accounts" | "owner-help";
export type OperationsRole = "superadmin" | "finance" | "support";
export type Scenario = "ready" | "loading" | "empty" | "offline" | "revoked" | "stale" | "failure";
export type Feedback = { ok: boolean; message: string };
export type GateContext = {
  role: OperationsRole;
  scenario: Scenario;
  action: string;
  expectedVersion: number;
  version: number;
  sessionValid?: boolean;
  ownerId?: string;
  actorId?: string;
  assigned?: boolean;
  eventId?: string;
  eventScope?: string[];
  entitlement?: boolean;
  availability?: "Live" | "Maintenance" | "Hidden" | "Coming Soon";
  parentAvailability?: "Live" | "Maintenance" | "Hidden" | "Coming Soon";
};
export type NotificationLog = {
  id: string;
  recipient: string;
  channel: "WhatsApp" | "Email" | "In-App";
  status: "failed" | "delivered" | "unknown" | "queued" | "canceled";
  reason: string;
  consent: boolean;
  templateValid: boolean;
  cooldownUntil: number;
  campaignKey: string;
  version: number;
};
export type Ticket = {
  id: string;
  ownerId: string;
  owner: string;
  title: string;
  priority: string;
  status: string;
  version: number;
  assigned: boolean;
};
export type TicketMessage = { id: string; author: string; text: string; internal: boolean };
export type ContentEntry = {
  id: string;
  title: string;
  category: string;
  active: number;
  draft: number | null;
  text: string;
  publishedText?: string;
};
export type AccountEntry = {
  id: string;
  name: string;
  scope: string;
  status: string;
  version: number;
  admin: boolean;
  sessions: number;
};
