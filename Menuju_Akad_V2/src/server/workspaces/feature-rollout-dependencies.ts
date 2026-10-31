import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { AvailabilityFeature } from "@/features/customer-workspace/domain/feature-availability-catalog";
import type { DashboardAudience } from "@/features/customer-workspace/domain/dashboard-card-catalog";
import type { PlanId } from "@/features/plans/types/plans";
import { readFeatureAvailability } from "./feature-availability";
import { defaultRollout, policyAllows, readRollout } from "./feature-rollout";
import type { RolloutPolicy } from "./feature-rollout-validation";

export function rolloutDependencyWarnings(
  db: DatabaseSync,
  feature: AvailabilityFeature,
  draft: RolloutPolicy,
) {
  if (!["catering", "seserahan", "finance", "guests"].includes(feature)) return [];
  const current = (key: AvailabilityFeature) =>
    readRollout(db, key).history.find(
      (item) => !item.cancelled && item.effectiveAt <= new Date().toISOString(),
    )?.policy ?? defaultRollout;
  const policy = (key: AvailabilityFeature) => (feature === key ? draft : current(key));
  const conflict = (source: AvailabilityFeature, dependency: AvailabilityFeature) => {
    const a = policy(source),
      b = policy(dependency);
    const workspaces = new Set<string | null>([
      null,
      "__other_workspace__",
      ...a.workspaces,
      ...b.workspaces,
    ]);
    const audiences: DashboardAudience[] = ["guest", "owner", "partner"];
    const plans: PlanId[] = ["free", "premium", "lifetime"];
    return audiences.some((audience) =>
      plans.some((plan) =>
        [...workspaces].some((workspaceId) => {
          const context = { audience, plan, workspaceId };
          return (
            policyAllows(a, context) &&
            readFeatureAvailability(db, source, audience).available &&
            !(
              policyAllows(b, context) &&
              readFeatureAvailability(db, dependency, audience).available
            )
          );
        }),
      ),
    );
  };
  const warnings: string[] = [];
  if ((feature === "catering" || feature === "finance") && conflict("catering", "finance"))
    warnings.push(
      "Katering dapat tersedia untuk sasaran yang Keuangannya dibatasi; perubahan anggaran terkait akan ditahan.",
    );
  if ((feature === "seserahan" || feature === "finance") && conflict("seserahan", "finance"))
    warnings.push(
      "Seserahan dapat tersedia untuk sasaran yang Keuangannya dibatasi; perubahan anggaran terkait akan ditahan.",
    );
  if ((feature === "catering" || feature === "guests") && conflict("catering", "guests"))
    warnings.push(
      "Data tamu tidak tersedia untuk sebagian sasaran Katering; dasar perhitungan tamu dan draf terkait disembunyikan.",
    );
  return warnings;
}
