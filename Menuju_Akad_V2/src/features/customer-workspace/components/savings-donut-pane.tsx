"use client";

import { cn } from "@/lib/cn";
import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { OVERVIEW_COLORS } from "../domain/overview-donut-slices";
import { useDonutFocus } from "../hooks/use-donut-focus";

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
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();
  const isUserBride = ownerSide === "bride";
  const userColor = isUserBride ? OVERVIEW_COLORS.bride : OVERVIEW_COLORS.groom;
  const partnerColor = isUserBride ? OVERVIEW_COLORS.groom : OVERVIEW_COLORS.bride;
  const userTextColor = isUserBride
    ? "text-rose-600 dark:text-rose-400"
    : "text-[#0284c7] dark:text-[#38bdf8]";
  const partnerTextColor = isUserBride
    ? "text-[#0284c7] dark:text-[#38bdf8]"
    : "text-rose-600 dark:text-rose-400";
  const usedColor = OVERVIEW_COLORS.used;

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
        selectedSliceId={selectedId}
        onSelectSlice={setSelectedId}
      />
      <div className="w-full mt-3 space-y-1 text-[11px]">
        {hasPartner ? (
          <>
            <button
              type="button"
              data-slice-id="user"
              onClick={() => toggleSelect("user")}
              className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
            >
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: userColor }} />
                {partnerNames.user}
              </span>
              <span className={cn("font-mono font-medium", userTextColor)}>
                Rp {userSavings.toLocaleString("id-ID")}
              </span>
            </button>
            <button
              type="button"
              data-slice-id="partner"
              onClick={() => toggleSelect("partner")}
              className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
            >
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: partnerColor }} />
                {partnerNames.partner}
              </span>
              <span className={cn("font-mono font-medium", partnerTextColor)}>
                Rp {partnerSavings.toLocaleString("id-ID")}
              </span>
            </button>
          </>
        ) : (
          <button
            type="button"
            data-slice-id="available"
            onClick={() => toggleSelect("available")}
            className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
          >
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: userColor }} />
              Tabungan Kalian
            </span>
            <span className={cn("font-mono font-medium", userTextColor)}>
              Rp {availableSavings.toLocaleString("id-ID")}
            </span>
          </button>
        )}
        {usedForBudget > 0 && (
          <button
            type="button"
            data-slice-id="used"
            onClick={() => toggleSelect("used")}
            className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors pt-1 border-t border-ux-border/40 focus:outline-none"
          >
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: usedColor }} />
              Terpakai Bayar Anggaran
            </span>
            <span className="font-mono font-medium text-[#059669] dark:text-[#6ee7b7]">
              Rp {usedForBudget.toLocaleString("id-ID")}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
