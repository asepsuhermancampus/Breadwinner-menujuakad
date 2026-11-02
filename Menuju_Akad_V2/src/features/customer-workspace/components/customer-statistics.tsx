"use client";

import Link from "next/link";
import { CheckCircle2, Users, ArrowUpRight } from "lucide-react";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import type { OverviewResources } from "../hooks/use-overview-resources";
import { GiftedLineChart, type GiftedLinePoint } from "@/components/ui/gifted-line-chart";
import { GiftedDonutChart } from "@/components/ui/gifted-donut-chart";
import { CustomerStatisticsBudget } from "./customer-statistics-budget";

type StatisticsProps = {
  tasks: PlannerTask[];
  resources: OverviewResources;
  tasksAvailable?: boolean;
  financeAvailable?: boolean;
  guestsAvailable?: boolean;
};

export function CustomerStatistics({
  tasks,
  resources,
  tasksAvailable = true,
  financeAvailable = true,
  guestsAvailable = true,
}: StatisticsProps) {
  const financeData = (resources.finance.data ?? []) as CustomerBudget[];
  const guestData = (resources.guests.data ?? []) as GuestInvitation[];

  // 1. Task Metrics for GiftedLineChart
  const completedTasks = tasks.filter((t) => t.status === "Selesai").length;
  const inProgressTasks = tasks.filter((t) => t.status === "Dikerjakan").length;
  const pendingTasks = tasks.filter((t) => t.status === "Menunggu" || !t.status).length;

  const taskLineData: GiftedLinePoint[] = [
    { label: "Menunggu", value: pendingTasks },
    { label: "Dikerjakan", value: inProgressTasks },
    { label: "Selesai", value: completedTasks },
  ];

  // 2. Guest Metrics for GiftedDonutChart
  const totalGuests = guestData.length;
  const attendingGuests = guestData.filter((g) => g.rsvpStatus === "ATTENDING").length;
  const pendingGuests = guestData.filter((g) => g.rsvpStatus === "PENDING" || !g.rsvpStatus).length;
  const declinedGuests = guestData.filter((g) => g.rsvpStatus === "DECLINED").length;

  const attendingPercent = totalGuests > 0 ? Math.round((attendingGuests / totalGuests) * 100) : null;

  return (
    <section className="mt-6 space-y-4" aria-label="Statistik perencanaan">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground tracking-tight">
            Statistik & Analisis Kesiapan
          </h2>
          <p className="text-xs text-secondary">
            Pantau sebaran checklist, realisasi anggaran, dan konfirmasi kehadiran tamu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Panel 1: Bar Chart Status Tugas */}
        <div className="bg-canvas border border-ux-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-ux-border/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Sebaran Checklist</h3>
                  <p className="text-xs text-secondary">{tasks.length} total tugas terdaftar</p>
                </div>
              </div>
              {tasksAvailable && (
                <Link
                  href="/planner/tasks"
                  className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5"
                >
                  Buka <ArrowUpRight size={13} />
                </Link>
              )}
            </div>
            <GiftedLineChart data={taskLineData} height={140} lineColor="#10b981" />
          </div>
        </div>

        {/* Panel 2: Alokasi Anggaran */}
        <CustomerStatisticsBudget
          financeData={financeData}
          financeAvailable={financeAvailable}
        />

        {/* Panel 3: Donut Chart Konfirmasi Tamu */}
        <div className="bg-canvas border border-ux-border p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-ux-border/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
                  <Users size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Konfirmasi Tamu (RSVP)</h3>
                  <p className="text-xs text-secondary">{totalGuests} undangan terdata</p>
                </div>
              </div>
              {guestsAvailable && (
                <Link
                  href="/planner/guests"
                  className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5"
                >
                  Buku Tamu <ArrowUpRight size={13} />
                </Link>
              )}
            </div>

            <div className="mt-4 flex items-center justify-around gap-4">
              <GiftedDonutChart
                percent={attendingPercent}
                size={96}
                strokeWidth={9}
                testId="rsvp-percent"
                gradientColors={["#065f46", "#10b981"]}
              />
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-foreground font-medium">Hadir:</span>
                  <span className="font-mono text-secondary">{attendingGuests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="text-foreground font-medium">Menunggu:</span>
                  <span className="font-mono text-secondary">{pendingGuests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-foreground font-medium">Berhalangan:</span>
                  <span className="font-mono text-secondary">{declinedGuests}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

