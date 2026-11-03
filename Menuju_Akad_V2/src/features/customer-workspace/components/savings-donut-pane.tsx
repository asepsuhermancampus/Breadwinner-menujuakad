"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { DonutSliceFocusCard } from "./donut-slice-focus-card";
import { OVERVIEW_COLORS } from "../domain/overview-donut-slices";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const toggleSelect = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));

  const fallbackSlice: DonutSlice | undefined = selectedId
    ? {
        id: selectedId,
        label:
          selectedId === "user"
            ? partnerNames.user
            : selectedId === "partner"
              ? partnerNames.partner
              : selectedId === "used"
                ? "Terpakai Bayar Anggaran"
                : "Tabungan Kalian",
        percent: 0,
        color:
          selectedId === "user"
            ? userColor
            : selectedId === "partner"
              ? partnerColor
              : selectedId === "used"
                ? usedColor
                : userColor,
        amount:
          selectedId === "user"
            ? userSavings
            : selectedId === "partner"
              ? partnerSavings
              : selectedId === "used"
                ? usedForBudget
                : availableSavings,
        purpose:
          selectedId === "used"
            ? "Alokasi tabungan yang telah terealisasi untuk membayar dan melunasi pos anggaran kebutuhan acara."
            : selectedId === "user"
              ? `Alokasi simpanan dari pihak ${isUserBride ? "wanita" : "pria"} (${partnerNames.user}) untuk mendanai pembiayaan acara pernikahan.`
              : selectedId === "partner"
                ? `Alokasi simpanan dari pihak ${isUserBride ? "pria" : "wanita"} (${partnerNames.partner}) untuk mendanai pembiayaan acara pernikahan.`
                : "Total tabungan aktif yang siap digunakan untuk membayar kewajiban anggaran acara.",
      }
    : undefined;

  const focusedSlice = slices.find((s) => s.id === selectedId) ?? fallbackSlice;

  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <div className="w-full flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-foreground">
          Tabungan Tersedia {hasPartner ? "(Bersama)" : "(Pribadi)"}
        </span>
        <span className="text-[10px] text-muted-foreground">Klik diagram utk fokus</span>
      </div>
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
              onClick={() => toggleSelect("user")}
              className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors"
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
              onClick={() => toggleSelect("partner")}
              className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors"
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
            onClick={() => toggleSelect("available")}
            className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors"
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
            onClick={() => toggleSelect("used")}
            className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors pt-1 border-t border-ux-border/40"
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

      {focusedSlice && (
        <DonutSliceFocusCard slice={focusedSlice} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
