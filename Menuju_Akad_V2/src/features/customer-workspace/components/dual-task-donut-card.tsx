"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { TaskStatusDonutPane } from "./task-status-donut-pane";
import { TaskPicDonutPane } from "./task-pic-donut-pane";
import { CardInfoPopover } from "./card-info-popover";
import type { TaskCategorization } from "../domain/overview-task-slices";

export type DualTaskDonutProps = {
  categorization: TaskCategorization;
  statusSlices: DonutSlice[];
  statusCenterValue?: string | undefined;
  picSlices: DonutSlice[];
  picCenterValue?: string | number | undefined;
  badgeText?: string | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
};

export function DualTaskDonutCard({
  categorization: c,
  statusSlices,
  statusCenterValue,
  picSlices,
  picCenterValue,
  badgeText,
  manageHref = "/planner/tasks",
  className,
}: DualTaskDonutProps) {
  return (
    <div
      className={cn(
        "bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs",
        className,
      )}
      aria-label="Kesiapan checklist dan pembagian tugas PIC"
    >
      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">
                Kesiapan Checklist & Tugas
              </h3>
              <CardInfoPopover
                title="Kesiapan Checklist & Tugas"
                description="Tersinkronisasi otomatis dengan menu Checklist & Tugas. Memantau progres penyelesaian tugas pernikahan dan pembagian peran kedua mempelai secara adil."
              />
            </div>
          </div>
          {manageHref && (
            <Link
              href={manageHref}
              className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
            >
              Kelola Tugas <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        {/* Dual Donut Columns (Headline + Donut) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] gap-5 md:gap-6 items-stretch">
          {/* Kolom 1: Status Progres */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div>
              <span className="text-[11px] text-secondary font-medium">
                Tugas Beres
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {c.completedCount}
                  <span className="text-sm font-normal text-secondary ml-1">
                    / {c.totalTasks} Selesai
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
            <TaskStatusDonutPane
              categorization={c}
              slices={statusSlices}
              centerValue={statusCenterValue}
            />
          </div>

          {/* Kolom 2: Pembagian Tugas PIC */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div>
              <span className="text-[11px] text-secondary font-medium">Beban Tugas Bersama</span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {c.totalTasks}
                  <span className="text-sm font-normal text-secondary ml-1">
                    Tugas Tercatat
                  </span>
                </span>
                {c.urgentCount > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-700 dark:text-rose-400">
                    {c.urgentCount} Mendesak
                  </span>
                )}
              </div>
            </div>
            <TaskPicDonutPane
              slices={picSlices}
              centerValue={picCenterValue}
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
