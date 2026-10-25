import { dashboardContext } from "./dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import {
  AccountPlanning,
  TrialPlanning,
} from "@/features/customer-planning/components/planning-resource";
import type { PlanningKind } from "@/features/customer-planning/domain/planning-resource";
export async function CustomerPlanningPage({ kind }: { kind: PlanningKind }) {
  const access = await dashboardContext();
  return (
    <CustomerShell access={access}>
      {access.mode === "guest" ? (
        <TrialPlanning kind={kind} />
      ) : (
        <AccountPlanning kind={kind} workspaceId={access.workspace.id} />
      )}
    </CustomerShell>
  );
}
