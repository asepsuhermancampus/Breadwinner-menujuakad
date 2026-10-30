"use client";
import type { CustomerWorkspace } from "../types";
import { AccountOverview, GuestOverview } from "./customer-overview-loaders";
import { CustomerFeatureLinks } from "./customer-feature-links";
import type { DashboardCard } from "../domain/dashboard-card-catalog";
import { useFeatureAvailability } from "./feature-availability-context";
export function CustomerDashboard({
  workspace,
  guest = false,
  visibleCards,
  tasksAvailable,
  calendarAvailable,
  moodboardAvailable,
  documentsAvailable,
  rundownAvailable,
  pdfAvailable,
  invitationsAvailable,
  studioAvailable,
  guestsAvailable,
  financeAvailable,
}: {
  workspace: CustomerWorkspace;
  guest?: boolean;
  visibleCards: DashboardCard[];
  tasksAvailable: boolean;
  calendarAvailable: boolean;
  moodboardAvailable: boolean;
  documentsAvailable: boolean;
  rundownAvailable: boolean;
  pdfAvailable: boolean;
  invitationsAvailable: boolean;
  studioAvailable: boolean;
  guestsAvailable: boolean;
  financeAvailable: boolean;
}) {
  const latest = useFeatureAvailability();
  const effectiveTasks = latest?.tasks ?? tasksAvailable;
  const effectiveCalendar = latest?.calendar ?? calendarAvailable;
  const effectiveMoodboard = latest?.moodboard ?? moodboardAvailable;
  const effectiveDocuments = latest?.documents ?? documentsAvailable;
  const effectiveRundown = latest?.rundown ?? rundownAvailable;
  const effectivePdf = latest?.pdf ?? pdfAvailable;
  const effectiveInvitations = latest?.invitations ?? invitationsAvailable;
  const effectiveStudio = latest?.["studio-drafts"] ?? studioAvailable;
  const effectiveGuests = latest?.guests ?? guestsAvailable;
  const effectiveFinance = latest?.finance ?? financeAvailable;
  return (
    <>
      {guest ? (
        <GuestOverview
          workspace={workspace}
          visibleCards={visibleCards}
          tasksAvailable={effectiveTasks}
          calendarAvailable={effectiveCalendar}
          documentsAvailable={effectiveDocuments}
          rundownAvailable={effectiveRundown}
          pdfAvailable={effectivePdf}
          guestsAvailable={effectiveGuests}
          financeAvailable={effectiveFinance}
        />
      ) : (
        <AccountOverview
          workspace={workspace}
          visibleCards={visibleCards}
          tasksAvailable={effectiveTasks}
          calendarAvailable={effectiveCalendar}
          documentsAvailable={effectiveDocuments}
          rundownAvailable={effectiveRundown}
          pdfAvailable={effectivePdf}
          guestsAvailable={effectiveGuests}
          financeAvailable={effectiveFinance}
        />
      )}
      <CustomerFeatureLinks
        tasksAvailable={effectiveTasks}
        moodboardAvailable={effectiveMoodboard}
        pdfAvailable={effectivePdf}
        invitationsAvailable={effectiveInvitations}
        studioAvailable={effectiveStudio}
        guestsAvailable={effectiveGuests}
      />
    </>
  );
}
