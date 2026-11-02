"use client";

import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import type { OverviewResources } from "../hooks/use-overview-resources";
import { GiftedDonutChart } from "@/components/ui/gifted-donut-chart";
import { ReuiCapitalInflowsCard } from "@/components/ui/reui-capital-inflows-card";
import {
  REUI_DONUT_COLORS,
  type InflowSource,
  type DonutSlice,
} from "@/components/ui/reui-capital-inflows-types";

type StatisticsProps = {
  tasks?: PlannerTask[];
  resources: OverviewResources;
  savingsAmount?: number;
  tasksAvailable?: boolean;
  financeAvailable?: boolean;
  guestsAvailable?: boolean;
};

export function CustomerStatistics({
  resources,
  savingsAmount = 0,
  financeAvailable = true,
  guestsAvailable = true,
}: StatisticsProps) {
  const financeData = (resources.finance.data ?? []) as CustomerBudget[];
  const guestData = (resources.guests.data ?? []) as GuestInvitation[];

  // 1. Data Anggaran & Tabungan Real-time
  const totalFinanceAmount = financeData.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const paidBudgets = financeData.filter((b) => b.completed);
  const paidAmount = paidBudgets.reduce((sum, item) => sum + (item.amount ?? 0), 0);
  const unpaidAmount = Math.max(0, totalFinanceAmount - paidAmount);
  const savings = savingsAmount;
  const coveredBySavings = Math.min(savings, unpaidAmount);

  // Perhitungan persentase realisasi untuk Donut Slices
  let donutSlices: DonutSlice[] = [];
  let coveragePercent = 0;
  let coverageLabel = "Pos Anggaran";

  if (totalFinanceAmount > 0) {
    const paidPercent = Math.round((paidAmount / totalFinanceAmount) * 100);
    const savingsPercent = Math.min(100 - paidPercent, Math.round((coveredBySavings / totalFinanceAmount) * 100));
    const unpaidPercent = Math.max(0, 100 - paidPercent - savingsPercent);

    if (paidPercent > 0) {
      donutSlices.push({ id: "paid", label: "Sudah Dibayar", percent: paidPercent, color: "#087f5b" });
    }
    if (savingsPercent > 0) {
      donutSlices.push({ id: "savings", label: "Tabungan Siap", percent: savingsPercent, color: "#10b981" });
    }
    if (unpaidPercent > 0) {
      donutSlices.push({ id: "unpaid", label: "Sisa Target", percent: unpaidPercent, color: "#a7f3d0", isHatched: true });
    }

    coveragePercent = Math.min(100, paidPercent + savingsPercent);
    coverageLabel = coveragePercent >= 100 ? "Lengkap" : "Dana Siap";
  }

  // List rincian pos anggaran dengan status pembayaran
  const sortedBudgets = [...financeData].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
  const sources: InflowSource[] = sortedBudgets.slice(0, 4).map((item, idx) => ({
    id: item.id || `pos-${idx}`,
    name: item.title || item.purpose || `Pos ${idx + 1}`,
    amount: item.amount ?? 0,
    percentage: totalFinanceAmount > 0 ? Math.round(((item.amount ?? 0) / totalFinanceAmount) * 100) : 0,
    color: REUI_DONUT_COLORS[idx % REUI_DONUT_COLORS.length]!,
    isPaid: Boolean(item.completed),
    change: item.completed ? "Lunas" : "Belum Bayar",
    isIncrease: item.completed,
  }));

  const badgeText =
    totalFinanceAmount > 0
      ? paidBudgets.length === financeData.length
        ? "Semua Pos Lunas"
        : savings >= unpaidAmount && unpaidAmount > 0
          ? "Tabungan Mencukupi"
          : `${paidBudgets.length}/${financeData.length} Pos Terbayar`
      : savings > 0
        ? "Kas Siap Alokasi"
        : undefined;

  // 2. Guest Metrics for RSVP Donut
  const totalGuests = guestData.length;
  const attendingGuests = guestData.filter((g) => g.rsvpStatus === "ATTENDING").length;
  const pendingGuests = guestData.filter((g) => g.rsvpStatus === "PENDING" || !g.rsvpStatus).length;
  const declinedGuests = guestData.filter((g) => g.rsvpStatus === "DECLINED").length;
  const attendingPercent = totalGuests > 0 ? Math.round((attendingGuests / totalGuests) * 100) : null;

  return (
    <section className="mt-6 space-y-4" aria-label="Statistik perencanaan">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Statistik & Analisis Kesiapan
        </h2>
        <p className="text-xs text-secondary">
          Pantau alokasi anggaran modal, tabungan tersedia, dan konfirmasi kehadiran tamu secara terpadu.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card Alokasi Anggaran & Tabungan */}
        <ReuiCapitalInflowsCard
          className="lg:col-span-2"
          title="Alokasi Anggaran & Tabungan"
          subtitle="Status pembayaran pos & kesiapan dana"
          totalAmount={totalFinanceAmount}
          savingsAmount={savings}
          sources={sources}
          donutSlices={donutSlices}
          topCoveragePercent={coveragePercent}
          coverageLabel={coverageLabel}
          manageHref={financeAvailable ? "/planner/finance" : undefined}
          badgeText={badgeText}
          badgeSubtext="tersinkronisasi dengan Tabungan & Anggaran"
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
