"use client";
import { useCustomerResource } from "@/features/customer-workspace/hooks/use-customer-resource";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { PlanningEditor } from "./planning-editor";
import type { PlanningKind, PlanningItem } from "../domain/planning-resource";
type State = { data: unknown[] | null; error: string; save: (data: unknown[]) => Promise<boolean> };
function Content({
  kind,
  state,
  guests = null,
  guestError = "",
}: {
  kind: PlanningKind;
  state: State;
  guests?: unknown[] | null;
  guestError?: string;
}) {
  return (
    <>
      {state.error && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.data ? (
        <PlanningEditor
          kind={kind}
          data={state.data as PlanningItem[]}
          onSave={state.save}
          guests={guests}
          guestError={guestError}
        />
      ) : !state.error ? (
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
  return <Content kind="catering" state={state} guests={guests.data} guestError={guests.error} />;
}
function TrialCatering() {
  const state = useTrialResource("catering");
  const guests = useTrialResource("guests");
  return <Content kind="catering" state={state} guests={guests.data} guestError={guests.error} />;
}
