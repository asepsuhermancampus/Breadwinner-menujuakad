"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BundleItem } from "../types/marketplace";
import { calculateBundleTotal, formatIdr } from "../utils/marketplace-calc";
import { QuoteExpiredView } from "./quote-expired-view";

type Props = {
  initialItems?: BundleItem[];
};

export function BundlerScreen({ initialItems }: Props) {
  const [items, setItems] = useState<BundleItem[]>(
    initialItems || [
      {
        id: "b-1",
        vendorId: "v-aru",
        vendorName: "Aru MUA",
        serviceName: "Paket Akad",
        unitPriceIdr: 8000000,
        quantity: 1,
        status: "available",
      },
      {
        id: "b-2",
        vendorId: "v-lensa",
        vendorName: "Lensa Teduh Photo",
        serviceName: "Sehari Penuh",
        unitPriceIdr: 15000000,
        quantity: 1,
        status: "available",
      },
      {
        id: "b-3",
        vendorId: "v-luma",
        vendorName: "Luma Dekor",
        serviceName: "Cypress",
        unitPriceIdr: 12000000,
        quantity: 1,
        status: "available",
      },
    ],
  );

  const [showExpiredScenarios, setShowExpiredScenarios] = useState(false);
  const total = calculateBundleTotal(items);

  function updateQuantity(id: string, delta: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted">
            Racik Paket Lintas Vendor
          </div>
          <h1 className="text-2xl font-bold text-foreground">Paket Acara: PKT-SIM-204</h1>
          <p className="text-xs text-secondary mt-0.5">
            Quote ID: Q-204/v7 · Acara 14 Feb 2027 · Belum ada hold slot
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="small"
            onClick={() => setShowExpiredScenarios((s) => !s)}
          >
            {showExpiredScenarios ? "Tutup Skenario Hold" : "Simulasi Hold / Harga Berubah"}
          </Button>
        </div>
      </div>

      {showExpiredScenarios && <QuoteExpiredView />}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-subtle text-secondary font-semibold border-b border-border">
              <tr>
                <th className="p-3">Jasa / Vendor</th>
                <th className="p-3 text-center">Kuantitas</th>
                <th className="p-3">Harga Satuan</th>
                <th className="p-3">Subtotal</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="font-bold text-foreground">{item.serviceName}</div>
                    <div className="text-secondary text-[11px]">{item.vendorName}</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Kurangi kuantitas"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="min-h-11 min-w-11 rounded-control border border-border bg-subtle hover:bg-surface flex items-center justify-center font-bold text-sm"
                      >
                        −
                      </button>
                      <span className="font-mono font-bold w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Tambah kuantitas"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="min-h-11 min-w-11 rounded-control border border-border bg-subtle hover:bg-surface flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3 font-mono">{formatIdr(item.unitPriceIdr)}</td>
                  <td className="p-3 font-mono font-bold text-foreground">
                    {formatIdr(item.unitPriceIdr * item.quantity)}
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-danger hover:underline text-[11px]"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-canvas border-t border-border flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="text-xs text-secondary">Subtotal {total.itemCount} Jasa Terpilih</div>
            <div className="text-2xl font-bold font-mono text-foreground">
              {formatIdr(total.subtotalIdr)}
            </div>
            <div className="text-xs text-primary font-medium mt-0.5">
              DP 30% ditawarkan saat kontrak disetujui: {formatIdr(total.dp30PercentIdr)}
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="/checkout/services"
              className="inline-flex items-center justify-center px-5 py-3 rounded-control bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-sm"
            >
              Lanjut ke Checkout Jasa ({formatIdr(total.subtotalIdr)}) →
            </a>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted text-center">
        Simulasi racik paket sandbox. Perhitungan ini tidak mencatat mutasi pengeluaran ke buku
        besar keuangan sebelum kontrak disepakati dan pembayaran terverifikasi.
      </p>
    </div>
  );
}
