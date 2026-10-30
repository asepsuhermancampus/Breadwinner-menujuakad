import { TrialExport } from "@/features/dashboard-trial/components/trial-export";
import { FeatureLock } from "@/features/customer-workspace/components/feature-lock";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { PlanExport } from "@/features/customer-workspace/components/plan-export";
import { PageHeading } from "@/components/ui/page-heading";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";

export const dynamic = "force-dynamic";

export default async function WeddingKitPage() {
  const context = await dashboardContext();
  const maintenance =
    readPlanningMaintenance(getWorkspaceService().db, "pdf").status === "maintenance";
  const audience = context.mode === "guest" ? "guest" : context.workspace.role;
  const pdfAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "pdf",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const tasksAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "tasks",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const emergencyAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "emergency",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const calendarAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "calendar",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const documentsAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "documents",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const rundownAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "rundown",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const guestsAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "guests",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const financeAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "finance",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const seserahanAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "seserahan",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  const cateringAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "catering",
    audience,
    context.mode === "guest" ? null : context.workspace,
  ).available;
  return (
    <CustomerShell access={context} initialFeatureUnavailable={!pdfAvailable}>
      <div className="space-y-6">
        <PageHeading
          title="Ringkasan untuk dibagikan"
          description="Ringkasan praktis untuk keluarga, PIC, dan vendor. Siap dibagikan atau dicetak."
        />
        {!pdfAvailable ? (
          <p role="status">Ringkasan cetak belum tersedia. Data kalian tetap tersimpan.</p>
        ) : maintenance ? (
          <p role="status">Ringkasan cetak sedang dalam pemeliharaan. Data kalian tidak dihapus.</p>
        ) : context.mode === "guest" ? (
          <TrialExport
            showHeading={false}
            tasksAvailable={tasksAvailable}
            emergencyAvailable={emergencyAvailable}
            calendarAvailable={calendarAvailable}
            documentsAvailable={documentsAvailable}
            rundownAvailable={rundownAvailable}
            guestsAvailable={guestsAvailable}
            financeAvailable={financeAvailable}
            seserahanAvailable={seserahanAvailable}
            cateringAvailable={cateringAvailable}
          />
        ) : context.workspace.subscription.capabilities.includes("pdf") ? (
          <PlanExport
            showHeading={false}
            tasksAvailable={tasksAvailable}
            documentsAvailable={documentsAvailable}
            guestsAvailable={guestsAvailable}
            financeAvailable={financeAvailable}
          />
        ) : (
          <FeatureLock title="Ekspor PDF">
            <PlanExport
              showHeading={false}
              tasksAvailable={tasksAvailable}
              documentsAvailable={documentsAvailable}
              guestsAvailable={guestsAvailable}
              financeAvailable={financeAvailable}
            />
          </FeatureLock>
        )}
      </div>
    </CustomerShell>
  );
}
