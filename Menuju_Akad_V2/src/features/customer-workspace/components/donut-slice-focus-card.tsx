"use client";

import { X, HelpCircle } from "lucide-react";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";

type Props = {
  slice: DonutSlice;
  onClose: () => void;
};

export function DonutSliceFocusCard({ slice, onClose }: Props) {
  return (
    <div
      className="w-full mt-3 p-3 rounded-lg border border-ux-border bg-subtle/40 transition-all text-xs animate-in fade-in zoom-in-95 duration-200"
      role="region"
      aria-label={`Rincian kebutuhan ${slice.label ?? "bagian ini"}`}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-ux-border/40">
        <div className="flex items-center gap-1.5 font-semibold text-foreground truncate min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: slice.color }}
          />
          <span className="truncate">{slice.label}</span>
          <span className="font-mono text-[11px] text-secondary font-medium">
            ({slice.percent}%)
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 shrink-0 px-1 py-0.5 rounded hover:bg-canvas transition-colors"
          title="Tutup fokus"
        >
          <span>Tutup</span>
          <X size={12} />
        </button>
      </div>

      <div className="mt-2 space-y-1">
        {slice.amount !== undefined && (
          <div className="flex items-baseline justify-between text-[11px]">
            <span className="text-secondary font-medium">Nominal:</span>
            <span className="font-mono font-semibold text-foreground">
              Rp {slice.amount.toLocaleString("id-ID")}
            </span>
          </div>
        )}
        <div className="flex items-start gap-1.5 text-secondary text-[11px] leading-relaxed pt-0.5">
          <HelpCircle size={13} className="shrink-0 text-brand-secondary mt-0.5" />
          <span>
            <strong className="text-foreground font-medium">Fungsi Kebutuhan:</strong>{" "}
            {slice.purpose ?? "Alokasi pos perencanaan acara pernikahan."}
          </span>
        </div>
      </div>
    </div>
  );
}

