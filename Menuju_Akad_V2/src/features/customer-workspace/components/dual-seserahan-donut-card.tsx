"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ReuiCapitalInflowsDonut } from "@/components/ui/reui-capital-inflows-donut";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { useDonutFocus } from "../hooks/use-donut-focus";
import { CardInfoPopover } from "./card-info-popover";
import type { SeserahanCategorization } from "../domain/overview-seserahan-slices";

export type DualSeserahanDonutProps = {
  categorization: SeserahanCategorization;
  statusSlices: DonutSlice[];
  statusCenterValue?: string | undefined;
  categorySlices: DonutSlice[];
  categoryCenterValue?: string | number | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
};

export function DualSeserahanDonutCard({
  categorization: c,
  statusSlices,
  statusCenterValue,
  categorySlices,
  categoryCenterValue,
  manageHref = "/planner/seserahan",
  className,
}: DualSeserahanDonutProps) {
  const { selectedId, setSelectedId, toggleSelect } = useDonutFocus();

  return (
    <div
      className={cn(
        "bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs",
        className,
      )}
      aria-label="Kesiapan dan rincian kotak seserahan"
    >
      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">
                Kesiapan Kotak Seserahan
              </h3>
              <CardInfoPopover
                title="Kesiapan Seserahan"
                description="Tersinkronisasi otomatis dengan menu Seserahan. Memantau kelengkapan barang seserahan, status pembelian, dan perbandingan biaya estimasi vs realisasi."
              />
            </div>
          </div>
          {manageHref && (
            <Link
              href={manageHref}
              className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
            >
              Kelola Seserahan <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        {/* Dual Donut Columns */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] gap-5 md:gap-6 items-stretch">
          {/* Kolom 1: Status Pembelian */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div className="min-h-[48px] flex flex-col justify-end">
              <span className="text-[11px] text-secondary font-medium">Kotak Siap & Terbeli</span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {c.boughtCount}
                  <span className="text-sm font-normal text-secondary ml-1">
                    / {c.totalItems} Kotak
                  </span>
                </span>
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  {c.readyRate}% Selesai
                </span>
              </div>
            </div>
            <div className="flex flex-col h-full min-h-[240px] sm:min-h-[265px] p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
              <div className="h-5 flex items-center mb-2.5 self-start w-full">
                <span className="text-xs font-semibold text-foreground truncate">
                  Status Pembelian Kotak
                </span>
              </div>
              <div className="w-full flex items-center justify-center shrink-0 py-1">
                <ReuiCapitalInflowsDonut
                  slices={statusSlices}
                  centerValue={statusCenterValue}
                  coverageLabel="Kotak Siap"
                  size={130}
                  selectedSliceId={selectedId}
                  onSelectSlice={setSelectedId}
                />
              </div>
              <div className="w-full mt-2.5 flex-1 flex flex-col justify-start space-y-1 text-[11px]">
                {statusSlices.length > 0 ? (
                  statusSlices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      data-slice-id={s.id}
                      onClick={() => toggleSelect(s.id)}
                      className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                      <span className="font-mono font-medium text-foreground shrink-0">
                        {s.amount} Kotak ({s.percent}%)
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-2 text-center text-secondary text-[11px]">
                    Belum ada kotak seserahan
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kolom 2: Kategori Seserahan */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div className="min-h-[48px] flex flex-col justify-end">
              <span className="text-[11px] text-secondary font-medium">Realisasi Biaya Seserahan</span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Rp {c.totalActual.toLocaleString("id-ID")}
                </span>
                <span className="text-xs text-secondary">
                  (Est: Rp {c.totalEstimated.toLocaleString("id-ID")})
                </span>
              </div>
            </div>
            <div className="flex flex-col h-full min-h-[240px] sm:min-h-[265px] p-2.5 sm:p-3 rounded-lg bg-subtle/30 border border-ux-border/60">
              <div className="h-5 flex items-center mb-2.5 self-start w-full">
                <span className="text-xs font-semibold text-foreground truncate">
                  Sebaran Kategori Barang
                </span>
              </div>
              <div className="w-full flex items-center justify-center shrink-0 py-1">
                <ReuiCapitalInflowsDonut
                  slices={categorySlices}
                  centerValue={categoryCenterValue}
                  coverageLabel="Total Kotak"
                  size={130}
                  selectedSliceId={selectedId}
                  onSelectSlice={setSelectedId}
                />
              </div>
              <div className="w-full mt-2.5 flex-1 flex flex-col justify-start space-y-1 text-[11px]">
                {categorySlices.length > 0 ? (
                  categorySlices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      data-slice-id={s.id}
                      onClick={() => toggleSelect(s.id)}
                      className="w-full flex items-center justify-between text-secondary p-1 rounded hover:bg-subtle/50 transition-colors focus:outline-none"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        {s.label}
                      </span>
                      <span className="font-mono font-medium text-foreground shrink-0">
                        {s.amount} Kotak
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-2 text-center text-secondary text-[11px]">
                    Belum ada kategori barang
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-ux-border/60 flex items-center justify-between text-[11px] text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Klik irisan diagram untuk fokus</span>
        </div>
      </div>
    </div>
  );
}

