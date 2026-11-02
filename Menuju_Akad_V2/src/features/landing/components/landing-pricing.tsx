import { LandingPlanCard } from "./landing-plan-card";
import { PlanPurchaseProvider } from "@/features/payments/components/plan-purchase-provider";
export function LandingPricing() {
  return (
    <PlanPurchaseProvider>
      <section id="paket" className="bg-canvas py-16 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-12 px-6 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <span className="font-sans text-xs font-semibold tracking-widest text-secondary uppercase">
              Investasi Berharga
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-brand-secondary sm:text-3xl lg:text-4xl sm:whitespace-nowrap">
              Pilihan ruang sesuai{" "}
              <span className="font-serif font-normal italic text-forest-neutral">
                rencana kalian
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-secondary sm:text-sm">
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
