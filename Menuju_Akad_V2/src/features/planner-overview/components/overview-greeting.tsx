"use client";
import Link from "next/link";
import { PageHeading } from "@/components/ui/page-heading";
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
        <span
          className={styles.readinessArc}
          style={{
            background: `conic-gradient(from 90deg, var(--primary) ${readinessPercent ?? 0}%, var(--border) 0)`,
          }}
          aria-hidden="true"
        />
        <div className="min-w-0">
          <span
            data-testid="readiness-percent"
            className="block font-mono text-3xl font-medium text-foreground"
          >
            {readinessPercent === null ? "—" : `${readinessPercent}%`}
          </span>
          <span className="text-xs text-secondary">{readinessLabel}</span>
          <Link
            href="/planner/tasks"
            className="mt-2 block text-xs font-medium text-brand-secondary hover:underline"
          >
            Lihat rincian kesiapan →
          </Link>
        </div>
      </div>
    </section>
  );
}
