"use client";
import { useCustomerResource } from "@/features/customer-workspace/hooks/use-customer-resource";
import { useTrialResource } from "@/features/dashboard-trial/hooks/use-trial-resource";
import { PlanningEditor } from "./planning-editor";
import type { PlanningKind, PlanningItem } from "../domain/planning-resource";
type State = { data: unknown[] | null; error: string; save: (data: unknown[]) => Promise<boolean> };
function Content({ kind, state }: { kind: PlanningKind; state: State }) {
  return (
    <>
      {state.error && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {state.error}
        </p>
      )}
      {state.data ? (
        <PlanningEditor kind={kind} data={state.data as PlanningItem[]} onSave={state.save} />
      ) : (
        <p role="status">Memuat rencana...</p>
      )}
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
  const state = useCustomerResource(kind, workspaceId);
  return <Content kind={kind} state={state} />;
}
export function TrialPlanning({ kind }: { kind: PlanningKind }) {
  const state = useTrialResource(kind);
  return <Content kind={kind} state={state} />;
}
