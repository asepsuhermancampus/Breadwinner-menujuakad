"use client";

import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import type { OverviewResources } from "../hooks/use-overview-resources";
import { GiftedDonutChart } from "@/components/ui/gifted-donut-chart";
import { ReuiCapitalInflowsCard } from "@/components/ui/reui-capital-inflows-card";
import { REUI_DONUT_COLORS, type InflowSource } from "@/components/ui/reui-capital-inflows-types";

type StatisticsProps = {
  tasks?: PlannerTask[];
  resources: OverviewResources;
  tasksAvailable?: boolean;
  financeAvailable?: boolean;
  guestsAvailable?: boolean;
};

export function CustomerStatistics({
  resources,
  financeAvailable = true,
  guestsAvailable = true,
}: StatisticsProps) {
  const financeData = (resources.finance.data ?? []) as CustomerBudget[];
  const guestData = (resources.guests.data ?? []) as GuestInvitation[];

  // 1. Finance / Capital Inflows Data (ReUI Chart-13 style)
  const totalFinanceAmount = financeData.reduce((sum, item) => sum + (item.amount ?? 0), 0);

  const categoryMap = new Map<string, number>();
  for (const item of financeData) {
    const cat = (item.category || item.purpose || "Lainnya").trim();
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + (item.amount ?? 0));
  }
  const sortedCategories = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);

  const realSources: InflowSource[] = sortedCategories.slice(0, 3).map(([name, amount], idx) => ({
    id: name,
    name,
    amount,
    percentage: totalFinanceAmount > 0 ? Math.round((amount / totalFinanceAmount) * 100) : 0,
    color: REUI_DONUT_COLORS[idx % REUI_DONUT_COLORS.length]!,
    change: "+12.2%",
    isIncrease: true,
  }));

  // Fallback demo/target data if workspace has 0 budget items yet
  const defaultSources: InflowSource[] = [
    { id: "1", name: "Alokasi Katering", amount: 45000000, percentage: 48, color: "#087f5b", change: "+12.2%", isIncrease: true },
    { id: "2", name: "Sewa Gedung & Venue", amount: 25000000, percentage: 27, color: "#10b981", change: "+5.4%", isIncrease: true },
    { id: "3", name: "Dekorasi & Pelaminan", amount: 15000000, percentage: 16, color: "#34d399", change: "-2.1%", isIncrease: false },
  ];

  const activeSources = realSources.length > 0 ? realSources : defaultSources;
  const displayTotal = totalFinanceAmount > 0 ? totalFinanceAmount : 85000000;
  const topCoverage = activeSources.slice(0, 3).reduce((sum, s) => sum + s.percentage, 0);
  const restPercent = Math.max(0, 100 - topCoverage);

  // 2. Guest Metrics for RSVP Donut
  const totalGuests = guestData.length;
  const attendingGuests = guestData.filter((g) => g.rsvpStatus === "ATTENDING").length;
  const pendingGuests = guestData.filter((g) => g.rsvpStatus === "PENDING" || !g.rsvpStatus).length;
  const declinedGuests = guestData.filter((g) => g.rsvpStatus === "DECLINED").length;
  const attendingPercent = totalGuests > 0 ? Math.round((attendingGuests / totalGuests) * 100) : null;

  return (
    <section className="mt-6 space-y-4" aria-label="Statistik perencanaan">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Statistik & Analisis Kesiapan
          </h2>
          <p className="text-xs text-secondary">
            Pantau alokasi anggaran modal dan konfirmasi kehadiran tamu secara terpadu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ReUI Capital Inflows Pie Chart Card (spans 2 cols for clean layout) */}
        <ReuiCapitalInflowsCard
          className="lg:col-span-2"
          title="Capital Inflows"
          subtitle="Alokasi pos dana & anggaran"
          totalAmount={displayTotal}
          sources={activeSources}
          topCoveragePercent={topCoverage}
          coverageLabel="Top 3 pos"
          restPercentage={restPercent}
          manageHref={financeAvailable ? "/planner/finance" : undefined}
        />

        {/* Panel 2: Donut Chart Konfirmasi Tamu */}
        <div className="bg-canvas border border-ux-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-ux-border/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Konfirmasi Tamu (RSVP)</h3>
                  <p className="text-xs text-secondary">{totalGuests} undangan terdata</p>
                </div>
              </div>
              {guestsAvailable && (
                <Link
                  href="/planner/guests"
                  className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5"
                >
                  Buku Tamu <ArrowUpRight size={13} />
                </Link>
              )}
            </div>

            <div className="mt-6 flex items-center justify-around gap-4">
              <GiftedDonutChart
                percent={attendingPercent}
                size={110}
                strokeWidth={10}
                testId="rsvp-percent"
                gradientColors={["#065f46", "#10b981"]}
              />
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-foreground font-medium">Hadir:</span>
                  <span className="font-mono text-secondary">{attendingGuests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-foreground font-medium">Menunggu:</span>
                  <span className="font-mono text-secondary">{pendingGuests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-foreground font-medium">Berhalangan:</span>
                  <span className="font-mono text-secondary">{declinedGuests}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
