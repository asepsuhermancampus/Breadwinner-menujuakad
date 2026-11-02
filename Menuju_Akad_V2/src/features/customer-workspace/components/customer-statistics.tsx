"use client";

import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { OverviewResources } from "../hooks/use-overview-resources";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { DualBudgetDonutCard } from "./dual-budget-donut-card";
import { BudgetStatusScrollCard } from "./budget-status-scroll-card";
import { categorizeBudgets } from "../domain/budget-due-status";

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

  // 1. Data Anggaran Real-time (3 Kategori: Lunas, Mendekati Tenggat, Belum Bayar)
  const categorized = categorizeBudgets(financeData);
  const totalFinanceAmount = categorized.total;
  const paidAmount = categorized.paid;
  const dueSoonAmount = categorized.dueSoon;
  const unpaidRegularAmount = categorized.unpaidRegular;
  const totalUnpaid = dueSoonAmount + unpaidRegularAmount;

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

  // Irisan Donut Tabungan Tersedia (Pria: Royal Blue #1610b9, Wanita: Soft Rose #f472b6, Terpakai: Hijau #087f5b)
  const savingsSlices: DonutSlice[] = [];
  let savingsCenterValue: string | number = "Rp 0";
  let savingsCenterLabel = "Belum Ada";

  if (totalSavingsPool > 0) {
    const userColor = isBride ? "#f472b6" : "#1610b9";
    const partnerColor = isBride ? "#1610b9" : "#f472b6";
    const usedColor = "#087f5b";

    if (!hasPartner) {
      const availPercent = Math.round((availableSavings / totalSavingsPool) * 100);
      const usedPercent = Math.max(0, 100 - availPercent);
      if (availPercent > 0) {
        savingsSlices.push({ id: "available", label: "Tabungan Tersedia", percent: availPercent, color: userColor });
      }
      if (usedPercent > 0) {
        savingsSlices.push({ id: "used", label: "Terpakai Anggaran", percent: usedPercent, color: usedColor });
      }
      savingsCenterValue = `${availPercent}%`;
      savingsCenterLabel = "Tersedia";
    } else {
      const userPercent = Math.round((userSavings / totalSavingsPool) * 100);
      const partnerPercent = Math.round((partnerSavings / totalSavingsPool) * 100);
      const usedPercent = Math.max(0, 100 - userPercent - partnerPercent);
      if (userPercent > 0) {
        savingsSlices.push({ id: "user", label: partnerNames.user, percent: userPercent, color: userColor });
      }
      if (partnerPercent > 0) {
        savingsSlices.push({ id: "partner", label: partnerNames.partner, percent: partnerPercent, color: partnerColor });
      }
      if (usedPercent > 0) {
        savingsSlices.push({ id: "used", label: "Terpakai Anggaran", percent: usedPercent, color: usedColor });
      }
      savingsCenterValue = `${Math.min(100, userPercent + partnerPercent)}%`;
      savingsCenterLabel = "Total Tersedia";
    }
  }

  // 3. Irisan Donut Target Anggaran (3 Warna: Hijau #087f5b, Merah Danger #ef4444, Warning Amber #eab308)
  const budgetSlices: DonutSlice[] = [];
  let budgetCenterValue: string | number = "0%";
  let budgetCenterLabel = "0 Pos";

  if (totalFinanceAmount > 0) {
    const paidPercent = Math.round((paidAmount / totalFinanceAmount) * 100);
    const dueSoonPercent = Math.round((dueSoonAmount / totalFinanceAmount) * 100);
    const unpaidPercent = Math.max(0, 100 - paidPercent - dueSoonPercent);

    if (paidPercent > 0) {
      budgetSlices.push({ id: "paid", label: "Sudah Dibayar", percent: paidPercent, color: "#087f5b" });
    }
    if (dueSoonPercent > 0) {
      budgetSlices.push({ id: "dueSoon", label: "Mendekati Tenggat", percent: dueSoonPercent, color: "#ef4444" });
    }
    if (unpaidPercent > 0) {
      budgetSlices.push({ id: "unpaid", label: "Belum Dibayar", percent: unpaidPercent, color: "#eab308" });
    }
    budgetCenterValue = `${paidPercent}%`;
    budgetCenterLabel = "Terbayar";
  }

  const badgeText =
    totalFinanceAmount > 0
      ? categorized.paidCount === financeData.length
        ? "Semua Pos Lunas"
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
