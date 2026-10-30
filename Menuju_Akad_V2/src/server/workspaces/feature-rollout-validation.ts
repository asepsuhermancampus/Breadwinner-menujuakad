import { PaymentError } from "@/server/payments/errors";
import {
  isControllableFeature,
  type AvailabilityFeature,
} from "@/features/customer-workspace/domain/feature-availability-catalog";
import type { DashboardAudience } from "@/features/customer-workspace/domain/dashboard-card-catalog";
import type { PlanId } from "@/features/plans/types/plans";
export type RolloutPolicy = {
  audiences: readonly DashboardAudience[];
  plans: readonly PlanId[];
  workspaces: readonly string[];
};
const audiences = ["guest", "owner", "partner"];
const plans = ["free", "premium", "lifetime"];
export function validateRollout(
  feature: AvailabilityFeature,
  policy: RolloutPolicy,
  actor: string,
  reason: string,
  revision: number,
) {
  if (
    !isControllableFeature(feature) ||
    typeof actor !== "string" ||
    !actor.trim() ||
    typeof reason !== "string" ||
    !reason.trim() ||
    reason.length > 500 ||
    !Number.isSafeInteger(revision) ||
    revision < 0 ||
    !policy ||
    !Array.isArray(policy.audiences) ||
    !Array.isArray(policy.plans) ||
    !Array.isArray(policy.workspaces) ||
    !policy.audiences.length ||
    !policy.plans.length ||
    policy.audiences.some((x) => !audiences.includes(x)) ||
    policy.plans.some((x) => !plans.includes(x)) ||
    policy.workspaces.length > 500 ||
    policy.workspaces.some((x) => typeof x !== "string" || !x.trim() || x.length > 128) ||
    new Set(policy.audiences).size !== policy.audiences.length ||
    new Set(policy.plans).size !== policy.plans.length ||
    new Set(policy.workspaces).size !== policy.workspaces.length
  )
    throw new PaymentError("Periksa fitur, sasaran, dan alasan rilis.", 400);
}
