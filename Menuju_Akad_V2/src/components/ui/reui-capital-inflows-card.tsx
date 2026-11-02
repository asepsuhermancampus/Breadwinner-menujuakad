"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ReuiCapitalInflowsDonut } from "./reui-capital-inflows-donut";
import type { ReuiCapitalInflowsProps } from "./reui-capital-inflows-types";

export function ReuiCapitalInflowsCard({
  title = "Alokasi Anggaran",
  subtitle = "Distribusi pos dana & anggaran",
  totalAmount,
  periodOptions = ["Bulan", "Tahun", "Total"],
  activePeriod: initialPeriod = "Total",
  sources,
  topCoveragePercent,
  coverageLabel = "3 Pos Utama",
  restPercentage = 15,
  footerNote = "Sinkronisasi otomatis · Anggaran bersama",
  currencyUnit = "Rupiah (IDR)",
  manageHref = "/planner/finance",
  badgeText,
  badgeSubtext,
  className,
}: ReuiCapitalInflowsProps) {
  const [activePeriod, setActivePeriod] = useState(initialPeriod);

  // Compute coverage if not provided
  const topPercent =
    topCoveragePercent ??
    (sources.length > 0
      ? sources.slice(0, 3).reduce((sum, s) => sum + s.percentage, 0)
      : 0);

  const hasData = sources.length > 0 && totalAmount > 0;

  return (
    <div
      className={cn(
        "bg-canvas border border-ux-border p-5 flex flex-col justify-between rounded-none shadow-sm",
        className,
      )}
      aria-label="Kartu alokasi anggaran dan modal acara"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 shrink-0">
              {title}
              <Info size={13} className="text-muted-foreground/70" />
            </h3>
            <span className="text-xs text-secondary truncate hidden sm:inline">
              · {subtitle}
            </span>
          </div>

          {/* Period Toggle */}
          <div className="flex items-center rounded-lg border border-ux-border p-0.5 bg-subtle/50 text-xs shrink-0">
            {periodOptions.map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setActivePeriod(period)}
                className={cn(
                  "px-2.5 py-0.5 rounded-md text-xs font-medium transition-all",
                  activePeriod === period
                    ? "bg-canvas text-foreground shadow-xs"
                    : "text-secondary hover:text-foreground",
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Headline */}
        <div className="mt-4">
          <span className="text-xs text-secondary block font-medium">Total Anggaran Pos</span>
          <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Rp {totalAmount.toLocaleString("id-ID")}
            </span>
            {badgeText ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <ArrowUpRight size={12} />
                {badgeText}
              </span>
            ) : hasData ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <ArrowUpRight size={12} />
                Terkelola
              </span>
            ) : null}
            <span className="text-xs text-secondary hidden md:inline">
              {badgeSubtext ?? (hasData ? "tersinkronisasi dengan Tabungan & Anggaran" : "selaras dengan Tabungan & Anggaran")}
            </span>
          </div>
        </div>

        {/* Donut Chart + Rows Breakdown */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Donut with center label */}
          <div className="md:col-span-5 flex justify-center py-2">
            <ReuiCapitalInflowsDonut
              sources={sources}
              coveragePercent={topPercent}
              coverageLabel={hasData ? coverageLabel : "0 Pos"}
              restPercent={hasData ? restPercentage : 0}
              size={168}
            />
          </div>

          {/* Right: Sources Breakdown rows or Empty State */}
          <div className="md:col-span-7 space-y-2">
            {hasData ? (
              sources.map((src) => (
                <div
                  key={src.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-ux-border/40 last:border-0 gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: src.color }}
                    />
                    <span className="font-medium text-foreground truncate" title={src.name}>
                      {src.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 font-mono">
                    <span className="text-foreground font-semibold">
                      Rp {src.amount.toLocaleString("id-ID")}
                    </span>
                    <span className="text-secondary w-7 text-right">{src.percentage}%</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-medium inline-flex items-center gap-0.5",
                        src.isIncrease ?? true
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
                      )}
                    >
                      {src.isIncrease ?? true ? (
                        <ArrowUpRight size={10} />
                      ) : (
                        <ArrowDownRight size={10} />
                      )}
                      {src.change ?? "Tercatat"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col justify-center items-start p-3.5 rounded-xl bg-subtle/50 border border-ux-border text-xs space-y-2">
                <p className="font-semibold text-foreground">Belum ada pos anggaran tercatat</p>
                <p className="text-secondary text-[11px] leading-relaxed">
                  Tambahkan pos pengeluaran di menu Tabungan & Anggaran untuk memantau alokasi biaya pernikahan kalian.
                </p>
                {manageHref && (
                  <Link
                    href={manageHref}
                    className="inline-flex items-center gap-1 font-semibold text-brand-secondary hover:underline text-xs pt-1"
                  >
                    + Catat pos anggaran pertama →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-ux-border/60 flex items-center justify-between text-[11px] text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{footerNote}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-muted-foreground">
          <span>{currencyUnit}</span>
          {manageHref && (
            <Link href={manageHref} className="text-brand-secondary hover:underline ml-1">
              Buka Tabungan & Anggaran →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
