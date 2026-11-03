"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";
import type { TaskCategorization } from "../domain/overview-task-slices";

export type TaskStatusDonutPaneProps = {
  categorization: TaskCategorization;
  slices: DonutSlice[];
  centerValue?: string | undefined;
  centerLabel?: string | undefined;
};

export function TaskStatusDonutPane({
  categorization: c,
  slices,
  centerValue,
  centerLabel = "Tugas Selesai",
}: TaskStatusDonutPaneProps) {
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

  return (
    <div className="flex flex-col h-full min-h-[240px] sm:min-h-[265px] p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <div className="h-5 flex items-center mb-2.5 self-start w-full">
        <span className="text-xs font-semibold text-foreground truncate">
          Status Progres Tugas
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
        {/* Selesai */}
        <button
          type="button"
          data-slice-id="completed"
          onClick={() => toggleSelect("completed")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-600" />
            Sudah Selesai
          </span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
            {c.completedCount} Tugas
          </span>
        </button>

        {/* Dikerjakan */}
        <button
          type="button"
          data-slice-id="in-progress"
          onClick={() => toggleSelect("in-progress")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full shrink-0 bg-sky-600" />
            Sedang Berjalan
          </span>
          <span className="font-mono text-sky-600 dark:text-sky-400 shrink-0">
            {c.inProgressCount} Tugas
          </span>
        </button>

        {/* Menunggu */}
        <button
          type="button"
          data-slice-id="pending"
          onClick={() => toggleSelect("pending")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full shrink-0 bg-slate-400" />
            Belum Dimulai
          </span>
          <span className="font-mono text-secondary shrink-0">
            {c.pendingCount} Tugas
          </span>
        </button>
      </div>
    </div>
  );
}

