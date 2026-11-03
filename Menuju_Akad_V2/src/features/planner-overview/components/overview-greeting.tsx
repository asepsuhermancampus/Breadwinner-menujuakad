"use client";
import Link from "next/link";
import { GiftedDonutChart, type GiftedDonutSlice } from "@/components/ui/gifted-donut-chart";
import styles from "./overview.module.css";

type Props = {
  dateContext: string;
  timeGreeting?: string;
  coupleNames?: string;
  greeting?: string;
  callToAction?: string;
  countdownLabel?: string;
  eventDetail?: string;
  readinessPercent: number | null;
  readinessLabel: string;
  tasksAvailable?: boolean;
  tasksCompleted?: number;
  tasksTotal?: number;
  documentsReady?: number;
  documentsTotal?: number;
};

export function OverviewGreeting({
  dateContext,
  timeGreeting,
  coupleNames,
  greeting,
  callToAction,
  countdownLabel,
  eventDetail,
  readinessPercent,
  readinessLabel,
  tasksAvailable = true,
  tasksCompleted = 0,
  tasksTotal = 0,
  documentsReady = 0,
  documentsTotal = 0,
}: Props) {
  const totalItems = tasksTotal + documentsTotal;
  const hasRealData = totalItems > 0 && readinessPercent !== null;

  let slices: GiftedDonutSlice[] | undefined = undefined;
  let displayPercent = readinessPercent;

  if (readinessPercent !== null) {
    if (hasRealData && (tasksCompleted > 0 || documentsReady > 0)) {
      const taskShare = Math.round((tasksCompleted / totalItems) * 100);
      const docShare = Math.round((documentsReady / totalItems) * 100);
      const restShare = Math.max(0, 100 - taskShare - docShare);
      slices = [
        { id: "tasks", percent: taskShare, color: "#087f5b" },
        { id: "docs", percent: docShare, color: "#10b981" },
        ...(restShare > 0
          ? [{ id: "rest", percent: restShare, color: "#a7f3d0", isHatched: true }]
          : []),
      ];
    } else if (hasRealData && tasksCompleted === 0 && documentsReady === 0) {
      slices = [{ id: "rest", percent: 100, color: "#a7f3d0", isHatched: true }];
    } else {
      slices = [
        { id: "demo-tasks", percent: 45, color: "#087f5b" },
        { id: "demo-docs", percent: 30, color: "#10b981" },
        { id: "demo-rest", percent: 25, color: "#a7f3d0", isHatched: true },
      ];
      if (readinessPercent === 0) {
        displayPercent = 75;
      }
    }
  }

  let prefix = timeGreeting ?? "";
  let names = coupleNames ?? "";
  if (!prefix && greeting) {
    if (greeting.includes(",")) {
      const idx = greeting.indexOf(",");
      prefix = greeting.substring(0, idx + 1).trim();
      names = greeting.substring(idx + 1).trim();
    } else {
      prefix = greeting;
      names = "";
    }
  }
  if (names && !prefix.endsWith(",")) {
    prefix = `${prefix},`;
  }
  if (names && !names.endsWith(".")) {
    names = `${names}.`;
  }

  return (
    <section className={styles.greetingCard} aria-labelledby="greeting-title">
      <div className="space-y-1.5 min-w-0 flex-1">
        <p className={styles.greetingDate}>{dateContext}</p>
        <h1 id="greeting-title" className={styles.greetingTitle}>
          <span className={styles.greetingTime}>{prefix}</span>{" "}
          <span className={styles.greetingNames}>{names}</span>
        </h1>
        {callToAction ? (
          <p className={styles.greetingCta}>
            <span>{callToAction}</span>
          </p>
        ) : countdownLabel && eventDetail ? (
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <span className="rounded-full bg-surface border border-ux-border px-3 py-0.5 font-mono text-xs text-brand-secondary">
              {countdownLabel}
            </span>
            <span className="text-xs text-secondary">· {eventDetail}</span>
          </div>
        ) : null}
      </div>
      <div className={styles.readinessRing}>
        <GiftedDonutChart
          percent={displayPercent}
          slices={slices}
          testId="readiness-percent"
          size={90}
          strokeWidth={14}
          centerLabel="Kesiapan"
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
                : `${displayPercent}% langkah siap`}
          </span>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-secondary">
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="size-2 rounded-full bg-[#087f5b]" />
              Checklist
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="size-2 rounded-full bg-[#10b981]" />
              Berkas
            </span>
            <span className="inline-flex items-center gap-1 font-medium">
              <span className="size-2 rounded-full bg-[#a7f3d0]" />
              Sisa
            </span>
          </div>

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
