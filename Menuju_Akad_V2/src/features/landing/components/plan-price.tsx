"use client";
import { Sparkles } from "lucide-react";
import { getPlan } from "@/features/plans/domain/catalog";
import type { PlanId } from "@/features/plans/types/plans";
import type { PlanQuote } from "@/features/payments/checkout-types";
import type { PurchaseOffer } from "@/features/payments/purchase-offer";
const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
export function PlanPrice({
  id,
  quote,
  pending,
  error,
  reserve,
  offer,
  prices,
  blocked = false,
  loading = false,
}: {
  id: PlanId;
  quote: PlanQuote | null;
  pending: boolean;
  error: string;
  reserve: (claim: boolean) => Promise<PlanQuote | null>;
  offer?: PurchaseOffer | null | undefined;
  prices?: Record<string, number> | undefined;
  blocked?: boolean | undefined;
  loading?: boolean | undefined;
}) {
  const plan = getPlan(id),
    effectiveOriginal = prices?.[id] ?? plan.originalAmount,
    total =
      quote &&
      !quote.blockedReason &&
      !quote.cancelledAt &&
      !["paid", "expired"].includes(quote.status)
        ? quote.totalAmount
        : null;
  const ready = total != null;
  const credit = id === "lifetime" ? (quote?.upgradeCredit ?? offer?.upgradeCredit ?? 0) : 0;
  const base =
    id === "lifetime" ? (offer?.lifetimeAmount ?? effectiveOriginal) : effectiveOriginal;
  return (
    <div className="border-y border-ux-border/60 py-4 my-2">
      <div>
        {(ready || credit > 0) && (
          <del className="mb-1 block font-mono text-xs text-secondary/70">
            {rupiah(effectiveOriginal)}
          </del>
        )}
        <div className="flex items-baseline gap-1.5">
          <span
            data-testid="plan-total"
            className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-brand-secondary"
          >
            {rupiah(total ?? base)}
          </span>
        </div>
      </div>

      <span className="mt-1.5 block text-xs font-medium text-secondary">
        {id === "free"
          ? "Gratis, tanpa batas waktu"
          : id === "premium"
            ? "per 6 bulan persiapan"
            : "sekali bayar · tanpa kedaluwarsa"}
      </span>

      {id !== "free" && !ready && !blocked && offer?.newBuyer !== false && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => void reserve(true)}
            disabled={pending || loading || Boolean(error)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 py-1.5 px-3 text-xs font-semibold text-brand-secondary hover:bg-primary/10 transition disabled:opacity-50"
          >
            <Sparkles size={12} className="text-primary shrink-0" aria-hidden="true" />
            <span>{pending ? "Memastikan harga…" : "Klaim diskon tambahan 5%"}</span>
          </button>
        </div>
      )}

      {credit > 0 && (
        <div className="mt-3 space-y-1 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 text-xs text-secondary">
          <p className="font-semibold text-emerald-800 dark:text-emerald-300">
            Kredit Premium −{rupiah(credit)}
          </p>
          <p className="text-[11px]">
            Lifetime {rupiah(effectiveOriginal)} − Premium {rupiah(credit)} = {rupiah(base)}
          </p>
          <p className="text-[11px] text-muted">
            Berlaku sampai{" "}
            {new Date(offer?.upgradeValidUntil ?? quote?.upgradeValidUntil ?? "").toLocaleDateString(
              "id-ID",
            )}
          </p>
        </div>
      )}
      {id === "lifetime" &&
        offer?.subscription.planId === "premium" &&
        !credit &&
        offer.upgradeValidUntil && (
          <p className="mt-3 text-xs text-secondary">
            Periode kredit upgrade telah berakhir. Harga Lifetime kembali normal.
          </p>
        )}
      {ready && quote && (
        <div aria-live="polite" className="mt-3 space-y-1 rounded-xl border border-ux-border/60 bg-subtle/40 p-3 text-xs text-secondary">
          {quote.discountAmount > 0 && (
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">
              Diskon pengguna baru −{rupiah(quote.discountAmount)}
            </p>
          )}
          <p className="text-[11px] text-muted">Kode unik +{rupiah(quote.uniqueAmount ?? 0)} · Total sudah termasuk kode unik.</p>
          {quote.eligibility === "requires-login" && (
            <p className="text-[11px] text-muted">Kelayakan pengguna baru diperiksa setelah login.</p>
          )}
        </div>
      )}
      {quote?.blockedReason && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {quote.blockedReason}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
      {quote && !ready && !error && (
        <p role="status" className="mt-2 text-xs text-secondary">
          Nominal resmi belum tersedia. Klik klaim untuk memeriksa pesanan yang sama.
        </p>
      )}
    </div>
  );
}
