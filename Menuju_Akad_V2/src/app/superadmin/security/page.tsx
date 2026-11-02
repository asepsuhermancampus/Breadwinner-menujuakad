import { redirect } from "next/navigation";
import { getSuperadminSession } from "@/server/reviews/access";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { OperationsSecurityPanel } from "@/features/operations-shell/components/operations-security-panel";

export const dynamic = "force-dynamic";

export default async function SuperadminSecurityPage() {
  const account = await getSuperadminSession();
  if (!account) redirect("/superadmin/login");

  return (
    <LiveOperationsShell account={account.email} superadmin active="/superadmin/security">
      <OperationsSecurityPanel email={account.email} superadmin />
    </LiveOperationsShell>
  );
}

