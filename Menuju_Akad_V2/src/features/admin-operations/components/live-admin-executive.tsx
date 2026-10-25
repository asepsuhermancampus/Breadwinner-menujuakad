import Link from "next/link";
import type { CatalogOrder } from "@/features/marketplace/types/customer-catalog";

export function LiveAdminExecutive({
  orders,
  ticketCount,
  superadmin,
}: {
  orders: CatalogOrder[];
  ticketCount: number;
  superadmin: boolean;
}) {
  const requested = orders.filter((order) => order.status === "requested").length;
  const contacted = orders.filter((order) => order.status === "contacted").length;
  const cancelled = orders.filter((order) => order.status === "cancelled").length;
  const format = (value: number) => value.toLocaleString("id-ID");
  const metrics = [
    ["Permintaan pelanggan", orders.length, "Maksimal 200 permintaan terbaru"],
    ["Menunggu tindak lanjut", requested, "Permintaan yang belum dihubungi"],
    ["Sudah ditindaklanjuti", contacted, "Status kontak telah diperbarui"],
    ["Bantuan pelanggan", ticketCount, "Seluruh tiket yang tersimpan"],
  ] as const;
  return (
    <>
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
          Gambaran bisnis, keputusan berikutnya.
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Ringkasan operasional dari permintaan dan bantuan pelanggan yang tersimpan.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 border-b border-ux-border pb-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, detail]) => (
          <div key={label} className="grid gap-2">
            <p className="text-xs text-secondary">{label}</p>
            <p className="font-mono text-[26px] tracking-tight">{format(value)}</p>
            <p className="text-xs text-secondary">{detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid content-start gap-7" aria-labelledby="request-summary">
          <div>
            <h2 id="request-summary" className="text-[22px] font-semibold tracking-tight">
              Status permintaan pelanggan
            </h2>
            <p className="mt-3 text-sm text-secondary">
              Distribusi {format(orders.length)} permintaan terbaru.
            </p>
          </div>
          {orders.length === 0 ? (
            <p className="rounded-control bg-subtle p-5 text-sm text-secondary">
              Belum ada permintaan. Ringkasan akan terisi ketika pelanggan mengirim penawaran.
            </p>
          ) : (
            <div className="grid gap-7">
              {[
                ["Seluruh permintaan", orders.length],
                ["Menunggu", requested],
                ["Ditindaklanjuti", contacted],
                ["Dibatalkan", cancelled],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="grid items-center gap-3 sm:grid-cols-[150px_minmax(0,1fr)_55px]"
                >
                  <label className="text-sm" htmlFor={`requests-${index}`}>
                    {label}
                  </label>
                  <progress
                    id={`requests-${index}`}
                    value={Number(value)}
                    max={orders.length}
                    className="h-7 w-full overflow-hidden rounded-control [&::-webkit-progress-bar]:bg-subtle [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                  />
                  <span className="text-right font-mono text-sm">{format(Number(value))}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <aside className="grid content-start gap-5 rounded-card bg-ux-dock p-6">
          <h2 className="text-lg font-semibold">Perlu tindakan</h2>
          <Link
            href="#permintaan"
            className="flex min-h-11 items-center rounded-control border border-ux-border bg-surface px-4 text-xs font-medium"
          >
            {format(requested)} permintaan menunggu tindak lanjut
          </Link>
          <Link
            href="#bantuan"
            className="flex min-h-11 items-center rounded-control border border-ux-border bg-surface px-4 text-xs font-medium"
          >
            {format(ticketCount)} tiket bantuan pelanggan
          </Link>
          {superadmin && (
            <Link
              href="/superadmin/reviews"
              className="flex min-h-11 items-center rounded-control border border-ux-border bg-surface px-4 text-xs font-medium"
            >
              Tinjau ulasan pelanggan
            </Link>
          )}
          <p className="border-t border-ux-border pt-5 text-xs leading-relaxed text-secondary">
            Permintaan penawaran belum merupakan transaksi atau pembayaran yang diterima.
          </p>
        </aside>
      </div>
    </>
  );
}
