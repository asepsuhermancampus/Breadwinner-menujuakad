"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { ManualPaymentPreview } from "./manual-payment-preview";
import { QrisTestLink } from "./qris-test-link";

type Props = {
  onSelectPayment: (scheme: "dp" | "full", gateway: string) => void;
};

export function PaymentChoiceView({ onSelectPayment }: Props) {
  const [scheme, setScheme] = useState<"dp" | "full">("dp");
  const [gateway, setGateway] = useState("klikqris");
  const [showManualPreview, setShowManualPreview] = useState(false);

  const dpAmount = 10500000;
  const fullAmount = 35000000;
  const currentPayAmount = scheme === "dp" ? dpAmount : fullAmount;

  return (
    <div className="p-6 bg-surface rounded-2xl border border-border space-y-5 shadow-sm">
      <div className="flex flex-wrap justify-between items-start gap-2 pb-3 border-b border-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Langkah 2: Pilih Cara Pembayaran
          </span>
          <h2 className="text-xl font-bold text-foreground mt-0.5">
            Selesaikan Pembayaran Pesanan Jasa
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            ORD-SIM-204/v9 · 3 item telah disetujui · Usai konfirmasi pengganti Rona Dekor
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-success-bg text-success font-mono text-xs font-bold">
          Kontrak Disetujui
        </span>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
          Skema Pembayaran
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setScheme("dp")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              scheme === "dp"
                ? "border-primary bg-subtle ring-2 ring-primary/20"
                : "border-border bg-surface hover:bg-subtle/50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-foreground">DP 30% (Tagihan Pertama)</span>
              <span className="font-mono font-bold text-brand-secondary">
                {formatIdr(dpAmount)}
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Kunci slot seluruh 3 vendor. Sisa pembayaran Rp 24.500.000 dibagi dalam 2 termin.
            </p>
          </div>

          <div
            onClick={() => setScheme("full")}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              scheme === "full"
                ? "border-primary bg-subtle ring-2 ring-primary/20"
                : "border-border bg-surface hover:bg-subtle/50"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-foreground">Bayar Penuh (100%)</span>
              <span className="font-mono font-bold text-foreground">{formatIdr(fullAmount)}</span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Lunasi seluruh nilai kontrak 3 vendor sekaligus dalam satu transaksi aman.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2 border-t border-border">
        <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
          Metode Pembayaran (Sandbox)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            onClick={() => setGateway("klikqris")}
            className={`p-3 rounded-xl border cursor-pointer ${
              gateway === "klikqris"
                ? "border-primary bg-subtle ring-1 ring-primary/30"
                : "border-border"
            }`}
          >
            <div className="font-bold text-xs text-foreground">KlikQRIS (Otomatis & Realtime)</div>
            <div className="text-[11px] text-secondary mt-0.5">
              Pindai kode QRIS dengan BCA, Mandiri, GoPay, OVO, atau aplikasi bank mana pun.
            </div>
          </div>
          <div
            onClick={() => setGateway("midtrans")}
            className={`p-3 rounded-xl border cursor-pointer ${
              gateway === "midtrans"
                ? "border-primary bg-subtle ring-1 ring-primary/30"
                : "border-border"
            }`}
          >
            <div className="font-bold text-xs text-foreground">Virtual Account Bank (Demo)</div>
            <div className="text-[11px] text-secondary mt-0.5">
              Transfer instan via nomor Virtual Account BCA, BNI, BRI, Permata.
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-canvas rounded-xl border border-border text-xs space-y-1 font-mono">
        <div className="flex justify-between text-secondary">
          <span>Subtotal Nilai Pesanan:</span>
          <span>{formatIdr(35000000)}</span>
        </div>
        <div className="flex justify-between font-bold text-foreground text-sm pt-1 border-t border-border">
          <span>Jumlah Tagihan Sekarang:</span>
          <span className="text-brand-secondary">{formatIdr(currentPayAmount)}</span>
        </div>
      </div>

      {showManualPreview && (
        <div className="pt-2">
          <ManualPaymentPreview onClose={() => setShowManualPreview(false)} />
        </div>
      )}

      <QrisTestLink />

      <div className="flex flex-wrap justify-between items-center gap-3 pt-3 border-t border-border">
        <button
          type="button"
          onClick={() => setShowManualPreview((p) => !p)}
          className="text-xs text-secondary underline hover:text-foreground"
        >
          {showManualPreview ? "Tutup Preview Manual" : "Pratinjau Pembayaran Manual (Internal)"}
        </button>

        <Button variant="primary" onClick={() => onSelectPayment(scheme, gateway)}>
          Bayar Sekarang ({formatIdr(currentPayAmount)}) →
        </Button>
      </div>
    </div>
  );
}
