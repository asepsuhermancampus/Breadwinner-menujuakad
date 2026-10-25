"use client";
import Link from "next/link";
import styles from "./overview.module.css";

type Props = {
  dateContext: string;
  greeting: string;
  countdownLabel: string;
  eventDetail: string;
  readinessPercent: number | null;
  readinessLabel: string;
};

export function OverviewGreeting({
  dateContext,
  greeting,
  countdownLabel,
  eventDetail,
  readinessPercent,
  readinessLabel,
}: Props) {
  return (
    <section className={styles.greetingCard} aria-labelledby="greeting-title">
      <div className="space-y-2">
        <p className="text-xs text-ux-on-dark">{dateContext}</p>
        <h1
          id="greeting-title"
          className="font-sans text-2xl md:text-[32px] font-medium tracking-[-0.7px] text-canvas"
        >
          {greeting}
        </h1>
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <span className="rounded-full bg-white/10 border border-white/20 px-3 py-0.5 font-mono text-xs text-ux-on-dark">
            {countdownLabel}
          </span>
          <span className="text-xs text-ux-on-dark">· {eventDetail}</span>
        </div>
      </div>
      <div className={styles.readinessRing}>
        <span
          className={styles.readinessArc}
          style={{
            background: `conic-gradient(from 90deg, #c9a66b ${readinessPercent ?? 0}%, #ffffff1a 0)`,
          }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <span
            data-testid="readiness-percent"
            className="block font-mono text-3xl font-bold text-champagne"
          >
            {readinessPercent === null ? "—" : `${readinessPercent}%`}
          </span>
          <span className="text-xs text-ux-on-dark">{readinessLabel}</span>
          <Link
            href="/planner/tasks"
            className="mt-2 block text-xs font-medium text-ux-on-dark hover:underline"
          >
            Lihat rincian kesiapan →
          </Link>
        </div>
      </div>
    </section>
  );
}
