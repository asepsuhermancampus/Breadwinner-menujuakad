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
      <div className="space-y-1.5">
        <p className="text-xs font-medium tracking-wide text-secondary uppercase">{dateContext}</p>
        <h1 id="greeting-title" className="font-serif text-3xl font-normal text-foreground">
          {greeting}
        </h1>
        <p className="text-sm text-secondary">
          <strong className="text-foreground">{countdownLabel}</strong> · {eventDetail}
        </p>
      </div>
      <div className={styles.readinessRing}>
        <div className="text-center">
          <span className="block font-mono text-3xl font-semibold text-primary">
            {readinessPercent}%
          </span>
          <span className="text-xs text-secondary">{readinessLabel}</span>
        </div>
        <Link
          href="/planner/tasks"
          className="rounded-control bg-primary px-3.5 py-2 text-xs font-medium text-white transition hover:bg-primary-hover"
        >
          Lihat rincian kesiapan →
        </Link>
      </div>
    </section>
  );
}
