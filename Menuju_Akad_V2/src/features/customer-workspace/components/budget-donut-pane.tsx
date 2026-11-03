"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";

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
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

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
        selectedSliceId={selectedId}
        onSelectSlice={setSelectedId}
      />
      <div className="w-full mt-3 space-y-1 text-[11px]">
        <button
          type="button"
          data-slice-id="paid"
          onClick={() => toggleSelect("paid")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#064e3b] shrink-0" />
            Sudah Dibayar
          </span>
          <span className="font-mono font-medium text-[#064e3b] dark:text-emerald-300">
            Rp {paidBudget.toLocaleString("id-ID")}
          </span>
        </button>
        <button
          type="button"
          data-slice-id="dueSoon"
          onClick={() => toggleSelect("dueSoon")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] shrink-0" />
            Mendekati Tenggat
          </span>
          <span className="font-mono font-medium text-rose-600 dark:text-rose-400">
            Rp {dueSoonBudget.toLocaleString("id-ID")}
          </span>
        </button>
        <button
          type="button"
          data-slice-id="unpaid"
          onClick={() => toggleSelect("unpaid")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#eab308] shrink-0" />
            Belum Dibayar
          </span>
          <span className="font-mono font-medium text-amber-700 dark:text-amber-400">
            Rp {unpaidRegularBudget.toLocaleString("id-ID")}
          </span>
        </button>
      </div>
    </div>
  );
}
