import type { DashboardAudience } from "../domain/dashboard-card-catalog";
import type { PlanId } from "@/features/plans/types/plans";
export type Policy = { audiences: DashboardAudience[]; plans: PlanId[]; workspaces: string[] };
export type History = {
  revision: number;
  policy: Policy;
  reason: string;
  actor: string;
  createdAt: string;
  effectiveAt: string;
  cancelled: boolean;
};
export type Release = {
  revision: number;
  draft: Policy | null;
  reason: string;
  history: History[];
  warnings: string[];
};
export type Workspace = { id: string; full_name: string };
export const planNames: Record<PlanId, string> = {
  free: "Free",
  premium: "Premium",
  lifetime: "Lifetime",
};
