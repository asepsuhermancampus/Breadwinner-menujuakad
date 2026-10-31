import { dashboardContext } from "./dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import {
  AccountPlanning,
  TrialPlanning,
} from "@/features/customer-planning/components/planning-resource";
import type { PlanningKind } from "@/features/customer-planning/domain/planning-resource";
import {
  isMaintainedPlanningFeature,
  planningMaintenanceFeatures,
} from "@/features/customer-planning/domain/maintenance-catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import {
  isAvailabilityFeature,
  availabilityFeatures,
} from "@/features/customer-workspace/domain/feature-availability-catalog";
import { PageHeading } from "@/components/ui/page-heading";
export async function CustomerPlanningPage({ kind }: { kind: PlanningKind }) {
  const access = await dashboardContext();
  const audience = access.mode === "guest" ? "guest" : access.workspace.role;
  const unavailable =
    isAvailabilityFeature(kind) &&
    !readFeatureAvailability(
      getWorkspaceService().db,
      kind,
      audience,
      access.mode === "guest" ? null : access.workspace,
    ).available;
  const maintenance =
    isMaintainedPlanningFeature(kind) &&
    readPlanningMaintenance(getWorkspaceService().db, kind).status === "maintenance";
  const financeMaintenance =
    (kind === "catering" || kind === "seserahan") &&
    readPlanningMaintenance(getWorkspaceService().db, "finance").status === "maintenance";
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
      ) : maintenance || financeMaintenance ? (
        <section
          className="space-y-3 rounded-card border border-ux-border bg-surface p-6"
          role="status"
        >
          <PageHeading
            title={
              financeMaintenance
                ? "Keuangan sedang dalam pemeliharaan"
                : `${isMaintainedPlanningFeature(kind) ? planningMaintenanceFeatures[kind] : "Fitur"} sedang dalam pemeliharaan`
            }
            description={
              financeMaintenance
                ? "Perubahan pada fitur ini ditahan karena terhubung ke anggaran. Data tidak dihapus."
                : "Pemeliharaan tidak menghapus data. Silakan kembali lagi nanti untuk mengubah rencana."
            }
          />
        </section>
      ) : access.mode === "guest" ? (
        <TrialPlanning kind={kind} />
      ) : (
        <AccountPlanning kind={kind} workspaceId={access.workspace.id} />
      )}
    </CustomerShell>
  );
}
