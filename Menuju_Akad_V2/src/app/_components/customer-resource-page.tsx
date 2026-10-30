import { FeatureLock } from "@/features/customer-workspace/components/feature-lock";
import { MoodboardScreen } from "@/features/moodboards/components/moodboard-screen";
import { dashboardContext } from "./dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readTaskMaintenance } from "@/server/workspaces/task-maintenance";
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import {
  isAvailabilityFeature,
  availabilityFeatures,
} from "@/features/customer-workspace/domain/feature-availability-catalog";
import {
  isMaintainedPlanningFeature,
  planningMaintenanceFeatures,
} from "@/features/customer-planning/domain/maintenance-catalog";
import { PageHeading } from "@/components/ui/page-heading";
import {
  CustomerResources,
  TrialResources,
} from "@/features/customer-workspace/components/customer-resources";
export async function CustomerResourcePage({
  kind,
}: {
  kind: "guests" | "tasks" | "moodboard" | "documents" | "finance";
}) {
  const access = await dashboardContext();
  const audience = access.mode === "guest" ? "guest" : access.workspace.role;
  const unavailable =
    isAvailabilityFeature(kind) &&
    !readFeatureAvailability(getWorkspaceService().db, kind, audience, access.mode === "guest" ? null : access.workspace).available;
  const tasksMaintenance =
    kind === "tasks" && readTaskMaintenance(getWorkspaceService().db).status === "maintenance";
  const resourceMaintenance =
    isMaintainedPlanningFeature(kind) &&
    readPlanningMaintenance(getWorkspaceService().db, kind).status === "maintenance";
  const locked =
    access.mode === "account" &&
    kind === "moodboard" &&
    !access.workspace.subscription.capabilities.includes("moodboard");
  return (
    <CustomerShell access={access} initialFeatureUnavailable={unavailable}>
      {unavailable ? (
        <section
          className="space-y-3 rounded-card border border-ux-border bg-surface p-6"
          role="status"
        >
          <PageHeading
            title={`${isAvailabilityFeature(kind) ? availabilityFeatures[kind] : "Fitur"} belum tersedia`}
            description="Data yang sudah ada tetap tersimpan. Silakan kembali lagi nanti."
          />
        </section>
      ) : tasksMaintenance || resourceMaintenance ? (
        <section
          className="space-y-3 rounded-card border border-ux-border bg-surface p-6"
          role="status"
        >
          <PageHeading
            title={`${kind === "tasks" ? "Tugas" : isMaintainedPlanningFeature(kind) ? planningMaintenanceFeatures[kind] : "Fitur"} sedang dalam pemeliharaan`}
            description="Pemeliharaan tidak menghapus data. Silakan kembali lagi nanti untuk mengubah data."
          />
        </section>
      ) : locked ? (
        <FeatureLock title="Moodboard">
          <MoodboardScreen initialItems={[]} palette={[]} />
        </FeatureLock>
      ) : access.mode === "guest" ? (
        <TrialResources kind={kind} />
      ) : (
        <CustomerResources kind={kind} workspaceId={access.workspace.id} />
      )}
    </CustomerShell>
  );
}

