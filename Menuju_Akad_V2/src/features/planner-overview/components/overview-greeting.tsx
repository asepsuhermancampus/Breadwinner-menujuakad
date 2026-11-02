"use client";
import Link from "next/link";
import { PageHeading } from "@/components/ui/page-heading";
import { GiftedDonutChart } from "@/components/ui/gifted-donut-chart";
import styles from "./overview.module.css";

type Props = {
  dateContext: string;
  greeting: string;
  countdownLabel: string;
  eventDetail: string;
  readinessPercent: number | null;
  readinessLabel: string;
  tasksAvailable?: boolean;
};

export function OverviewGreeting({
  dateContext,
  greeting,
  countdownLabel,
  eventDetail,
  readinessPercent,
  readinessLabel,
  tasksAvailable = true,
}: Props) {
  return (
    <section className={styles.greetingCard} aria-labelledby="greeting-title">
      <div className="space-y-2">
        <p className="text-xs text-secondary">{dateContext}</p>
        <PageHeading
          id="greeting-title"
          title={greeting}
          description="Pantau kesiapan acara, tugas, berkas, anggaran, dan agenda kalian dari satu tempat."
          headingClassName="font-heading text-2xl md:text-[32px] font-medium tracking-[-0.7px] text-foreground"
        />
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <span className="rounded-full bg-surface border border-ux-border px-3 py-0.5 font-mono text-xs text-brand-secondary">
            {countdownLabel}
          </span>
          <span className="text-xs text-secondary">· {eventDetail}</span>
        </div>
      </div>
      <div className={styles.readinessRing}>
        <GiftedDonutChart
          percent={readinessPercent}
          testId="readiness-percent"
          size={82}
          strokeWidth={8}
        />
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-foreground">
            {readinessLabel}
          </span>
          <span className="block text-xs text-secondary mt-0.5">
            {readinessPercent === null
              ? "Memuat progres acara"
              : readinessPercent === 100
                ? "Semua persiapan lengkap"
                : `${readinessPercent}% langkah siap`}
          </span>
          {tasksAvailable && (
            <Link
              href="/planner/tasks"
              className="mt-2 block text-xs font-medium text-brand-secondary hover:underline"
            >
              Lihat rincian kesiapan →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
