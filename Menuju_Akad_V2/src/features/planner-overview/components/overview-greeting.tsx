"use client";
import Link from "next/link";
import styles from "./overview.module.css";

type Props = {
  dateContext: string;
  greeting: string;
  countdownLabel: string;
  eventDetail: string;
  readinessPercent: number;
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
        <p className="text-xs font-semibold tracking-wider text-ux-on-dark uppercase">
          {dateContext}
        </p>
        <h1 id="greeting-title" className="font-sans text-2xl md:text-3xl font-medium text-canvas">
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
        <div className="text-center md:text-right">
          <span className="block font-mono text-3xl font-bold text-champagne">
            {readinessPercent}%
          </span>
          <span className="text-xs text-ux-on-dark">{readinessLabel}</span>
        </div>
        <Link
          href="/planner/tasks"
          className="rounded-control bg-canvas px-4 py-2 text-xs font-semibold text-primary transition hover:bg-white"
        >
          Lihat rincian kesiapan →
        </Link>
      </div>
    </section>
  );
}
