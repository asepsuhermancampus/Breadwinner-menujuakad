import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { OperationsSecurityPanel } from "@/features/operations-shell/components/operations-security-panel";

export const dynamic = "force-dynamic";

export default async function AdminSecurityPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isOperator(session)) redirect("/auth/complete");

  return (
    <LiveOperationsShell
      account={session.user.email ?? "Admin"}
      superadmin={session.user.role === "superadmin"}
      active="/admin/security"
    >
      <OperationsSecurityPanel
        email={session.user.email ?? "admin@menujuakad.test"}
        superadmin={session.user.role === "superadmin"}
      />
    </LiveOperationsShell>
  );
}

