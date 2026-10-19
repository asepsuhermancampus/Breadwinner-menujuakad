"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import type { VendorOrder } from "../types/vendor";
import { VendorOrderTerms, vendorOrderDate } from "./vendor-order-terms";

export function VendorOrderDetails({
  order,
  reason,
  canDecide,
  onReason,
  onContract,
  onReview,
}: {
  order: VendorOrder;
  reason: string;
  canDecide: boolean;
  onReason: (reason: string) => void;
  onContract: () => void;
  onReview: (action: "accept" | "reject") => void;
}) {
  const reasonId = useId();
  const [decision, setDecision] = useState<"" | "accept" | "reject">("");
  const pending = order.status === "pending";
  return (
    <aside
      aria-label={`Detail item ${order.id}`}
      className="grid content-start gap-5 rounded-card bg-subtle p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-secondary">{order.id}</p>
        <span className="rounded-full bg-subtle px-2.5 py-1 text-[10px] font-semibold">
          Kontrak v{order.contract.version}
        </span>
      </div>
      <div>
        <p className="text-xs text-secondary">Pasangan</p>
        <h2 className="mt-1 text-xl font-semibold">{order.client}</h2>
        <div className="mt-3 flex items-center gap-2 text-xs text-secondary">
          <Icon name="calendar" size={14} />
          {vendorOrderDate(order.eventDate)} · {order.venue}
        </div>
      </div>
      <div className="">
        <p className="text-sm font-semibold">{order.contract.packageName}</p>
        <p className="mt-2 font-mono text-[26px]">{formatIdr(order.contract.priceIdr)}</p>
        <p className="mt-2 text-xs text-secondary">
          Nilai kontrak item · versi {order.contract.version}
        </p>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-semibold">Termin yang disepakati</h3>
        <VendorOrderTerms contract={order.contract} />
      </div>
      <Button variant="secondary" onClick={onContract}>
        <Icon name="file-text" size={16} />
        Lihat kontrak & deliverables
      </Button>
      <p className="text-xs leading-relaxed text-secondary">
        Harga, deliverables, dan termin menggunakan snapshot kontrak v{order.contract.version}.
        Perubahan katalog tidak mengganti isi kontrak ini.
      </p>
      {pending ? (
        <div className="grid gap-4 border-t border-border pt-5">
          <label className="grid gap-2 text-xs font-medium">
            Keputusan item
            <select
              value={decision}
              disabled={!canDecide}
              onChange={(e) => setDecision(e.target.value as typeof decision)}
              className="min-h-11 rounded-control border border-ux-border bg-surface px-3 text-[13px]"
            >
              <option value="">Belum dipilih</option>
              <option value="accept">Terima item</option>
              <option value="reject">Tolak item</option>
            </select>
          </label>
          <div className="grid gap-2">
            <label htmlFor={reasonId} className="text-xs font-medium">
              Alasan jika menolak
            </label>
            <textarea
              id={reasonId}
              value={reason}
              maxLength={500}
              disabled={!canDecide}
              onChange={(e) => onReason(e.target.value)}
              aria-describedby={`${reasonId}-hint`}
              placeholder="Wajib diisi bila menolak"
              className="min-h-24 w-full rounded-control border border-ux-border bg-surface p-3 text-xs leading-relaxed"
            />
            <p id={`${reasonId}-hint`} className="text-xs text-secondary">
              Wajib diisi sebelum menolak. Keputusan berlaku hanya untuk {order.id}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              disabled={!canDecide || decision === "reject"}
              onClick={() => onReview("accept")}
            >
              Terima item
            </Button>
            <Button
              variant="secondary"
              disabled={!canDecide || decision === "accept" || !reason.trim()}
              onClick={() => onReview("reject")}
            >
              Tolak…
            </Button>
          </div>
          <p className="text-[11px] leading-relaxed text-secondary">
            Cek ulang slot saat konfirmasi; belum ada keputusan tersimpan.
          </p>
        </div>
      ) : (
        <div role="status" className="rounded-control bg-subtle p-4">
          <p className="text-sm font-semibold">
            {order.status === "accepted" ? "Item telah diterima" : "Item telah ditolak"}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-secondary">{order.decision?.reason}</p>
          <p className="mt-2 font-mono text-[10px] text-secondary">
            Versi item {order.version} · keputusan simulasi lokal
          </p>
        </div>
      )}
    </aside>
  );
}
