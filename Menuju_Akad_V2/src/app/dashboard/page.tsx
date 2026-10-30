import { dashboardContext } from "../_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { CustomerDashboard } from "@/features/customer-workspace/components/customer-dashboard";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readDashboardCards } from "@/server/workspaces/dashboard-cards";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
export const dynamic = "force-dynamic";
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const { tour } = await searchParams;
  const access = await dashboardContext();
  const audience = access.mode === "guest" ? "guest" : access.workspace.role;
  const tasksAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "tasks",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const calendarAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "calendar",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const moodboardAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "moodboard",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const documentsAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "documents",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const rundownAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "rundown",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const pdfAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "pdf",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const invitationsAvailable = readFeatureAvailability(
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
  const guestsAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "guests",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const financeAvailable = readFeatureAvailability(
    getWorkspaceService().db,
    "finance",
    audience,
    access.mode === "guest" ? null : access.workspace,
  ).available;
  const cards = readDashboardCards(getWorkspaceService().db, audience)
    .filter((item) => item.visible)
    .map((item) => item.card);
  return (
    <CustomerShell access={access} autoStartGuide={tour === "features"}>
      <CustomerDashboard
        workspace={access.workspace}
        guest={access.mode === "guest"}
        visibleCards={cards}
        tasksAvailable={tasksAvailable}
        calendarAvailable={calendarAvailable}
        moodboardAvailable={moodboardAvailable}
        documentsAvailable={documentsAvailable}
        rundownAvailable={rundownAvailable}
        pdfAvailable={pdfAvailable}
        invitationsAvailable={invitationsAvailable}
        studioAvailable={studioAvailable}
        guestsAvailable={guestsAvailable}
        financeAvailable={financeAvailable}
      />
    </CustomerShell>
  );
}
