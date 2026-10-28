"use client";
import { useCustomerResource } from "@/features/customer-workspace/hooks/use-customer-resource";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { PlanningEditor } from "./planning-editor";
import type { PlanningKind, PlanningItem } from "../domain/planning-resource";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { useAccountFinance } from "@/features/planner-finance/hooks/use-account-finance";
import type { CateringSettings } from "../domain/catering-settings";
type State = { data: unknown[] | null; error: string; save: (data: unknown[]) => Promise<boolean> };
function Content({
  kind,
  state,
  guests = null,
  guestError = "",
  budgets = null,
  budgetError = "",
  settings,
}: {
  kind: PlanningKind;
  state: State;
  guests?: unknown[] | null;
  guestError?: string;
  budgets?: CustomerBudget[] | null;
  budgetError?: string;
  settings?: State;
}) {
  return (
    <>
      {state.error && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {state.error}
        </p>
      )}
      {settings?.error && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {settings.error}
        </p>
      )}
      {state.data && (kind !== "catering" || settings?.data) ? (
        <PlanningEditor
          kind={kind}
          data={state.data as PlanningItem[]}
          onSave={state.save}
          guests={guests}
          guestError={guestError}
          budgets={budgets}
          budgetError={budgetError}
          initialSettings={settings?.data?.[0] as CateringSettings | undefined}
          saveSettings={settings ? (value) => settings.save([value]) : undefined}
        />
      ) : !state.error && !settings?.error ? (
        <PageSkeleton
          variant={kind === "calendar" ? "calendar" : kind === "catering" ? "cards" : "list"}
          label="Memuat rencana"
        />
      ) : null}
    </>
  );
}
export function AccountPlanning({
  kind,
  workspaceId,
}: {
  kind: PlanningKind;
  workspaceId: string;
}) {
  return kind === "catering" ? (
    <AccountCatering workspaceId={workspaceId} />
  ) : (
    <AccountContent kind={kind} workspaceId={workspaceId} />
  );
}
function AccountContent({ kind, workspaceId }: { kind: PlanningKind; workspaceId: string }) {
  const state = useCustomerResource(kind, workspaceId);
  return <Content kind={kind} state={state} />;
}
export function TrialPlanning({ kind }: { kind: PlanningKind }) {
  return kind === "catering" ? <TrialCatering /> : <TrialContent kind={kind} />;
}
function TrialContent({ kind }: { kind: PlanningKind }) {
  const state = useTrialResource(kind);
  return <Content kind={kind} state={state} />;
}
function AccountCatering({ workspaceId }: { workspaceId: string }) {
  const state = useCustomerResource("catering", workspaceId);
  const guests = useCustomerResource("guests", workspaceId);
  const finance = useAccountFinance(workspaceId);
  const settings = useCustomerResource("catering-settings", workspaceId);
  return (
    <Content
      kind="catering"
      state={state}
      guests={guests.data}
      guestError={guests.error}
      budgets={finance.snapshot?.budgets ?? null}
      budgetError={finance.error}
      settings={settings}
    />
  );
}
function TrialCatering() {
  const state = useTrialResource("catering");
  const guests = useTrialResource("guests");
  const finance = useTrialResource("finance");
  const settings = useTrialResource("catering-settings");
  return (
    <Content
      kind="catering"
      state={state}
      guests={guests.data}
      guestError={guests.error}
      budgets={finance.data as CustomerBudget[] | null}
      budgetError={finance.error}
      settings={settings}
    />
  );
}
