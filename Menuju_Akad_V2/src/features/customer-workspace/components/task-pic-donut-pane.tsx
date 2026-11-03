"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";

export type TaskPicDonutPaneProps = {
  slices: DonutSlice[];
  centerValue?: string | number | undefined;
  centerLabel?: string | undefined;
};

export function TaskPicDonutPane({
  slices,
  centerValue,
  centerLabel = "Total Tugas",
}: TaskPicDonutPaneProps) {
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

  return (
    <div className="flex flex-col items-center h-full p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <span className="text-xs font-semibold text-foreground mb-3 self-start">
        Pembagian Tugas (PIC)
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
        {slices.map((slice) => (
          <button
            key={slice.id}
            type="button"
            data-slice-id={slice.id}
            onClick={() => toggleSelect(slice.id)}
            className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
          >
            <span className="flex items-center gap-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: slice.color }}
              />
              <span className="truncate">{slice.label}</span>
            </span>
            <span className="font-mono text-foreground font-medium shrink-0">
              {slice.amount ?? slice.percent} Tugas
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
