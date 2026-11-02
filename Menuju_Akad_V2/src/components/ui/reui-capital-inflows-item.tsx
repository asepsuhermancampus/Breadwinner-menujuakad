"use client";

import { cn } from "@/lib/cn";
import type { InflowSource } from "./reui-capital-inflows-types";

type ItemProps = {
  src: InflowSource;
};

export function ReuiCapitalInflowsItem({ src }: ItemProps) {
  return (
    <div className="flex items-center justify-between text-xs py-1.5 border-b border-ux-border/40 last:border-0 gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: src.color }}
        />
        <span className="font-medium text-foreground truncate" title={src.name}>
          {src.name}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0 font-mono">
        <span className="text-foreground font-semibold">
          Rp {src.amount.toLocaleString("id-ID")}
        </span>
        <span className="text-secondary w-7 text-right">{src.percentage}%</span>
        {src.isPaid !== undefined ? (
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[10px] font-semibold",
              src.isPaid
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
            )}
          >
            {src.isPaid ? "✓ Lunas" : "⏳ Belum Bayar"}
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
            {src.change ?? "Tercatat"}
          </span>
        )}
      </div>
    </div>
  );
}
