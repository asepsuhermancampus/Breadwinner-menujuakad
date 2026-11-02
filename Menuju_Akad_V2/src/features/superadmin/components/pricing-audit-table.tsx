"use client";

import type { PlanPricingAuditEntry } from "@/features/superadmin/types/pricing";
import { History, ArrowRight } from "lucide-react";

const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

export function PricingAuditTable({ audit }: { audit: PlanPricingAuditEntry[] }) {
  return (
    <div className="rounded-card border border-ux-border bg-surface p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center gap-2">
        <History size={18} className="text-primary" aria-hidden="true" />
        <h2 className="text-base font-bold text-foreground">Riwayat Perubahan Harga</h2>
      </div>

      {audit.length === 0 ? (
        <p className="rounded-xl border border-ux-border/60 bg-subtle/30 py-8 text-center text-xs text-secondary">
          Belum ada riwayat penyesuaian harga paket. Seluruh paket saat ini masih menggunakan harga standar bawaan.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ux-border bg-canvas/60 text-[11px] font-semibold uppercase tracking-wider text-secondary">
              <tr>
                <th className="px-3.5 py-2.5">Waktu</th>
                <th className="px-3.5 py-2.5">Paket</th>
                <th className="px-3.5 py-2.5">Perubahan Harga</th>
                <th className="px-3.5 py-2.5">Oleh</th>
                <th className="px-3.5 py-2.5">Alasan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ux-border/60">
              {audit.map((entry) => (
                <tr key={entry.id} className="hover:bg-canvas/40 transition">
                  <td className="whitespace-nowrap px-3.5 py-3 text-secondary">
                    {new Date(entry.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Asia/Jakarta",
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase ${
                        entry.planId === "lifetime"
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                          : "border border-rose/30 bg-rose/10 text-rose"
                      }`}
                    >
                      Paket {entry.planId === "lifetime" ? "Lifetime" : "Premium"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3">
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <del className="text-secondary">{formatRupiah(entry.oldAmount)}</del>
                      <ArrowRight size={13} className="text-muted" aria-hidden="true" />
                      <span className="font-bold text-brand-secondary">{formatRupiah(entry.newAmount)}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 font-medium text-foreground">
                    {entry.actor}
                  </td>
                  <td className="px-3.5 py-3 text-secondary max-w-xs break-words">
                    {entry.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
