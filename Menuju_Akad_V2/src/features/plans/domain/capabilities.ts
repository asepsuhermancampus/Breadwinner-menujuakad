import type { PlanId } from "../types/plans";

export type Capability =
  | "workspace"
  | "basic-documents"
  | "basic-finance"
  | "basic-template"
  | "guests-100"
  | "unlimited-guests"
  | "unlimited-tasks"
  | "premium-templates"
  | "studio"
  | "moodboard"
  | "pdf"
  | "multi-invitation"
  | "custom-domain"
  | "priority-support";

const free: readonly Capability[] = [
  "workspace",
  "basic-documents",
  "basic-finance",
  "basic-template",
  "guests-100",
];
const premium: readonly Capability[] = [
  ...free,
  "unlimited-guests",
  "unlimited-tasks",
  "premium-templates",
  "studio",
  "moodboard",
  "pdf",
];
const lifetime: readonly Capability[] = [
  ...premium,
  "multi-invitation",
  "custom-domain",
  "priority-support",
];

export function capabilitiesFor(plan: PlanId): readonly Capability[] {
  return { free, premium, lifetime }[plan];
}
