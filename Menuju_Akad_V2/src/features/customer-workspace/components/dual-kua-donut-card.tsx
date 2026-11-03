"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { KuaPartyDonutPane } from "./kua-party-donut-pane";
import { CardInfoPopover } from "./card-info-popover";
import type { KuaCategorization } from "../domain/overview-kua-slices";

export type DualKuaDonutProps = {
  categorization: KuaCategorization;
  mainSlices: DonutSlice[];
  mainCenterValue?: string | undefined;
  additionalSlices: DonutSlice[];
  additionalCenterValue?: string | undefined;
  badgeText?: string | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
};

export function DualKuaDonutCard({
  categorization: c,
  mainSlices,
  mainCenterValue,
  additionalSlices,
  additionalCenterValue,
  badgeText,
  manageHref = "/planner/kua",
  className,
}: DualKuaDonutProps) {
  return (
    <div
      className={cn(
        "bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs",
        className,
      )}
      aria-label="Kesiapan persyaratan dan dokumen KUA kedua pihak"
    >
      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">
                Kesiapan Dokumen KUA
              </h3>
              <CardInfoPopover
                title="Kesiapan Dokumen KUA"
                description="Tersinkronisasi otomatis dengan menu Persyaratan KUA. Memantau kelengkapan berkas administrasi nikah utama dan bersyarat agar siap sebelum batas pendaftaran KUA."
              />
            </div>
          </div>
          {manageHref && (
            <Link
              href={manageHref}
              className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
            >
              Kelola Berkas <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        {/* Dual Donut Columns (Headline + Donut) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] gap-5 md:gap-6 items-stretch">
          {/* Kolom 1: Berkas Utama */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div className="min-h-[54px] flex flex-col justify-end">
              <span className="text-[11px] text-secondary font-medium">
                Berkas Wajib Utama
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-sky-700 dark:text-sky-400">
                  {c.mainCompleted}
                  <span className="text-sm font-normal text-secondary ml-1">
                    / {c.mainTotal} Siap
                  </span>
                </span>
                {badgeText && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <ArrowUpRight size={11} />
                    {badgeText}
                  </span>
                )}
              </div>
            </div>
            <KuaPartyDonutPane
              title="Berkas Wajib Utama"
              completedCount={c.mainCompleted}
              totalCount={c.mainTotal}
              slices={mainSlices}
              centerValue={mainCenterValue}
              color="#0284c7"
            />
          </div>

          {/* Kolom 2: Berkas Bersyarat / Khusus */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div className="min-h-[54px] flex flex-col justify-end">
              <span className="text-[11px] text-secondary font-medium">
                Berkas Bersyarat / Khusus
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-purple-700 dark:text-purple-400">
                  {c.additionalCompleted}
                  <span className="text-sm font-normal text-secondary ml-1">
                    / {c.additionalTotal} Siap
                  </span>
                </span>
              </div>
            </div>
            <KuaPartyDonutPane
              title="Berkas Bersyarat / Khusus"
              completedCount={c.additionalCompleted}
              totalCount={c.additionalTotal}
              slices={additionalSlices}
              centerValue={additionalCenterValue}
              color="#8b5cf6"
            />
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
