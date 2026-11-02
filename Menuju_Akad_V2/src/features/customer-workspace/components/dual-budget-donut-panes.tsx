"use client";

import { cn } from "@/lib/cn";
import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";

export type SavingsPaneProps = {
  hasPartner: boolean;
  partnerNames: { user: string; partner: string };
  ownerSide?: "groom" | "bride" | undefined;
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
  ownerSide = "groom",
  userSavings,
  partnerSavings,
  availableSavings,
  usedForBudget,
  slices,
  centerValue,
  centerLabel = "Tersedia",
}: SavingsPaneProps) {
  const isUserBride = ownerSide === "bride";
  const userColor = isUserBride ? "#f472b6" : "#10b981";
  const partnerColor = isUserBride ? "#10b981" : "#f472b6";
  const userTextColor = isUserBride
    ? "text-rose-600 dark:text-rose-400"
    : "text-emerald-700 dark:text-emerald-400";
  const partnerTextColor = isUserBride
    ? "text-emerald-700 dark:text-emerald-400"
    : "text-rose-600 dark:text-rose-400";
  const usedColor = "#087f5b";

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
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: userColor }} />
                {partnerNames.user}
              </span>
              <span className={cn("font-mono font-medium", userTextColor)}>
                Rp {userSavings.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex items-center justify-between text-secondary">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: partnerColor }} />
                {partnerNames.partner}
              </span>
              <span className={cn("font-mono font-medium", partnerTextColor)}>
                Rp {partnerSavings.toLocaleString("id-ID")}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between text-secondary">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: userColor }} />
              Tabungan Kalian
            </span>
            <span className={cn("font-mono font-medium", userTextColor)}>
              Rp {availableSavings.toLocaleString("id-ID")}
            </span>
          </div>
        )}
        {usedForBudget > 0 && (
          <div className="flex items-center justify-between text-secondary pt-1 border-t border-ux-border/40">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: usedColor }} />
              Terpakai Bayar Anggaran
            </span>
            <span className="font-mono font-medium text-[#087f5b] dark:text-emerald-400">
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
  dueSoonBudget: number;
  unpaidRegularBudget: number;
  slices: DonutSlice[];
  centerValue?: string | number | undefined;
  centerLabel?: string | undefined;
};

export function BudgetDonutPane({
  paidBudget,
  dueSoonBudget,
  unpaidRegularBudget,
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
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            Mendekati Tenggat
          </span>
          <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
            Rp {dueSoonBudget.toLocaleString("id-ID")}
          </span>
        </div>
        <div className="flex items-center justify-between text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            Belum Dibayar
          </span>
          <span className="font-mono font-medium text-foreground">
            Rp {unpaidRegularBudget.toLocaleString("id-ID")}
          </span>
        </div>
      </div>
    </div>
  );
}
