"use client";

import { useState } from "react";
import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { DonutSliceFocusCard } from "./donut-slice-focus-card";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const toggleSelect = (id: string) =>
    setSelectedId((prev) => (prev === id ? null : id));

  const fallbackSlice: DonutSlice | undefined = selectedId
    ? {
        id: selectedId,
        label:
          selectedId === "paid"
            ? "Sudah Dibayar"
            : selectedId === "dueSoon"
              ? "Mendekati Tenggat"
              : "Belum Dibayar",
        percent: 0,
        color:
          selectedId === "paid"
            ? "#064e3b"
            : selectedId === "dueSoon"
              ? "#ef4444"
              : "#eab308",
        amount:
          selectedId === "paid"
            ? paidBudget
            : selectedId === "dueSoon"
              ? dueSoonBudget
              : unpaidRegularBudget,
        purpose:
          selectedId === "paid"
            ? "Pos kebutuhan anggaran pernikahan yang pembayarannya telah beres atau lunas seluruhnya."
            : selectedId === "dueSoon"
              ? "Pos kebutuhan prioritas yang perlu segera dibayarkan karena mendekati batas tanggal pembayaran (≤ 14 hari)."
              : "Pos kebutuhan anggaran terencana yang masih menunggu pembayaran sesuai jadwal reguler.",
      }
    : undefined;

  const focusedSlice = slices.find((s) => s.id === selectedId) ?? fallbackSlice;

  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <div className="w-full flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-foreground">
          Status Target Anggaran
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
        <button
          type="button"
          onClick={() => toggleSelect("paid")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors"
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
          onClick={() => toggleSelect("dueSoon")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors"
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
          onClick={() => toggleSelect("unpaid")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors"
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

      {focusedSlice && (
        <DonutSliceFocusCard slice={focusedSlice} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}
