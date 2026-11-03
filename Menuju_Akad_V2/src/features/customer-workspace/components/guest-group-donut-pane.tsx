"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";

export type GuestGroupDonutPaneProps = {
  slices: DonutSlice[];
  centerValue?: string | number | undefined;
  centerLabel?: string | undefined;
};

export function GuestGroupDonutPane({
  slices,
  centerValue,
  centerLabel = "Undangan",
}: GuestGroupDonutPaneProps) {
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

  return (
    <div className="flex flex-col items-center justify-between h-full min-h-[240px] sm:min-h-[265px] p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <span className="text-xs font-semibold text-foreground mb-2 self-start">
        Distribusi Kelompok Tamu
      </span>
      <div className="my-auto py-1">
        <ReuiCapitalInflowsDonut
          slices={slices}
          centerValue={centerValue}
          coverageLabel={centerLabel}
          size={130}
          selectedSliceId={selectedId}
          onSelectSlice={setSelectedId}
        />
      </div>
      <div className="w-full mt-2 space-y-1 text-[11px]">
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
              {slice.amount ?? slice.percent} Orang
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
