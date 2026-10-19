"use client";

import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import type { VendorOrder } from "../types/vendor";
import { VendorOrderTerms, vendorOrderDate } from "./vendor-order-terms";

export function VendorContract({ order, onClose }: { order: VendorOrder; onClose: () => void }) {
  return (
    <Dialog open title={`Kontrak & deliverables · ${order.id}`} onClose={onClose}>
      <div className="grid gap-6">
        <div className="flex items-start gap-3 rounded-control bg-subtle p-4">
          <Icon name="lock" className="shrink-0" />
          <p className="text-xs leading-relaxed text-secondary">
            Salinan teks kontrak versi {order.contract.version} yang melekat pada item ini.
            Perubahan katalog tidak mengubah harga, deliverables, atau termin yang telah disepakati.
          </p>
        </div>
        <section>
          <p className="font-mono text-xs text-secondary">
            {order.id} · v{order.contract.version}
          </p>
          <h3 className="mt-2 text-xl font-semibold">{order.contract.title}</h3>
          <p className="mt-2 text-sm">{order.client}</p>
          <p className="mt-1 text-xs text-secondary">
            {vendorOrderDate(order.eventDate)} · {order.venue}
          </p>
        </section>
        <section className="rounded-card border border-border p-5">
          <h3 className="text-sm font-semibold">{order.contract.packageName}</h3>
          <p className="mt-2 font-mono text-lg font-semibold">
            {formatIdr(order.contract.priceIdr)}
          </p>
          <h4 className="mt-5 text-sm font-medium">Ruang lingkup & deliverables</h4>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-xs leading-relaxed text-secondary">
            {order.contract.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="mb-3 text-sm font-semibold">Termin pembayaran item</h3>
          <VendorOrderTerms contract={order.contract} />
        </section>
        <p className="text-xs leading-relaxed text-secondary">
          Pratinjau ini menampilkan snapshot lokal untuk ditinjau. Dokumen PDF bertanda tangan dan
          pengiriman kontrak belum tersedia di sandbox.
        </p>
      </div>
    </Dialog>
  );
}
