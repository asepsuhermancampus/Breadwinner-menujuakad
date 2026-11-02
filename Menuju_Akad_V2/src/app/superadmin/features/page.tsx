import { redirect } from "next/navigation";
import { getSuperadminSession } from "@/server/reviews/access";
import { LiveOperationsShell } from "@/features/operations-shell/components/live-operations-shell";
import { FeaturesNavBar } from "@/features/customer-workspace/components/features-nav-bar";
import { FeaturesMaintenanceSection } from "@/features/customer-workspace/components/features-maintenance-section";
import { FeatureAvailabilityPanel } from "@/features/customer-workspace/components/feature-availability-panel";
import { FeatureRolloutPanel } from "@/features/customer-workspace/components/feature-rollout-panel";
import { DashboardCardsPanel } from "@/features/customer-workspace/components/dashboard-cards-panel";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readDashboardCards } from "@/server/workspaces/dashboard-cards";

export const dynamic = "force-dynamic";

export default async function Page() {
  const account = await getSuperadminSession();
  if (!account) redirect("/superadmin/login");
  const db = getWorkspaceService().db;
  const cards = (["guest", "owner", "partner"] as const).flatMap((audience) =>
    readDashboardCards(db, audience),
  );

  return (
    <LiveOperationsShell account={account.email} superadmin active="/superadmin/features">
      <div className="space-y-6 pb-12">
            <header className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-ux-border bg-surface p-5 shadow-xs">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Fitur & Pemeliharaan
                </h1>
                <p className="mt-1 text-xs text-secondary sm:text-sm">
                  Status pemeliharaan, izin kelompok peran, dan rilis fitur platform.
                </p>
              </div>
            </header>

            <FeaturesNavBar />

            {/* Section 1: Pemeliharaan Fitur Global (13 fitur) */}
            <FeaturesMaintenanceSection />

            {/* Section 2: Ketersediaan Fitur per Kelompok */}
            <div id="ketersediaan-kelompok" className="scroll-mt-24">
              <FeatureAvailabilityPanel />
            </div>

            {/* Section 3: Rilis Fitur Bertahap */}
            <div id="rilis-bertahap" className="scroll-mt-24">
              <FeatureRolloutPanel />
            </div>

            {/* Section 4: Card dan Bagian Dashboard */}
            <div id="card-dashboard" className="scroll-mt-24">
              <DashboardCardsPanel initial={cards} />
            </div>
          </div>
        </LiveOperationsShell>
        );
}
