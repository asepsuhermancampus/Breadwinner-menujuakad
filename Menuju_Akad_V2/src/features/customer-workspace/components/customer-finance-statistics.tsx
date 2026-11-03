"use client";

import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { DualBudgetDonutCard } from "./dual-budget-donut-card";
import { BudgetStatusScrollCard } from "./budget-status-scroll-card";
import { categorizeBudgets } from "../domain/budget-due-status";
import {
  buildOverviewSavingsSlices,
  buildOverviewBudgetSlices,
} from "../domain/overview-donut-slices";

export type CustomerFinanceStatisticsProps = {
  financeData: CustomerBudget[];
  savingsAmount?: number | undefined;
  financeBalances?: { groom: number; bride: number; total: number } | undefined;
  hasPartner?: boolean | undefined;
  partnerNames?: { user: string; partner: string } | undefined;
  ownerSide?: "groom" | "bride" | undefined;
  financeAvailable?: boolean | undefined;
};

export function CustomerFinanceStatistics({
  financeData,
  savingsAmount = 0,
  financeBalances,
  hasPartner = false,
  partnerNames = { user: "Saya", partner: "Pasangan" },
  ownerSide = "groom",
  financeAvailable = true,
}: CustomerFinanceStatisticsProps) {
  // 1. Data Anggaran Real-time
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

  // 3. Irisan Donut Tabungan Tersedia
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

  // 4. Irisan Donut Target Anggaran
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
      <DualBudgetDonutCard
        className="xl:col-span-2"
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
        manageHref={financeAvailable ? "/planner/finance" : undefined}
      />
      <BudgetStatusScrollCard
        className="xl:col-span-1"
        budgets={financeData}
        financeAvailable={financeAvailable}
        manageHref={financeAvailable ? "/planner/finance" : undefined}
      />
    </div>
  );
}
