"use client";
import { WorkspaceShell } from "@/features/shell-navigation/components/workspace-shell";
import { OverviewScreen } from "@/features/planner-overview/components/overview-screen";
import { TasksScreen } from "@/features/planner-tasks/components/tasks-screen";
import { KuaScreen } from "@/features/kua-documents/components/kua-screen";
import { EmergencyScreen } from "@/features/emergency-checklist/components/emergency-screen";
import { RundownScreen } from "@/features/planner-rundown/components/rundown-screen";
import { CalendarScreen } from "@/features/planner-calendar/components/calendar-screen";
import { CateringScreen } from "@/features/catering/components/catering-screen";
import { SeserahanScreen } from "@/features/wedding-preparation/components/seserahan-screen";
import { MoodboardScreen } from "@/features/moodboards/components/moodboard-screen";
import { WeddingKitScreen } from "@/features/wedding-kit/components/wedding-kit-screen";
import { FinanceScreen } from "@/features/planner-finance/components/finance-screen";
import { PreviewNotice } from "./preview-notice";
import { weddingOverviewFixture, engagementOverviewFixture } from "../fixtures/planner-overview";
import { weddingTasksFixture } from "../fixtures/planner-tasks";
import { kuaDocumentsFixture, emergencyBagsFixture } from "../fixtures/planner-data";
import { rundownFixture, calendarEventsFixture } from "../fixtures/planner-schedule";
import {
  weddingAccountsFixture,
  weddingDepositsFixture,
  weddingExpensesFixture,
  weddingCategoriesFixture,
  weddingInstallmentsFixture,
  weddingTransfersFixture,
  engagementFinanceFixture,
} from "../fixtures/planner-finance";
import {
  seserahanFixture,
  moodboardFixture,
  agreedPaletteFixture,
  weddingKitSectionsFixture,
} from "../fixtures/planner-products";
import { accountFixture } from "../fixtures/account";

function ShellWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PreviewNotice />
      <WorkspaceShell
        name={accountFixture.profile.fullName}
        memberships={accountFixture.memberships}
      >
        {children}
      </WorkspaceShell>
    </>
  );
}

export function PreviewDashboard() {
  return (
    <ShellWrapper>
      <OverviewScreen
        initialWedding={weddingOverviewFixture}
        initialEngagement={engagementOverviewFixture}
      />
    </ShellWrapper>
  );
}

export function PreviewTasks() {
  return (
    <ShellWrapper>
      <TasksScreen initialTasks={weddingTasksFixture} />
    </ShellWrapper>
  );
}

export function PreviewKua() {
  return (
    <ShellWrapper>
      <KuaScreen initialDocuments={kuaDocumentsFixture} />
    </ShellWrapper>
  );
}

export function PreviewEmergency() {
  return (
    <ShellWrapper>
      <EmergencyScreen initialBags={emergencyBagsFixture} />
    </ShellWrapper>
  );
}

export function PreviewRundown() {
  return (
    <ShellWrapper>
      <RundownScreen initialItems={rundownFixture} />
    </ShellWrapper>
  );
}

export function PreviewCalendar() {
  return (
    <ShellWrapper>
      <CalendarScreen initialEvents={calendarEventsFixture} />
    </ShellWrapper>
  );
}

export function PreviewCatering() {
  return (
    <ShellWrapper>
      <CateringScreen />
    </ShellWrapper>
  );
}

export function PreviewSeserahan() {
  return (
    <ShellWrapper>
      <SeserahanScreen initialItems={seserahanFixture} />
    </ShellWrapper>
  );
}

export function PreviewMoodboard() {
  return (
    <ShellWrapper>
      <MoodboardScreen initialItems={moodboardFixture} palette={agreedPaletteFixture} />
    </ShellWrapper>
  );
}

export function PreviewWeddingKit() {
  return (
    <ShellWrapper>
      <WeddingKitScreen initialSections={weddingKitSectionsFixture} />
    </ShellWrapper>
  );
}

export function PreviewFinance() {
  return (
    <ShellWrapper>
      <FinanceScreen
        initialAccounts={weddingAccountsFixture}
        initialDeposits={weddingDepositsFixture}
        initialExpenses={weddingExpensesFixture}
        initialCategories={weddingCategoriesFixture}
        initialInstallments={weddingInstallmentsFixture}
        initialTransfers={weddingTransfersFixture}
        initialEngagement={engagementFinanceFixture}
      />
    </ShellWrapper>
  );
}
