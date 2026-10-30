import { FeatureLock } from "@/features/customer-workspace/components/feature-lock";
import { LockedStudio } from "@/features/invitation-studio/components/locked-studio";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { StudioScreen } from "@/features/invitation-studio/components/studio-screen";
import { CustomerFeatureLayout } from "@/features/customer-workspace/components/customer-feature-layout";
import Link from "next/link";
import { PageHeading } from "@/components/ui/page-heading";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import {
  availabilityFeatures,
  type AvailabilityFeature,
  type FeatureAvailability,
} from "@/features/customer-workspace/domain/feature-availability-catalog";

export const dynamic = "force-dynamic";

export default async function PlannerInvitationStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; view?: string }>;
}) {
  const { project } = await searchParams;
  const access = await dashboardContext();
  const maintenance =
    readPlanningMaintenance(getWorkspaceService().db, "studio-drafts").status === "maintenance";
  const customer = access;
  const audience = access.mode === "guest" ? "guest" : access.workspace.role;
  const invitationsAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "invitations",
    audience, access.mode === "guest" ? null : access.workspace,
  ).available;
  const unavailable = !readFeatureAvailability(getWorkspaceService().db, "studio-drafts", audience, access.mode === "guest" ? null : access.workspace)
    .available;
  const db = getWorkspaceService().db;
  const availability = Object.fromEntries(
    (Object.keys(availabilityFeatures) as AvailabilityFeature[]).map((feature) => [
      feature,
      readFeatureAvailability(db, feature, audience, access.mode === "guest" ? null : access.workspace).available,
    ]),
  ) as FeatureAvailability;
  return (
    <CustomerShell access={access} fullScreen initialFeatureUnavailable={unavailable}>
      {unavailable ? (
        <main id="main-content" className="min-h-dvh bg-surface p-6">
          <PageHeading
            title="Studio visual belum tersedia"
            description="Undangan yang sudah diterbitkan dan RSVP tetap dapat diakses. Data tidak dihapus."
          />
          <Link
            href={invitationsAvailable ? "/planner/invitations" : "/dashboard"}
            className="mt-4 inline-block underline"
          >
            {invitationsAvailable ? "Kembali ke undangan" : "Kembali ke ringkasan"}
          </Link>
        </main>
      ) : maintenance ? (
        <main id="main-content" className="min-h-dvh bg-surface p-6">
          <PageHeading
            title="Studio undangan sedang dalam pemeliharaan"
            description="Undangan yang sudah diterbitkan dan RSVP tetap dapat diakses. Data tidak dihapus."
          />
          <Link
            href={invitationsAvailable ? "/planner/invitations" : "/dashboard"}
            className="mt-4 inline-block underline"
          >
            {invitationsAvailable ? "Kembali ke undangan" : "Kembali ke ringkasan"}
          </Link>
        </main>
      ) : access.mode === "guest" ||
        customer.workspace.subscription.capabilities.includes("studio") ? (
        <div id="feature-studio" tabIndex={-1}>
          <StudioScreen
            key={customer.workspace.id}
            workspaceId={customer.workspace.id}
            projectId={
              project && /^[a-zA-Z0-9-]{1,120}$/.test(project)
                ? project
                : `${customer.workspace.id}--main`
            }
            remote
          />
        </div>
      ) : (
        <main id="main-content" className="min-h-dvh bg-surface p-4 sm:p-8">
          <CustomerFeatureLayout availability={availability}>
            <FeatureLock title="Studio visual">
              <LockedStudio />
            </FeatureLock>
          </CustomerFeatureLayout>
        </main>
      )}
    </CustomerShell>
  );
}

