"use client";

import Link from "next/link";
import { ArrowUpRight, Utensils, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CateringCalculationResult } from "@/features/catering/utils/calculator";

export function CateringStatusScrollCard({
  result,
  manageHref = "/planner/catering",
  className,
}: {
  result: CateringCalculationResult;
  manageHref?: string | undefined;
  className?: string | undefined;
}) {
  const breakdownItems = [
    { label: "Dasar Tamu Undangan", value: `${result.totalBaseGuests} Orang`, desc: "Estimasi kehadiran dasar undangan" },
    { label: "Porsi Cadangan (Safety Buffer)", value: `+${result.bufferPax} Pax`, desc: "Porsi ekstra cadangan tamu tak terduga" },
    { label: "Total Target Tamu + Buffer", value: `${result.totalWithBuffer} Pax`, desc: "Kapasitas acuan perhitungan porsi" },
    { label: "Alokasi Porsi Prasmanan (Buffet)", value: `${result.buffetPax} Pax`, desc: "Menu prasmanan utama" },
    { label: "Alokasi Tamu Gubukan (Stalls)", value: `${result.stallPax} Pax`, desc: "Tamu yang menikmati food stalls" },
    { label: "Total Porsi Gubukan (4 Macam)", value: `${result.stallPortionsTotal} Porsi`, desc: "Total seluruh porsi gubukan" },
    { label: "Akumulasi Keseluruhan Porsi", value: `${result.totalPortions} Porsi`, desc: "Total porsi yang perlu dipesan" },
  ];

  return (
    <div
      className={cn("bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs h-full", className)}
      aria-label="Detail rincian perhitungan katering"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <Utensils size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">Rincian Hitungan Katering</h3>
            <p className="text-xs text-secondary truncate">
              {result.totalPortions} total porsi ({result.totalWithBuffer} tamu acuan)
            </p>
          </div>
        </div>
        <Link
          href={manageHref}
          className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
        >
          Kalkulator <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* Breakdown Items List */}
      <div className="mt-3 flex-1 min-h-[160px] max-h-[340px] sm:max-h-[380px] xl:max-h-[395px] overflow-y-auto space-y-2 pr-1.5 app-scroll">
        {breakdownItems.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg border border-ux-border/70 bg-subtle/30 flex items-center justify-between gap-2 hover:bg-subtle/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{item.label}</p>
              <p className="text-[11px] text-secondary truncate">{item.desc}</p>
            </div>
            <div className="shrink-0 text-right">
              <span className="font-mono text-xs font-bold text-foreground">
                {item.value}
              </span>
            </div>
          </div>
        ))}

        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2 mt-2">
          <CheckCircle2 size={14} className="shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Rasio 60:40 buffet & gubukan menjamin antrean prasmanan lancar dan seluruh tamu terlayani dengan nyaman.
          </p>
        </div>
      </div>
    </div>
  );
}

