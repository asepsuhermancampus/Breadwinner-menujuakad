import { FeatureLock } from "@/features/customer-workspace/components/feature-lock";
import { LockedStudio } from "@/features/invitation-studio/components/locked-studio";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { StudioScreen } from "@/features/invitation-studio/components/studio-screen";
import { CustomerFeatureLayout } from "@/features/customer-workspace/components/customer-feature-layout";

export const dynamic = "force-dynamic";

export default async function PlannerInvitationStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string; view?: string }>;
}) {
  const { project } = await searchParams;
  const access = await dashboardContext();
  const customer = access;
  return (
    <CustomerShell access={access} fullScreen>
      {access.mode === "guest" ||
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
          <CustomerFeatureLayout>
            <FeatureLock title="Studio visual">
              <LockedStudio />
            </FeatureLock>
          </CustomerFeatureLayout>
        </main>
      )}
    </CustomerShell>
  );
}
