"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";

export type BudgetPaneProps = {
  paidBudget: number;
  overdueBudget?: number | undefined;
  dueTodayBudget?: number | undefined;
  dueSoonBudget: number;
  unpaidRegularBudget: number;
  slices: DonutSlice[];
  centerValue?: string | number | undefined;
  centerLabel?: string | undefined;
};

export function BudgetDonutPane({
  paidBudget,
  overdueBudget = 0,
  dueTodayBudget = 0,
  dueSoonBudget,
  unpaidRegularBudget,
  slices,
  centerValue,
  centerLabel = "Terbayar",
}: BudgetPaneProps) {
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

  return (
    <div className="flex flex-col h-full min-h-[240px] sm:min-h-[265px] p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <div className="h-5 flex items-center mb-2.5 self-start w-full">
        <span className="text-xs font-semibold text-foreground truncate">
          Status Target Anggaran
        </span>
      </div>
      <div className="w-full flex items-center justify-center shrink-0 py-1">
        <ReuiCapitalInflowsDonut
          slices={slices}
          centerValue={centerValue}
          coverageLabel={centerLabel}
          size={130}
          selectedSliceId={selectedId}
          onSelectSlice={setSelectedId}
        />
      </div>
      <div className="w-full mt-2.5 flex-1 flex flex-col justify-start space-y-1 text-[11px]">
        {/* 1. Sudah Dibayar */}
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

        {/* 2. Lewat Tenggat */}
        <button
          type="button"
          data-slice-id="overdue"
          onClick={() => toggleSelect("overdue")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#dc2626] shrink-0" />
            Lewat Tenggat
          </span>
          <span className="font-mono font-medium text-red-600 dark:text-red-400">
            Rp {overdueBudget.toLocaleString("id-ID")}
          </span>
        </button>

        {/* 3. Tenggat Hari Ini */}
        <button
          type="button"
          data-slice-id="dueToday"
          onClick={() => toggleSelect("dueToday")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ea580c] shrink-0" />
            Tenggat Hari Ini
          </span>
          <span className="font-mono font-medium text-orange-600 dark:text-orange-400">
            Rp {dueTodayBudget.toLocaleString("id-ID")}
          </span>
        </button>

        {/* 4. Mendekati Tenggat */}
        <button
          type="button"
          data-slice-id="dueSoon"
          onClick={() => toggleSelect("dueSoon")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#eab308] shrink-0" />
            Mendekati Tenggat
          </span>
          <span className="font-mono font-medium text-amber-600 dark:text-amber-400">
            Rp {dueSoonBudget.toLocaleString("id-ID")}
          </span>
        </button>

        {/* 5. Belum Dibayar */}
        <button
          type="button"
          data-slice-id="unpaid"
          onClick={() => toggleSelect("unpaid")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#64748b] shrink-0" />
            Belum Dibayar
          </span>
          <span className="font-mono font-medium text-slate-600 dark:text-slate-400">
            Rp {unpaidRegularBudget.toLocaleString("id-ID")}
          </span>
        </button>
      </div>
    </div>
  );
}
