import { notFound, redirect } from "next/navigation";
import { dashboardContext } from "@/app/_components/dashboard-context";
import { CustomerShell } from "@/features/customer-workspace/components/customer-shell";
import { auth } from "@/server/auth";
import { ownerForSession } from "@/server/identity/policy";
import { MarketplaceCatalog } from "@/server/marketplace/catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
export const dynamic = "force-dynamic";
export default async function Page({ params }: { params: Promise<{ orderToken: string }> }) {
  const { orderToken } = await params,
    access = await dashboardContext();
  if (access.mode === "guest") redirect("/login");
  const order = new MarketplaceCatalog(getWorkspaceService().db).order(
    ownerForSession((await auth())!),
    orderToken,
  );
  if (!order) notFound();
  return (
    <CustomerShell access={access}>
      <section className="space-y-4 rounded-card border border-ux-border bg-surface p-6">
        <h1 className="text-2xl font-semibold">Permintaan penawaran diterima</h1>
        <p>Nomor: {order.id}</p>
        <p>
          {order.status === "contacted"
            ? "Permintaan sedang ditindaklanjuti pengelola."
            : order.status === "cancelled"
              ? "Permintaan dibatalkan."
              : "Menunggu konfirmasi harga dan jadwal oleh pengelola."}{" "}
          Belum ada pembayaran.
        </p>
        <ul>
          {order.items.map((i) => (
            <li key={i.id}>
              {i.name} / Rp {i.price.toLocaleString("id-ID")}
            </li>
          ))}
        </ul>
        <p>Estimasi total: Rp {order.total.toLocaleString("id-ID")}</p>
        <p className="whitespace-pre-wrap">{order.message}</p>
      </section>
    </CustomerShell>
  );
}
