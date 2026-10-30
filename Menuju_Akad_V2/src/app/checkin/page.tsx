import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import {
  AccountCheckin,
  TrialCheckin,
} from "@/features/customer-workspace/components/customer-checkin";
export const dynamic = "force-dynamic";
export default async function Page() {
  const access = await dashboardContext();
  const maintenance =
    readPlanningMaintenance(getWorkspaceService().db, "guests").status === "maintenance";
  const audience = access.mode === "guest" ? "guest" : access.workspace.role;
  const unavailable = !readFeatureAvailability(getWorkspaceService().db, "guests", audience, access.mode === "guest" ? null : access.workspace)
    .available;
  return (
    <CustomerShell access={access} initialFeatureUnavailable={unavailable}>
      {unavailable ? (
        <section role="status">
          <PageHeading
            title="Pengelolaan tamu belum tersedia"
            description="Data tetap tersimpan. RSVP publik tetap dapat diterima."
          />
        </section>
      ) : maintenance ? (
        <section className="rounded-card border border-ux-border bg-surface p-6" role="status">
          <PageHeading
            title="Kehadiran tamu sedang dalam pemeliharaan"
            description="Data tidak dihapus. Konfirmasi RSVP melalui undangan tetap dapat diterima."
          />
        </section>
      ) : access.mode === "guest" ? (
        <TrialCheckin />
      ) : (
        <AccountCheckin workspaceId={access.workspace.id} />
      )}
    </CustomerShell>
  );
}

