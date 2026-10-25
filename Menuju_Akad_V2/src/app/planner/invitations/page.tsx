import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import {
  CustomerInvitations,
  TrialInvitations,
} from "@/features/customer-workspace/components/customer-invitations";
export const dynamic = "force-dynamic";
export default async function InvitationsPage() {
  const access = await dashboardContext();
  return (
    <CustomerShell access={access}>
      {access.mode === "guest" ? (
        <TrialInvitations workspace={access.workspace} />
      ) : (
        <CustomerInvitations workspace={access.workspace} />
      )}
    </CustomerShell>
  );
}
