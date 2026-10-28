"use client";
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
  blocked = false,
  loading = false,
}: {
  id: PlanId;
  quote: PlanQuote | null;
  pending: boolean;
  error: string;
  reserve: (claim: boolean) => Promise<PlanQuote | null>;
  offer?: PurchaseOffer | null;
  blocked?: boolean;
  loading?: boolean;
}) {
  const plan = getPlan(id),
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
    id === "lifetime" ? (offer?.lifetimeAmount ?? plan.originalAmount) : plan.originalAmount;
  return (
    <div className="border-y border-ux-border py-4">
      {(ready || credit > 0) && (
        <del className="block text-sm text-secondary">{rupiah(plan.originalAmount)}</del>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <span
          data-testid="plan-total"
          className="font-mono text-3xl font-bold text-brand-secondary"
        >
          {rupiah(total ?? base)}
        </span>
        {id !== "free" && !ready && !blocked && offer?.newBuyer !== false && (
          <button
            type="button"
            onClick={() => void reserve(true)}
            disabled={pending || loading || Boolean(error)}
            className="rounded-full border border-primary/30 px-3 py-1.5 text-xs font-semibold text-brand-secondary hover:bg-primary/5 disabled:opacity-50"
          >
            {pending ? "Memastikan harga…" : "Klaim diskon tambahan 5%"}
          </button>
        )}
      </div>
      <span className="mt-1 block text-xs text-secondary">
        {id === "free"
          ? "gratis, tanpa batas waktu"
          : id === "premium"
            ? "per 6 bulan"
            : "sekali bayar, tanpa kedaluwarsa"}
      </span>
      {credit > 0 && (
        <div className="mt-3 space-y-1 text-xs text-secondary">
          <p>Kredit Premium −{rupiah(credit)} (nilai paket dibayar, tanpa kode unik).</p>
          <p>
            Lifetime {rupiah(plan.originalAmount)} − Premium {rupiah(credit)} = {rupiah(base)}{" "}
            sebelum kode unik.
          </p>
          <p>
            Berlaku sampai{" "}
            {new Date(offer?.upgradeValidUntil ?? quote?.upgradeValidUntil ?? "").toLocaleString(
              "id-ID",
            )}
            .
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
        <div aria-live="polite" className="mt-3 space-y-1 text-xs text-secondary">
          {quote.discountAmount > 0 && (
            <p>
              Diskon pengguna baru −{rupiah(quote.discountAmount)} · kode unik +
              {rupiah(quote.uniqueAmount ?? 0)}
            </p>
          )}
          {!quote.discountAmount && <p>Kode unik +{rupiah(quote.uniqueAmount ?? 0)}.</p>}
          <p>Total sudah termasuk kode unik.</p>
          {quote.eligibility === "requires-login" && (
            <p>Kelayakan pengguna baru diperiksa setelah login.</p>
          )}
          <p>Berlaku sampai {quote.expiresAt ?? "batas tagihan provider"}.</p>
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
