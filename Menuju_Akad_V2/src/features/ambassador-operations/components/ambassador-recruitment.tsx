"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { ambassadorIdentity, ambassadorRecruits } from "../content/ambassador-content";
import { guardAmbassador } from "../domain/ambassador-commissions";
import type { AmbassadorContext, AmbassadorState } from "../types/ambassador";
import { AmbassadorMetrics } from "./ambassador-metrics";

export function AmbassadorRecruitment({
  state,
  context,
}: {
  state: AmbassadorState;
  context: AmbassadorContext;
}) {
  const [message, setMessage] = useState("");
  async function copy() {
    const denied = guardAmbassador(state, context, "referralCopy");
    if (denied) {
      setMessage(denied.message);
      return;
    }
    try {
      await navigator.clipboard.writeText(
        `https://menujuakad.id/mitra?ref=${ambassadorIdentity.vendorCode}`,
      );
      setMessage(
        "Link rekrutmen vendor tersalin. Kode berbeda dari promo pasangan; akses produksi tetap mengikuti rilis Hidden.",
      );
    } catch {
      setMessage(
        "Clipboard tidak tersedia. Pilih dan salin link vendor yang ditampilkan di bawah.",
      );
    }
  }
  return (
    <div className="grid gap-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Relasi yang tumbuh, atribusi yang jelas.
          </h1>
          <p className="mt-3 text-sm text-secondary">
            Program rekrutmen vendor terpisah dari referral paket pasangan.
          </p>
        </div>
        <Button disabled={!context.permissions.referralCopy} onClick={() => void copy()}>
          <Icon name="copy" size={16} />
          Salin link vendor
        </Button>
      </header>
      <AmbassadorMetrics
        items={[
          { label: "Vendor terdaftar", value: "8 vendor", hint: "5 aktif · 3 masih menjalani KYB" },
          { label: "Komisi vendor estimasi", value: 300_000, hint: "Belum masuk saldo siap tarik" },
          {
            label: "Tarif program vendor",
            value: "15%",
            hint: "Dari fee platform layak, bukan GMV",
          },
        ]}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Rekrut vendor", ambassadorIdentity.vendorCode, "menujuakad.id/mitra?ref="],
          ["Paket pasangan", ambassadorIdentity.coupleCode, "menujuakad.id/?ref="],
        ].map(([label, code, prefix]) => (
          <section key={label} className="min-w-0 rounded-card border border-border bg-surface p-5">
            <h2 className="text-xs text-secondary">{label}</h2>
            <p className="mt-3 break-all font-mono text-lg font-semibold">{code}</p>
            <p className="mt-2 select-all break-all font-mono text-xs text-secondary">
              {prefix}
              {code}
            </p>
          </section>
        ))}
      </div>
      {message && (
        <p role="status" className="text-sm text-secondary">
          {message}
        </p>
      )}
      <section className="min-w-0 overflow-hidden rounded-card border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <caption className="sr-only">Sampel vendor yang direkrut Sinta Larasati</caption>
            <thead className="border-b border-border bg-canvas text-secondary">
              <tr>
                {["Vendor", "Status", "Order selesai", "Fee layak periode", "Estimasi komisi"].map(
                  (label) => (
                    <th key={label} scope="col" className="px-5 py-4 font-medium">
                      {label}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {ambassadorRecruits.map((vendor) => (
                <tr key={vendor.name} className="border-b border-border">
                  <th scope="row" className="px-5 py-5 font-semibold">
                    {vendor.name}
                  </th>
                  <td className="px-5 py-5">{vendor.status}</td>
                  <td className="px-5 py-5 font-mono">{vendor.orders}</td>
                  <td className="px-5 py-5 font-mono">{formatIdr(vendor.eligibleFeeIdr)}</td>
                  <td className="px-5 py-5 font-mono">
                    {formatIdr(vendor.commissionIdr)}
                    {vendor.held && (
                      <span className="mt-1 block font-sans text-warning">Ditahan · sengketa</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-4 text-xs text-secondary">4 dari 8 vendor ditampilkan</p>
      </section>
      <p className="rounded-card border border-border bg-subtle p-5 text-xs leading-relaxed text-secondary">
        Tidak ada komisi hanya karena mendaftar. Contoh: Rp 20 jt transaksi layak × fee 5% × komisi
        15% = Rp 150 rb. Validasi, refund dan periode penyelesaian tetap berlaku. Link pada sandbox
        ini tidak mengaktifkan pendaftaran Vendor/BA di produksi.
      </p>
    </div>
  );
}
