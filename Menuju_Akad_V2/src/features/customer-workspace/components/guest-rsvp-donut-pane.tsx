"use client";

import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";
import type { GuestCategorization } from "../domain/overview-guest-slices";

export type GuestRsvpDonutPaneProps = {
  categorization: GuestCategorization;
  slices: DonutSlice[];
  centerValue?: string | undefined;
  centerLabel?: string | undefined;
};

export function GuestRsvpDonutPane({
  categorization: c,
  slices,
  centerValue,
  centerLabel = "Pasti Hadir",
}: GuestRsvpDonutPaneProps) {
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

  return (
    <div className="flex flex-col h-full min-h-[240px] sm:min-h-[265px] p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
      <div className="h-5 flex items-center mb-2.5 self-start w-full">
        <span className="text-xs font-semibold text-foreground truncate">
          Status Konfirmasi RSVP
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
        {/* Hadir */}
        <button
          type="button"
          data-slice-id="attending"
          onClick={() => toggleSelect("attending")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full shrink-0 bg-emerald-600" />
            Konfirmasi Hadir
          </span>
          <span className="font-mono text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
            {c.attendingPax} Orang
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
            <span className="w-2 h-2 rounded-full shrink-0 bg-amber-500" />
            Menunggu Jawaban
          </span>
          <span className="font-mono text-amber-600 dark:text-amber-400 shrink-0">
            {c.pendingPax} Orang
          </span>
        </button>

        {/* Berhalangan */}
        <button
          type="button"
          data-slice-id="declined"
          onClick={() => toggleSelect("declined")}
          className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full shrink-0 bg-red-500" />
            Berhalangan Hadir
          </span>
          <span className="font-mono text-red-600 dark:text-red-400 shrink-0">
            {c.declinedPax} Orang
          </span>
        </button>
      </div>
    </div>
  );
}

