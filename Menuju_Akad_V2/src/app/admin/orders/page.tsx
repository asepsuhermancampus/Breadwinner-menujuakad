import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { CatalogRequests } from "@/features/marketplace/components/catalog-requests";
import { AdminWithdrawalsCard } from "@/features/admin-operations/components/admin-withdrawals-card";
import { MarketplaceCatalog } from "@/server/marketplace/catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!isOperator(session)) redirect("/auth/complete");

  const service = getWorkspaceService();
  const orders = new MarketplaceCatalog(service.db).requests();

  service.db.exec(`
    CREATE TABLE IF NOT EXISTS ambassador_withdrawals (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      amount_idr INTEGER NOT NULL,
      bank_last4 TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
  const withdrawals = service.db
    .prepare("SELECT * FROM ambassador_withdrawals ORDER BY created_at DESC LIMIT 20")
    .all() as {
      id: string;
      account_id: string;
      amount_idr: number;
      bank_last4: string;
      status: string;
      created_at: string;
    }[];

  return (
    <LiveOperationsShell
      account={session.user.email ?? "Admin"}
      superadmin={session.user.role === "superadmin"}
      active="/admin/orders"
    >
      <div className="space-y-6">
        <header className="rounded-card border border-ux-border bg-surface p-5 sm:p-6 shadow-xs">
          <span className="inline-block rounded-full bg-subtle px-3 py-1 font-mono text-xs font-semibold text-brand-secondary">
            PERMINTAAN LAYANAN & PENCAIRAN
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Permintaan & Pencairan Mitra
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Daftar penawaran vendor dari calon pengantin dan permohonan pencairan komisi mitra.
          </p>
        </header>

        <AdminWithdrawalsCard withdrawals={withdrawals} />
        <CatalogRequests orders={orders} />
      </div>
    </LiveOperationsShell>
  );
}
