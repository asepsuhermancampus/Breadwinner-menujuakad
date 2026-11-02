"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";

export type SavingsPaneProps = {
  hasPartner: boolean;
  partnerNames: { user: string; partner: string };
  userSavings: number;
  partnerSavings: number;
  availableSavings: number;
  usedForBudget: number;
  slices: DonutSlice[];
  centerValue?: string | number | undefined;
  centerLabel?: string | undefined;
};

export function SavingsDonutPane({
  hasPartner,
  partnerNames,
  userSavings,
  partnerSavings,
  availableSavings,
  usedForBudget,
  slices,
  centerValue,
  centerLabel = "Tersedia",
}: SavingsPaneProps) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <span className="text-xs font-semibold text-foreground mb-3 self-start">
        Tabungan Tersedia {hasPartner ? "(Bersama)" : "(Pribadi)"}
      </span>
      <ReuiCapitalInflowsDonut
        slices={slices}
        centerValue={centerValue}
        coverageLabel={centerLabel}
        size={140}
      />
      <div className="w-full mt-3 space-y-1.5 text-[11px]">
        {hasPartner ? (
          <>
            <div className="flex items-center justify-between text-secondary">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                {partnerNames.user}
              </span>
              <span className="font-mono font-medium text-foreground">
                Rp {userSavings.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between text-secondary">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                {partnerNames.partner}
              </span>
              <span className="font-mono font-medium text-foreground">
                Rp {partnerSavings.toLocaleString("id-ID")}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-secondary">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Tabungan Kalian
            </span>
            <span className="font-mono font-medium text-foreground">
              Rp {availableSavings.toLocaleString("id-ID")}
            </span>
          </div>
        )}
        {usedForBudget > 0 && (
          <div className="flex items-center justify-between text-secondary pt-1 border-t border-ux-border/40">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-800 dark:bg-emerald-700 shrink-0" />
              Terpakai Bayar Anggaran
            </span>
            <span className="font-mono font-medium text-emerald-800 dark:text-emerald-400">
              Rp {usedForBudget.toLocaleString("id-ID")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export type BudgetPaneProps = {
  paidBudget: number;
  unpaidBudget: number;
  slices: DonutSlice[];
  centerValue?: string | number | undefined;
  centerLabel?: string | undefined;
};

export function BudgetDonutPane({
  paidBudget,
  unpaidBudget,
  slices,
  centerValue,
  centerLabel = "Terbayar",
}: BudgetPaneProps) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <span className="text-xs font-semibold text-foreground mb-3 self-start">
        Status Target Anggaran
      </span>
      <ReuiCapitalInflowsDonut
        slices={slices}
        centerValue={centerValue}
        coverageLabel={centerLabel}
        size={140}
      />
      <div className="w-full mt-3 space-y-1.5 text-[11px]">
        <div className="flex items-center justify-between text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#087f5b] shrink-0" />
            Sudah Dibayar
          </span>
          <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
            Rp {paidBudget.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex items-center justify-between text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            Belum Dibayar
          </span>
          <span className="font-mono font-medium text-foreground">
            Rp {unpaidBudget.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}

