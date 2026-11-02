import { redirect } from "next/navigation";
import { getSuperadminSession } from "@/server/reviews/access";
import { getPaymentDatabase } from "@/server/payments/runtime";
import {
  readPlanPricing,
  readPlanPricingAudit,
} from "@/server/payments/plan-pricing-settings";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { SuperadminPricingManager } from "@/features/superadmin/components/superadmin-pricing-manager";

export const dynamic = "force-dynamic";

export default async function SuperadminPricingPage() {
  const account = await getSuperadminSession();
  if (!account) redirect("/superadmin/login");

  const db = getPaymentDatabase().storage();
  const pricing = readPlanPricing(db);
  const audit = readPlanPricingAudit(db, 30);

  return (
    <LiveOperationsShell account={account.email} superadmin active="/superadmin/pricing">
      <div className="space-y-6 w-full max-w-7xl pb-12">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-card border border-ux-border bg-surface p-5 shadow-xs">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Kelola Paket & Harga
            </h1>
            <p className="mt-1 text-xs text-secondary sm:text-sm">
              Atur harga langganan Paket Premium dan Lifetime secara dinamis tanpa mengubah kode.
            </p>
          </div>
        </header>

        <SuperadminPricingManager initialPricing={pricing} initialAudit={audit} />
      </div>
    </LiveOperationsShell>
  );
}

