"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { SavingsDonutPane, BudgetDonutPane } from "./dual-budget-donut-panes";
import { CardInfoPopover } from "./card-info-popover";

export type DualBudgetDonutProps = {
  availableSavings: number;
  savingsSlices: DonutSlice[];
  savingsCenterValue?: string | number | undefined;
  savingsCenterLabel?: string | undefined;
  hasPartner: boolean;
  partnerNames: { user: string; partner: string };
  ownerSide?: "groom" | "bride" | undefined;
  userSavings?: number | undefined;
  partnerSavings?: number | undefined;
  usedForBudget?: number | undefined;

  totalBudget: number;
  paidBudget: number;
  overdueBudget?: number | undefined;
  dueTodayBudget?: number | undefined;
  dueSoonBudget: number;
  unpaidRegularBudget: number;
  budgetSlices: DonutSlice[];
  budgetCenterValue?: string | number | undefined;
  budgetCenterLabel?: string | undefined;

  badgeText?: string | undefined;
  badgeSubtext?: string | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
};

export function DualBudgetDonutCard({
  availableSavings,
  savingsSlices,
  savingsCenterValue,
  savingsCenterLabel = "Tersedia",
  hasPartner,
  partnerNames,
  ownerSide = "groom",
  userSavings = 0,
  partnerSavings = 0,
  usedForBudget = 0,
  totalBudget,
  paidBudget,
  overdueBudget = 0,
  dueTodayBudget = 0,
  dueSoonBudget,
  unpaidRegularBudget,
  budgetSlices,
  budgetCenterValue,
  budgetCenterLabel = "Terbayar",
  badgeText,
  badgeSubtext,
  manageHref = "/planner/finance",
  className,
}: DualBudgetDonutProps) {
  return (
    <div
      className={cn(
        "bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs",
        className,
      )}
      aria-label="Kesiapan finansial tabungan dan alokasi anggaran"
    >
      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">
                Kesiapan Finansial & Anggaran
              </h3>
              <CardInfoPopover
                title="Kesiapan Finansial & Anggaran"
                description="Tersinkronisasi otomatis dengan menu Tabungan & Anggaran. Memantau simpanan bersama dan progres pelunasan pos biaya pernikahan secara real-time."
              />
            </div>
          </div>
          {manageHref && (
            <Link
              href={manageHref}
              className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
            >
              Kelola Tabungan <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        {/* Metrics Headline: Anggaran & Tabungan */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-2">
          <div>
            <span className="text-[11px] text-secondary font-medium">Tabungan Tersedia</span>
            <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                Rp {availableSavings.toLocaleString("id-ID")}
              </span>
              {badgeText && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <ArrowUpRight size={11} />
                  {badgeText}
                </span>
              )}
            </div>
            {badgeSubtext && (
              <span className="text-[10px] text-secondary block mt-0.5">{badgeSubtext}</span>
            )}
          </div>
          <div>
            <span className="text-[11px] text-secondary font-medium">Total Target Anggaran</span>
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Rp {totalBudget.toLocaleString("id-ID")}
            </div>
          </div>
        </div>

        {/* Dual Donut Charts */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch pt-2 border-t border-ux-border/40">
          <SavingsDonutPane
            hasPartner={hasPartner}
            partnerNames={partnerNames}
            ownerSide={ownerSide}
            userSavings={userSavings}
            partnerSavings={partnerSavings}
            availableSavings={availableSavings}
            usedForBudget={usedForBudget}
            slices={savingsSlices}
            centerValue={savingsCenterValue}
            centerLabel={savingsCenterLabel}
          />
          <BudgetDonutPane
            paidBudget={paidBudget}
            overdueBudget={overdueBudget}
            dueTodayBudget={dueTodayBudget}
            dueSoonBudget={dueSoonBudget}
            unpaidRegularBudget={unpaidRegularBudget}
            slices={budgetSlices}
            centerValue={budgetCenterValue}
            centerLabel={budgetCenterLabel}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-ux-border/60 flex items-center justify-between text-[11px] text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Klik irisan diagram untuk fokus</span>
        </div>
      </div>
    </div>
  );
}
