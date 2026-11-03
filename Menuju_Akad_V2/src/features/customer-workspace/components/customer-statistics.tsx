"use client";

import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { OverviewResources } from "../hooks/use-overview-resources";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { DualBudgetDonutCard } from "./dual-budget-donut-card";
import { BudgetStatusScrollCard } from "./budget-status-scroll-card";
import { categorizeBudgets } from "../domain/budget-due-status";
import {
  buildOverviewSavingsSlices,
  buildOverviewBudgetSlices,
} from "../domain/overview-donut-slices";

type StatisticsProps = {
  tasks?: PlannerTask[];
  resources: OverviewResources;
  savingsAmount?: number;
  financeBalances?: { groom: number; bride: number; total: number };
  hasPartner?: boolean;
  partnerNames?: { user: string; partner: string };
  ownerSide?: "groom" | "bride";
  tasksAvailable?: boolean;
  financeAvailable?: boolean;
  guestsAvailable?: boolean;
};

export function CustomerStatistics({
  resources,
  savingsAmount = 0,
  financeBalances,
  hasPartner = false,
  partnerNames = { user: "Saya", partner: "Pasangan" },
  ownerSide = "groom",
  financeAvailable = true,
}: StatisticsProps) {
  const financeData = (resources.finance.data ?? []) as CustomerBudget[];

  // 1. Data Anggaran Real-time (5 Kategori: Lunas, Lewat Tenggat, Tenggat Hari Ini, Mendekati Tenggat, Belum Bayar)
  const categorized = categorizeBudgets(financeData);
  const totalFinanceAmount = categorized.total;
  const paidAmount = categorized.paid;
  const overdueAmount = categorized.overdue;
  const dueTodayAmount = categorized.dueToday;
  const dueSoonAmount = categorized.dueSoon;
  const unpaidRegularAmount = categorized.unpaidRegular;
  const totalUnpaid = overdueAmount + dueTodayAmount + dueSoonAmount + unpaidRegularAmount;

  // 2. Data Tabungan & Pembagian Sisi
  const isBride = ownerSide === "bride";
  const userSavings = isBride
    ? (financeBalances?.bride ?? savingsAmount)
    : (financeBalances?.groom ?? savingsAmount);
  const partnerSavings = isBride
    ? (financeBalances?.groom ?? 0)
    : (financeBalances?.bride ?? 0);
  const availableSavings =
    financeBalances?.total ?? savingsAmount ?? (userSavings + partnerSavings);

  const totalSavingsPool = Math.max(availableSavings + paidAmount, availableSavings);

  // 2. Irisan Donut Tabungan Tersedia
  const {
    slices: savingsSlices,
    centerValue: savingsCenterValue,
    centerLabel: savingsCenterLabel,
  } = buildOverviewSavingsSlices({
    hasPartner,
    isBride,
    partnerNames,
    availableSavings,
    userSavings,
    partnerSavings,
    paidAmount,
    totalSavingsPool,
  });

  // 3. Irisan Donut Target Anggaran
  const {
    slices: budgetSlices,
    centerValue: budgetCenterValue,
    centerLabel: budgetCenterLabel,
  } = buildOverviewBudgetSlices({
    totalFinanceAmount,
    paidAmount,
    overdueAmount,
    dueTodayAmount,
    dueSoonAmount,
    unpaidRegularAmount,
  });

  const badgeText =
    totalFinanceAmount > 0
      ? categorized.paidCount === financeData.length
        ? "Semua Pos Lunas"
        : categorized.overdueCount > 0
          ? `${categorized.overdueCount} Pos Lewat Tenggat`
          : categorized.dueTodayCount > 0
            ? `${categorized.dueTodayCount} Pos Tenggat Hari Ini`
            : categorized.dueSoonCount > 0
              ? `${categorized.dueSoonCount} Pos Perlu Segera Dibayar`
              : availableSavings >= totalUnpaid && totalUnpaid > 0
                ? "Tabungan Mencukupi"
                : `${categorized.paidCount}/${financeData.length} Pos Terbayar`
      : availableSavings > 0
        ? "Kas Siap Alokasi"
        : undefined;

  return (
    <section className="mt-6 space-y-4" aria-label="Statistik perencanaan">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Statistik & Analisis Kesiapan
        </h2>
        <p className="text-xs text-secondary">
          Pantau tabungan tersedia, status pembayaran anggaran, dan rincian alokasi biaya pernikahan kalian.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Card Kiri: 2 Pie Chart (Tabungan Tersedia & Target Anggaran) */}
        <DualBudgetDonutCard
          className="lg:col-span-2"
          availableSavings={availableSavings}
          savingsSlices={savingsSlices}
          savingsCenterValue={savingsCenterValue}
          savingsCenterLabel={savingsCenterLabel}
          hasPartner={hasPartner}
          partnerNames={partnerNames}
          ownerSide={ownerSide}
          userSavings={userSavings}
          partnerSavings={partnerSavings}
          usedForBudget={paidAmount}
          totalBudget={totalFinanceAmount}
          paidBudget={paidAmount}
          overdueBudget={overdueAmount}
          dueTodayBudget={dueTodayAmount}
          dueSoonBudget={dueSoonAmount}
          unpaidRegularBudget={unpaidRegularAmount}
          budgetSlices={budgetSlices}
          budgetCenterValue={budgetCenterValue}
          budgetCenterLabel={budgetCenterLabel}
          badgeText={badgeText}
          badgeSubtext="tersinkronisasi dengan Tabungan & Anggaran"
          manageHref={financeAvailable ? "/planner/finance" : undefined}
        />

        {/* Card Kanan: Detail Anggaran Scrollable (Menggantikan RSVP) */}
        <BudgetStatusScrollCard
          className="lg:col-span-1"
          budgets={financeData}
          financeAvailable={financeAvailable}
          manageHref={financeAvailable ? "/planner/finance" : undefined}
        />
      </div>
    </section>
  );
}
