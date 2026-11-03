"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";

export type KuaPartyDonutPaneProps = {
  title: string;
  completedCount: number;
  totalCount: number;
  slices: DonutSlice[];
  centerValue?: string | undefined;
  centerLabel?: string | undefined;
  color?: string | undefined;
};

export function KuaPartyDonutPane({
  title,
  completedCount,
  totalCount,
  slices,
  centerValue,
  centerLabel = "Lengkap",
  color = "#0284c7",
}: KuaPartyDonutPaneProps) {
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

  return (
    <div className="flex flex-col items-center justify-between h-full min-h-[240px] sm:min-h-[265px] p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <span className="text-xs font-semibold text-foreground mb-2 self-start truncate w-full">
        {title}
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
        {/* Berkas Siap */}
        <button
          type="button"
          data-slice-id="completed"
          onClick={() => toggleSelect("completed")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            Berkas Lengkap
          </span>
          <span className="font-mono font-semibold shrink-0" style={{ color }}>
            {completedCount} Berkas
          </span>
        </button>

        {/* Belum Lengkap */}
        <button
          type="button"
          data-slice-id="pending"
          onClick={() => toggleSelect("pending")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full shrink-0 bg-slate-300" />
            Belum Lengkap
          </span>
          <span className="font-mono text-secondary shrink-0">
            {Math.max(0, totalCount - completedCount)} Berkas
          </span>
        </button>
      </div>
    </div>
  );
}

