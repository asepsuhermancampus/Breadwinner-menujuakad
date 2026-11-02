"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Crown, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/cn";
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

  const buttonClass = `inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-semibold tracking-wide transition-all duration-200 ${
    featured
      ? "bg-primary text-on-primary hover:bg-primary-hover shadow-sm hover:shadow-md"
      : id === "lifetime"
        ? "border border-amber-500/40 bg-surface text-brand-secondary hover:bg-primary-hover hover:text-on-primary hover:border-transparent focus-visible:bg-primary-hover focus-visible:text-on-primary"
        : "border border-ux-border bg-surface text-brand-secondary hover:bg-primary-hover hover:text-on-primary focus-visible:bg-primary-hover focus-visible:text-on-primary"
  }`;

  return (
    <div
      data-testid={`plan-${id}`}
      className={cn(
        "relative flex flex-col justify-between rounded-3xl border transition-all duration-300 p-7 sm:p-8",
        blocked
          ? "grayscale border-gray-300 bg-gray-100/80"
          : featured
            ? "border-2 border-primary/40 bg-surface shadow-sm ring-4 ring-primary/5 hover:-translate-y-1 hover:shadow-xl"
            : id === "lifetime"
              ? "border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.04] via-surface to-surface shadow-2xs hover:-translate-y-1 hover:shadow-xl"
              : "border border-ux-border/80 bg-surface/90 shadow-2xs hover:-translate-y-1 hover:shadow-md",
      )}
    >
      {/* Top Floating Badge for Featured / Best Value */}
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-secondary px-3.5 py-1 text-[11px] font-semibold tracking-wider text-emerald-200 uppercase shadow-md flex items-center gap-1.5 ring-2 ring-surface">
          <Sparkles size={12} className="text-amber-300 fill-amber-300" aria-hidden="true" />
          <span>Paling Populer</span>
        </div>
      )}
      {id === "lifetime" && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-700 to-amber-900 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-amber-100 uppercase shadow-md flex items-center gap-1.5 ring-2 ring-surface">
          <Crown size={12} className="text-amber-300 fill-amber-300" aria-hidden="true" />
          <span>Investasi Terbaik</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <span className="text-[11px] font-semibold tracking-widest uppercase text-secondary">
            {id === "free" ? "Langkah Awal" : featured ? "Persiapan Lengkap" : "Akses Selamanya"}
          </span>
          <div className="mt-1 flex items-center justify-between">
            <h3 className="text-2xl font-bold tracking-tight text-brand-secondary">{plan.label}</h3>
            {isActive && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                Paket aktif
              </span>
            )}
          </div>
          {isActive && state.offer?.subscription.expiresAt && (
            <p className="mt-1 text-xs text-secondary">
              Aktif sampai{" "}
              {new Date(state.offer.subscription.expiresAt).toLocaleDateString("id-ID")}
            </p>
          )}
          <p className="mt-2 text-xs leading-relaxed text-secondary min-h-[34px]">
            {id === "free"
              ? "Ruang esensial berdua untuk mulai merapikan catatan dan checklist tanpa biaya."
              : featured
                ? "Akses lengkap kuota tamu tanpa batas, tema undangan elegan, dan ekspor PDF."
                : "Investasi sekali seumur hidup tanpa biaya perpanjangan, lengkap custom domain."}
          </p>
        </div>

        <PlanPrice id={id} {...state} blocked={blocked} />

        <div className="pt-1">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Fasilitas Termasuk:
          </p>
          <ul className="space-y-3 text-xs text-secondary">
            {plan.features.map((f, i) => (
              <li key={f} className="flex items-start gap-2.5">
                <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 mt-0.5">
                  <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className={i === 0 && id !== "free" ? "font-semibold text-foreground" : "text-foreground/90"}>
                  {f}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-7">
        {state.quote?.blockedReason && (
          <Link
            href={`/checkout/qris?intent=${encodeURIComponent(state.quote.intentId)}`}
            className="mb-3 block text-center text-xs text-primary underline"
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
            <span>Coba dashboard gratis</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        ) : (
          <button
            className={buttonClass}
            disabled={state.pending || state.loading || Boolean(state.error)}
            onClick={() => void purchase()}
          >
            <span>
              {state.loading ? "Memuat paket…" : state.pending ? "Memproses…" : `Pilih ${plan.label}`}
            </span>
            <ArrowRight size={13} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

