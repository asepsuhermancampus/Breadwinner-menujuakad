"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/brand-logo";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { ItemRejectionView } from "./item-rejection-view";
import { ContractReviewView } from "./contract-review-view";
import { PaymentChoiceView } from "./payment-choice-view";
import { PaymentStatusView } from "./payment-status-view";
import { commitTransaction } from "../model/transaction-store";

type Step = "details" | "contract" | "payment" | "status";

export function CheckoutServicesScreen() {
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("Andi Ramadhan");
  const [email, setEmail] = useState("andi.ramadhan@example.com");
  const [phone, setPhone] = useState("+6281234567890");
  const [reviewed, setReviewed] = useState(false);
  const [replacedLuma, setReplacedLuma] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-foreground py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <BrandLogo variant="cypress" />
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted">
                Checkout Jasa Tanpa Akun Pasangan
              </div>
              <h1 className="text-xl font-bold text-foreground">Paket Layanan: PKT-SIM-204</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-warning-bg px-3 py-1.5 rounded-full border border-warning/40 text-xs font-mono text-warning font-semibold">
            ⏱ Hold Server: 14:52
          </div>
        </div>

        <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary flex flex-wrap justify-between items-center gap-2">
          <span>
            <strong>SANDBOX · TIDAK ADA TRANSAKSI NYATA:</strong> Data demonstrasi untuk Preset 3.
            Tidak ada dana bank yang dipotong.
          </span>
          <span className="font-mono text-foreground font-semibold">ID: Q-204/v7</span>
        </div>

        {/* Step 1: Details */}
        {step === "details" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-surface rounded-2xl border border-border space-y-4">
                <h2 className="font-bold text-sm text-foreground">
                  Data Kontak & Pelaksanaan Acara
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Nama Pemesan
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs rounded-control border border-border bg-canvas px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Email Konfirmasi Transaksi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs rounded-control border border-border bg-canvas px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs rounded-control border border-border bg-canvas px-3 py-2 font-mono"
                  />
                </div>

                <div className="p-3 bg-subtle rounded-xl border border-border text-xs space-y-1">
                  <div className="font-semibold text-foreground">Venue & Waktu Acara:</div>
                  <div className="text-secondary">Bumi Samami, Bandung · 14 Februari 2027</div>
                  <div className="text-secondary text-[11px]">
                    Akad 08.00–09.00 · Resepsi 10.00–14.00 WIB
                  </div>
                </div>
              </div>

              <div className="p-5 bg-surface rounded-2xl border border-border space-y-4 flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-sm text-foreground mb-3">
                    Ringkasan 3 Jasa Terpilih
                  </h2>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-canvas rounded-lg border border-border flex justify-between">
                      <div>
                        <div className="font-semibold text-foreground">Aru MUA</div>
                        <div className="text-[11px] text-secondary">Paket Akad</div>
                      </div>
                      <span className="font-mono font-bold">{formatIdr(8000000)}</span>
                    </div>
                    <div className="p-2.5 bg-canvas rounded-lg border border-border flex justify-between">
                      <div>
                        <div className="font-semibold text-foreground">Lensa Teduh Photo</div>
                        <div className="text-[11px] text-secondary">Sehari Penuh (8 Jam)</div>
                      </div>
                      <span className="font-mono font-bold">{formatIdr(15000000)}</span>
                    </div>
                    <div className="p-2.5 bg-canvas rounded-lg border border-border flex justify-between">
                      <div>
                        <div className="font-semibold text-foreground">Luma Dekor</div>
                        <div className="text-[11px] text-secondary">Cypress Pelaminan</div>
                      </div>
                      <span className="font-mono font-bold">{formatIdr(12000000)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border mt-3 flex justify-between items-center text-sm font-bold">
                    <span>Total Nilai Layanan:</span>
                    <span className="font-mono text-brand-secondary text-base">
                      {formatIdr(35000000)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reviewed}
                      onChange={(e) => setReviewed(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      Saya meninjau rincian quote, alokasi slot tanggal, privasi dan syarat
                      pemesanan.
                    </span>
                  </label>

                  <Button
                    variant="primary"
                    disabled={!reviewed}
                    className="w-full min-h-11"
                    onClick={() => setStep("contract")}
                  >
                    Lanjut ke Peninjauan Item & Kontrak →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contract & Rejection Resolution */}
        {step === "contract" && (
          <div className="space-y-6">
            <ItemRejectionView
              isApplied={replacedLuma}
              onApplyReplacement={() => setReplacedLuma(true)}
            />
            {replacedLuma && <ContractReviewView onApproveContract={() => setStep("payment")} />}
          </div>
        )}

        {/* Step 3: Payment Choice */}
        {step === "payment" && (
          <PaymentChoiceView
            onSelectPayment={(scheme, gateway) => {
              commitTransaction("ORD-SIM-204", scheme, gateway, "verified", "Q-204/v9");
              setStep("status");
            }}
          />
        )}

        {/* Step 4: Status */}
        {step === "status" && <PaymentStatusView orderId="ORD-SIM-204" />}
      </div>
    </div>
  );
}
