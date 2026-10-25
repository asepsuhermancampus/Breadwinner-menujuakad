import { LandingPlanCard } from "./landing-plan-card";
import { PlanPurchaseProvider } from "@/features/payments/components/plan-purchase-provider";
export function LandingPricing() {
  return (
    <PlanPurchaseProvider>
      <section id="paket" className="bg-canvas py-20 lg:py-28">
        <div className="mx-auto max-w-7xl space-y-14 px-6 lg:px-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose">
              04 / Mulai Dari Yang Kalian Butuhkan
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.9px] text-primary sm:text-4xl">
              Pilih ruang yang sesuai
              <br />
              dengan rencana kalian.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              Mulai gratis. Pilih dukungan lebih lengkap ketika kalian siap.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {(["free", "premium", "lifetime"] as const).map((id) => (
              <LandingPlanCard key={id} id={id} />
            ))}
          </div>
          <p className="rounded-card border border-ux-border bg-ux-dock/60 p-6 text-xs text-secondary">
            Sudah berlangganan? Akses aktif kalian tetap berlaku sesuai paket. Pembayaran baru tidak
            menghapus masa aktif sebelumnya.
          </p>
        </div>
      </section>
    </PlanPurchaseProvider>
  );
}
