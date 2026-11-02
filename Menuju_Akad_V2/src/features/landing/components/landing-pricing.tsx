import { LandingPlanCard } from "./landing-plan-card";
import { PlanPurchaseProvider } from "@/features/payments/components/plan-purchase-provider";
export function LandingPricing() {
  return (
    <PlanPurchaseProvider>
      <section id="paket" className="bg-canvas py-20 lg:py-28">
        <div className="mx-auto max-w-7xl space-y-14 px-6 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-sans text-xs font-semibold tracking-widest text-secondary uppercase">
              Investasi Berharga
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
              Pilihan ruang sesuai{" "}
              <span className="font-serif font-normal italic text-forest-neutral">
                rencana kalian
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
              Mulai gratis untuk menyelaraskan persiapan awal. Tingkatkan ke paket penuh kapan pun
              kalian siap tanpa biaya langganan berulang yang mengejutkan.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {(["free", "premium", "lifetime"] as const).map((id) => (
              <LandingPlanCard key={id} id={id} />
            ))}
          </div>
        </div>
      </section>
    </PlanPurchaseProvider>
  );
}
