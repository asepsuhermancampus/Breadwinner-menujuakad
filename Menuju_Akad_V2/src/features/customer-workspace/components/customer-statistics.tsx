"use client";

import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { OverviewResources } from "../hooks/use-overview-resources";
import { CustomerFinanceStatistics } from "./customer-finance-statistics";
import { CustomerGuestStatistics } from "./customer-guest-statistics";

type StatisticsProps = {
  tasks?: PlannerTask[] | undefined;
  resources: OverviewResources;
  savingsAmount?: number | undefined;
  financeBalances?: { groom: number; bride: number; total: number } | undefined;
  hasPartner?: boolean | undefined;
  partnerNames?: { user: string; partner: string } | undefined;
  ownerSide?: "groom" | "bride" | undefined;
  tasksAvailable?: boolean | undefined;
  financeAvailable?: boolean | undefined;
  guestsAvailable?: boolean | undefined;
};

export function CustomerStatistics({
  resources,
  savingsAmount = 0,
  financeBalances,
  hasPartner = false,
  partnerNames = { user: "Saya", partner: "Pasangan" },
  ownerSide = "groom",
  financeAvailable = true,
  guestsAvailable = true,
}: StatisticsProps) {
  const financeData = (resources.finance?.data ?? []) as CustomerBudget[];
  const guestData = (resources.guests?.data ?? []) as GuestInvitation[];

  return (
    <section className="mt-6 space-y-6" aria-label="Statistik perencanaan">
      <div>
        <h2 className="text-base font-semibold text-foreground tracking-tight">
          Statistik & Analisis Kesiapan
        </h2>
        <p className="text-xs text-secondary">
          Pantau tabungan bersama, alokasi anggaran, dan konfirmasi kehadiran tamu undangan kalian secara real-time.
        </p>
      </div>

      {/* Baris 1: Kesiapan Finansial & Anggaran */}
      {financeAvailable && (
        <CustomerFinanceStatistics
          financeData={financeData}
          savingsAmount={savingsAmount}
          financeBalances={financeBalances}
          hasPartner={hasPartner}
          partnerNames={partnerNames}
          ownerSide={ownerSide}
          financeAvailable={financeAvailable}
        />
      )}

      {/* Baris 2: Kesiapan Tamu & RSVP */}
      {guestsAvailable && (
        <CustomerGuestStatistics
          guestData={guestData}
          partnerNames={partnerNames}
          ownerSide={ownerSide}
          guestsAvailable={guestsAvailable}
        />
      )}
    </section>
  );
}
