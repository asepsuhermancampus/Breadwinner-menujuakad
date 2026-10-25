"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { getPlan } from "@/features/plans/domain/catalog";
import type { PlanId } from "@/features/plans/types/plans";
import { usePlanQuote } from "@/features/payments/hooks/use-plan-quote";
import { PlanPrice } from "./plan-price";
export function LandingPlanCard({ id }: { id: PlanId }) {
  const plan = getPlan(id),
    featured = id === "premium";
  const state = usePlanQuote(id);
  const active = state.offer?.subscription.planId ?? "free";
  const isActive = Boolean(state.offer) && active === id;
  const blocked =
    isActive || (active !== "free" && id === "free") || (active === "lifetime" && id === "premium");
  const blockedLabel = isActive
    ? "Paket aktif"
    : active === "lifetime"
      ? "Sudah termasuk Lifetime"
      : "Sudah termasuk paket aktif";
  const router = useRouter();
  async function purchase() {
    const intent =
      state.quote?.totalAmount != null &&
      !state.quote.blockedReason &&
      !state.quote.cancelledAt &&
      !["expired", "paid"].includes(state.quote.status)
        ? state.quote
        : await state.reserve(false);
    if (intent?.totalAmount != null)
      router.push(`/checkout/qris?intent=${encodeURIComponent(intent.intentId)}`);
  }
  const buttonClass = `inline-flex w-full items-center justify-center gap-2 rounded-control py-3 text-xs font-semibold transition ${featured ? "bg-primary text-white hover:bg-primary-hover shadow-sm" : "border border-ux-border bg-surface text-primary hover:bg-primary-hover hover:text-white focus-visible:bg-primary-hover focus-visible:text-white"}`;
  return (
    <div
      data-testid={`plan-${id}`}
      className={`flex flex-col justify-between rounded-card border p-8 shadow-xs transition hover:shadow-md ${blocked ? "grayscale border-gray-300 bg-gray-100" : featured ? "border-primary bg-surface ring-2 ring-primary/10" : id === "lifetime" ? "border-champagne/40 bg-ux-dock/60" : "border-ux-border bg-surface"}`}
    >
      <div className="space-y-6">
        <div>
          <span className="text-xs font-semibold tracking-wider text-secondary">
            {id === "free"
              ? "MULAI DARI SINI"
              : featured
                ? "LEBIH LELUASA"
                : "AKSES JANGKA PANJANG"}
          </span>
          <h3 className="mt-1 text-2xl font-bold text-primary">{plan.label}</h3>
          {isActive && <p className="mt-2 text-xs font-semibold">Paket aktif</p>}
          {isActive && state.offer?.subscription.expiresAt && (
            <p className="mt-1 text-xs text-secondary">
              Aktif sampai{" "}
              {new Date(state.offer.subscription.expiresAt).toLocaleDateString("id-ID")}
            </p>
          )}
          <p className="mt-1 text-xs text-secondary">
            {id === "free"
              ? "Untuk langkah pertama kalian."
              : featured
                ? "Untuk rencana yang lebih lengkap."
                : "Untuk seluruh perjalanan kalian."}
          </p>
        </div>
        <PlanPrice id={id} {...state} blocked={blocked} />
        <ul className="space-y-3 text-xs text-secondary">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5">
              <Icon name="check" size={14} className="shrink-0 text-emerald-700" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-8">
        {state.quote?.blockedReason && (
          <Link
            href={`/checkout/qris?intent=${encodeURIComponent(state.quote.intentId)}`}
            className="mb-3 block text-sm underline"
          >
            Kelola atau batalkan pesanan
          </Link>
        )}
        {blocked ? (
          <button className={`${buttonClass} cursor-not-allowed opacity-60`} disabled>
            {blockedLabel}
          </button>
        ) : id === "free" && !state.loading ? (
          <Link href="/dashboard" className={buttonClass}>
            Coba dashboard gratis <Icon name="arrow-right" size={13} />
          </Link>
        ) : (
          <button
            className={buttonClass}
            disabled={state.pending || state.loading || Boolean(state.error)}
            onClick={() => void purchase()}
          >
            {state.loading ? "Memuat paket…" : state.pending ? "Memproses…" : `Pilih ${plan.label}`}{" "}
            <Icon name="arrow-right" size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
