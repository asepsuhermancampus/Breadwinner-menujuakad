import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { MarketplaceCatalog } from "@/server/marketplace/catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { LiveAdminExecutive } from "@/features/admin-operations/components/live-admin-executive";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isOperator(session)) redirect("/auth/complete");
  const service = getWorkspaceService();
  const orders = new MarketplaceCatalog(service.db).requests();
  const ticketCount = Number(
    service.db.prepare("SELECT COUNT(*) AS total FROM customer_support").get()!.total,
  );
  return (
    <LiveOperationsShell
      account={session.user.email ?? "Admin"}
      superadmin={session.user.role === "superadmin"}
      active="/admin"
    >
      <LiveAdminExecutive
        orders={orders}
        ticketCount={ticketCount}
        superadmin={session.user.role === "superadmin"}
      />
    </LiveOperationsShell>
  );
}
