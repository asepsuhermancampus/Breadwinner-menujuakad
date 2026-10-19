import { Button } from "@/components/ui/button";
import type { VendorOrder } from "../types/vendor";
import { vendorOrderDate } from "./vendor-order-terms";

const statuses = { pending: "Menunggu review", accepted: "Diterima", rejected: "Ditolak" };
export function VendorOrderTable({
  orders,
  selectedId,
  onSelect,
}: {
  orders: VendorOrder[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid min-w-0 gap-6">
      <section className="min-w-0 overflow-hidden rounded-card border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[610px] text-left text-[13px]">
            <caption className="sr-only">Daftar item pesanan vendor</caption>
            <thead className="border-b border-border bg-ux-dock text-secondary">
              <tr>
                {["Pemesan / acara", "Item", "Tanggal", ""].map((label, index) => (
                  <th key={index} scope="col" className="px-5 py-4 font-medium">
                    {label || <span className="sr-only">Tinjau item</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-border last:border-0 ${selectedId === order.id ? "bg-primary/5" : ""}`}
                >
                  <th scope="row" className="px-5 py-5 font-normal">
                    <p className="font-semibold">{order.client}</p>
                    <p className="mt-1 text-[10px] text-secondary">
                      {order.id} · {statuses[order.status]}
                    </p>
                  </th>
                  <td className="px-5 py-5">
                    {order.contract.packageName === "Full Day Wedding"
                      ? "Full day"
                      : order.contract.packageName === "Akad & Intimate"
                        ? "Akad intimate"
                        : order.contract.packageName}
                  </td>
                  <td className="whitespace-nowrap px-5 py-5">
                    {vendorOrderDate(order.eventDate)}
                  </td>
                  <td className="px-3 py-5">
                    <Button
                      size="small"
                      variant="ghost"
                      aria-label={`Detail ${order.client} ${order.id}`}
                      aria-pressed={selectedId === order.id}
                      onClick={() => onSelect(order.id)}
                    >
                      Detail →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="border-t border-border py-4">
        <h2 className="text-sm font-semibold">Sebelum menerima</h2>
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          Periksa kapasitas tim dan versi penawaran terbaru. Slot sementara belum berarti booking
          terkonfirmasi.
        </p>
      </footer>
    </div>
  );
}
