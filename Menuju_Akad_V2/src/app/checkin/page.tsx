import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import {
  AccountCheckin,
  TrialCheckin,
} from "@/features/customer-workspace/components/customer-checkin";
export const dynamic = "force-dynamic";
export default async function Page() {
  const access = await dashboardContext();
  return (
    <CustomerShell access={access}>
      {access.mode === "guest" ? (
        <TrialCheckin />
      ) : (
        <AccountCheckin workspaceId={access.workspace.id} />
      )}
    </CustomerShell>
  );
}
