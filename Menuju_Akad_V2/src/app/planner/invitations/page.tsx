import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { PageHeading } from "@/components/ui/page-heading";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import {
  CustomerInvitations,
  TrialInvitations,
} from "@/features/customer-workspace/components/customer-invitations";
export const dynamic = "force-dynamic";
export default async function InvitationsPage() {
  const access = await dashboardContext();
  const audience = access.mode === "guest" ? "guest" : access.workspace.role;
  const unavailable = !readFeatureAvailability(
    getWorkspaceService().db,
    "invitations",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const studioAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "studio-drafts",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const maintenance =
    readPlanningMaintenance(getWorkspaceService().db, "invitations").status === "maintenance";
  return (
    <CustomerShell access={access} initialFeatureUnavailable={unavailable}>
      {unavailable ? (
        <section className="rounded-card border border-ux-border bg-surface p-6" role="status">
          <PageHeading
            title="Editor undangan belum tersedia"
            description="Undangan yang sudah diterbitkan dan RSVP tetap dapat diakses. Data tidak dihapus."
          />
        </section>
      ) : maintenance ? (
        <section className="rounded-card border border-ux-border bg-surface p-6" role="status">
          <PageHeading
            title="Editor undangan sedang dalam pemeliharaan"
            description="Undangan yang sudah diterbitkan dan RSVP tetap dapat diakses. Data tidak dihapus."
          />
        </section>
      ) : access.mode === "guest" ? (
        <TrialInvitations workspace={access.workspace} studioAvailable={studioAvailable} />
      ) : (
        <CustomerInvitations workspace={access.workspace} studioAvailable={studioAvailable} />
      )}
    </CustomerShell>
  );
}
