import { redirect } from "next/navigation";
import { getSuperadminSession } from "@/server/reviews/access";
import { TaskMaintenancePanel } from "@/features/customer-workspace/components/task-maintenance-panel";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { DashboardCardsPanel } from "@/features/customer-workspace/components/dashboard-cards-panel";
import { FeatureAvailabilityPanel } from "@/features/customer-workspace/components/feature-availability-panel";
import { FeatureRolloutPanel } from "@/features/customer-workspace/components/feature-rollout-panel";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readDashboardCards } from "@/server/workspaces/dashboard-cards";

export const dynamic = "force-dynamic";
export default async function Page() {
  const account = await getSuperadminSession();
  if (!account) redirect("/superadmin/login");
  const db = getWorkspaceService().db;
  const cards = (["guest", "owner", "partner"] as const).flatMap((audience) =>
    readDashboardCards(db, audience),
  );
  return (
    <LiveOperationsShell account={account.email} superadmin active="/superadmin/features">
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-semibold">Fitur & pemeliharaan</h1>
          <p className="mt-2 text-sm text-secondary">
            Pengaturan berlaku untuk semua pengguna pada database aplikasi ini.
          </p>
        </header>
        <DashboardCardsPanel initial={cards} />
        <FeatureAvailabilityPanel />
        <FeatureRolloutPanel />
        <TaskMaintenancePanel />
        <TaskMaintenancePanel feature="calendar" />
        <TaskMaintenancePanel feature="rundown" />
        <TaskMaintenancePanel feature="emergency" />
        <TaskMaintenancePanel feature="documents" />
        <TaskMaintenancePanel feature="moodboard" />
        <TaskMaintenancePanel feature="catering" />
        <TaskMaintenancePanel feature="seserahan" />
        <TaskMaintenancePanel feature="guests" />
        <TaskMaintenancePanel feature="invitations" />
        <TaskMaintenancePanel feature="studio-drafts" />
        <TaskMaintenancePanel feature="finance" />
        <TaskMaintenancePanel feature="pdf" />
      </div>
    </LiveOperationsShell>
  );
}

