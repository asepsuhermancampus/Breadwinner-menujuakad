"use client";

import { useState } from "react";
import { Sparkles, Crown, HeartHandshake, CheckCircle2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  PlanPricingItem,
  PlanPricingAuditEntry,
} from "@/features/superadmin/types/pricing";
import { PriceEditDialog } from "./price-edit-dialog";
import { PricingAuditTable } from "./pricing-audit-table";

const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

export function SuperadminPricingManager({
  initialPricing,
  initialAudit,
}: {
  initialPricing: PlanPricingItem[];
  initialAudit: PlanPricingAuditEntry[];
}) {
  const [pricing, setPricing] = useState<PlanPricingItem[]>(initialPricing);
  const [audit, setAudit] = useState<PlanPricingAuditEntry[]>(initialAudit);
  const [editingPlan, setEditingPlan] = useState<PlanPricingItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function handleSaved(data: {
    pricing: PlanPricingItem[];
    audit: PlanPricingAuditEntry[];
    message: string;
  }) {
    setPricing(data.pricing);
    setAudit(data.audit);
    setToastMessage(data.message);
    setTimeout(() => setToastMessage(null), 6000);
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-card border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-2xs"
        >
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid Kartu Paket */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {pricing.map((plan) => {
          const isPaid = plan.planId === "premium" || plan.planId === "lifetime";
          const newBuyerPrice = isPaid ? plan.amount - Math.floor(plan.amount / 20) : 0;

          return (
            <div
              key={plan.planId}
              className={`flex flex-col justify-between rounded-card border p-6 shadow-xs transition hover:shadow-md ${
                plan.planId === "lifetime"
                  ? "border-amber-500/30 bg-surface ring-1 ring-amber-500/20"
                  : plan.planId === "premium"
                    ? "border-primary/30 bg-surface ring-1 ring-primary/20"
                    : "border-ux-border bg-surface"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {plan.planId === "lifetime" ? (
                      <Crown size={16} className="text-amber-500" aria-hidden="true" />
                    ) : plan.planId === "premium" ? (
                      <Sparkles size={16} className="text-rose" aria-hidden="true" />
                    ) : (
                      <HeartHandshake size={16} className="text-secondary" aria-hidden="true" />
                    )}
                    <h2 className="text-base font-bold text-foreground">Paket {plan.label}</h2>
                  </div>

                  {isPaid && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        plan.isCustom
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                          : "bg-subtle text-secondary border border-ux-border"
                      }`}
                    >
                      {plan.isCustom ? "Kustom / Promo" : "Standar"}
                    </span>
                  )}
                </div>

                <div className="mt-4 border-y border-ux-border/60 py-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-brand-secondary">
                      {formatRupiah(plan.amount)}
                    </span>
                  </div>

                  {isPaid ? (
                    <div className="mt-2 space-y-1 text-[11px] text-secondary">
                      {plan.isCustom && (
                        <p className="flex items-center gap-1">
                          <span>Harga Bawaan Sistem:</span>
                          <del className="text-muted">{formatRupiah(plan.defaultAmount)}</del>
                        </p>
                      )}
                      <p className="text-emerald-700 dark:text-emerald-400">
                        Diskon Pembeli Baru (5%):{" "}
                        <strong className="font-mono">{formatRupiah(newBuyerPrice)}</strong>
                      </p>
                    </div>
                  ) : (
                    <p className="mt-2 text-[11px] text-secondary">
                      Checklist dasar dan perencanaan awal gratis selamanya.
                    </p>
                  )}
                </div>

                <div className="mt-3 text-[11px] text-secondary">
                  {plan.updatedAt ? (
                    <p>
                      Terakhir diubah:{" "}
                      {new Date(plan.updatedAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Asia/Jakarta",
                      })}
                    </p>
                  ) : (
                    <p className="text-muted">Harga default bawaan sistem</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-2">
                {isPaid ? (
                  <Button
                    variant="secondary"
                    className="w-full justify-center gap-2 text-xs"
                    onClick={() => setEditingPlan(plan)}
                  >
                    <Pencil size={13} aria-hidden="true" />
                    Ubah Harga Paket
                  </Button>
                ) : (
                  <div className="flex items-center justify-center rounded-control border border-ux-border/50 bg-subtle/40 py-2.5 text-center text-xs text-muted">
                    Paket Gratis Permanen
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Riwayat Audit Perubahan Harga */}
      <PricingAuditTable audit={audit} />

      {/* Modal Dialog Edit Harga */}
      <PriceEditDialog
        plan={editingPlan}
        open={Boolean(editingPlan)}
        onClose={() => setEditingPlan(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}
