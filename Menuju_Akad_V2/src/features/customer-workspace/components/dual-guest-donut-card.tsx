"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { GuestRsvpDonutPane } from "./guest-rsvp-donut-pane";
import { GuestGroupDonutPane } from "./guest-group-donut-pane";
import { CardInfoPopover } from "./card-info-popover";
import type { GuestCategorization } from "../domain/overview-guest-slices";

export type DualGuestDonutProps = {
  categorization: GuestCategorization;
  rsvpSlices: DonutSlice[];
  rsvpCenterValue?: string | undefined;
  groupSlices: DonutSlice[];
  groupCenterValue?: string | number | undefined;
  badgeText?: string | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
};

export function DualGuestDonutCard({
  categorization: c,
  rsvpSlices,
  rsvpCenterValue,
  groupSlices,
  groupCenterValue,
  badgeText,
  manageHref = "/planner/guests",
  className,
}: DualGuestDonutProps) {
  return (
    <div
      className={cn(
        "bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs",
        className,
      )}
      aria-label="Kesiapan tamu dan konfirmasi kehadiran RSVP"
    >
      <div>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <h3 className="text-sm font-semibold text-foreground">
                Kesiapan Tamu & RSVP
              </h3>
              <CardInfoPopover
                title="Kesiapan Tamu & RSVP"
                description="Tersinkronisasi otomatis dengan menu Daftar Tamu & RSVP. Memantau progres konfirmasi kehadiran tamu (pax) dan sebaran kelompok undangan secara real-time."
              />
            </div>
          </div>
          {manageHref && (
            <Link
              href={manageHref}
              className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
            >
              Kelola Tamu <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        {/* Dual Donut Columns (Headline + Donut) */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 md:grid-rows-[auto_1fr] gap-5 md:gap-6 items-stretch">
          {/* Kolom 1: Estimasi Kehadiran */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div>
              <span className="text-[11px] text-secondary font-medium">
                Estimasi Tamu Hadir
              </span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-emerald-700 dark:text-emerald-400">
                  {c.attendingPax}
                  <span className="text-sm font-normal text-secondary ml-1">
                    / {c.totalQuota} Pax
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
            <GuestRsvpDonutPane
              categorization={c}
              slices={rsvpSlices}
              centerValue={rsvpCenterValue}
            />
          </div>

          {/* Kolom 2: Total Undangan */}
          <div className="flex flex-col gap-2.5 md:grid md:grid-rows-subgrid md:row-span-2">
            <div>
              <span className="text-[11px] text-secondary font-medium">Total Undangan Terdaftar</span>
              <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {c.totalInvitations}
                  <span className="text-sm font-normal text-secondary ml-1">
                    Undangan
                  </span>
                </span>
                {c.vipInvitations > 0 && (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    {c.vipInvitations} VIP
                  </span>
                )}
              </div>
            </div>
            <GuestGroupDonutPane
              slices={groupSlices}
              centerValue={groupCenterValue}
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

