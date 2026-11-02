"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ReuiCapitalInflowsDonut } from "./reui-capital-inflows-donut";
import { ReuiCapitalInflowsItem } from "./reui-capital-inflows-item";
import type { ReuiCapitalInflowsProps } from "./reui-capital-inflows-types";

export function ReuiCapitalInflowsCard({
  title = "Alokasi Anggaran",
  subtitle = "Distribusi pos dana & anggaran",
  totalAmount,
  savingsAmount = 0,
  periodOptions = ["Bulan", "Tahun", "Total"],
  activePeriod: initialPeriod = "Total",
  sources,
  donutSlices,
  topCoveragePercent,
  coverageLabel = "3 Pos Utama",
  restPercentage = 0,
  footerNote = "Sinkronisasi otomatis · Anggaran bersama",
  currencyUnit = "Rupiah (IDR)",
  manageHref = "/planner/finance",
  badgeText,
  badgeSubtext,
  className,
}: ReuiCapitalInflowsProps) {
  const [activePeriod, setActivePeriod] = useState(initialPeriod);

  const topPercent =
    topCoveragePercent ??
    (sources.length > 0 ? sources.slice(0, 3).reduce((sum, s) => sum + s.percentage, 0) : 0);

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
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5 shrink-0">
              {title}
              <Info size={13} className="text-muted-foreground/70" />
            </h3>
            <span className="text-xs text-secondary truncate hidden sm:inline">· {subtitle}</span>
          </div>

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

        {/* Metrics Headline: Anggaran & Tabungan Tersedia */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pb-2">
          <div>
            <span className="text-[11px] text-secondary font-medium">Total Target Anggaran</span>
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
              Rp {totalAmount.toLocaleString("id-ID")}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-secondary font-medium">Tabungan Tersedia</span>
            <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                Rp {savingsAmount.toLocaleString("id-ID")}
              </span>
              {badgeText && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <ArrowUpRight size={11} />
                  {badgeText}
                </span>
              )}
            </div>
            {badgeSubtext && (
              <span className="text-[10px] text-secondary block mt-0.5">{badgeSubtext}</span>
            )}
          </div>
        </div>

        {/* Donut Chart + Rows Breakdown */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Donut with slices */}
          <div className="md:col-span-5 flex flex-col items-center justify-center py-1">
            <ReuiCapitalInflowsDonut
              sources={sources}
              slices={donutSlices}
              coveragePercent={topPercent}
              coverageLabel={coverageLabel}
              restPercent={restPercentage}
              size={164}
            />
            {donutSlices && donutSlices.length > 0 && (
              <div className="flex flex-wrap justify-center gap-x-2.5 gap-y-1 mt-3 text-[10px] text-secondary">
                {donutSlices.map((sl) => (
                  <div key={sl.id} className="flex items-center gap-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: sl.isHatched ? "#a7f3d0" : sl.color }}
                    />
                    <span>{sl.label ?? sl.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Sources Breakdown rows or Empty State */}
          <div className="md:col-span-7 space-y-2">
            {hasData ? (
              sources.map((src) => <ReuiCapitalInflowsItem key={src.id} src={src} />)
            ) : (
              <div className="p-3.5 rounded-xl bg-subtle/50 border border-ux-border text-xs space-y-1.5">
                <p className="font-semibold text-foreground">
                  {savingsAmount > 0
                    ? "Tabungan tersedia, belum ada pos anggaran"
                    : "Belum ada pos anggaran tercatat"}
                </p>
                <p className="text-secondary text-[11px] leading-relaxed">
                  {savingsAmount > 0
                    ? `Kalian memiliki saldo tabungan Rp ${savingsAmount.toLocaleString("id-ID")}. Alokasikan dana ini ke pos pengeluaran pernikahan.`
                    : "Tambahkan pos pengeluaran di menu Tabungan & Anggaran untuk memantau alokasi biaya pernikahan kalian."}
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
      <div className="mt-4 pt-3 border-t border-ux-border/60 flex items-center justify-between text-[11px] text-secondary">
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
