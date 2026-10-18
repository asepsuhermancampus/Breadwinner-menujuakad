"use client";
import { useState } from "react";
import type { PlannerOverviewData, PlannerEventContext } from "../types/overview";
import { OverviewGreeting } from "./overview-greeting";
import { OverviewMetrics } from "./overview-metrics";
import { OverviewPriorities } from "./overview-priorities";
import styles from "./overview.module.css";

type Props = {
  initialWedding: PlannerOverviewData;
  initialEngagement: PlannerOverviewData;
};

export function OverviewScreen({ initialWedding, initialEngagement }: Props) {
  const [eventContext, setEventContext] = useState<PlannerEventContext>("wedding");
  const data = eventContext === "wedding" ? initialWedding : initialEngagement;
  const [tasks, setTasks] = useState(data.focusTasks);

  const handleToggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  return (
    <main id="main-content" className={styles.container}>
      <div className="flex items-center justify-between border-b border-ux-border pb-3">
        <div
          className="flex gap-1.5 rounded-control bg-ux-dock border border-ux-border p-1"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={eventContext === "wedding"}
            className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
              eventContext === "wedding"
                ? "bg-surface text-primary shadow-sm font-semibold"
                : "text-secondary hover:text-foreground"
            }`}
            onClick={() => {
              setEventContext("wedding");
              setTasks(initialWedding.focusTasks);
            }}
          >
            Akad & Resepsi
          </button>
          <button
            role="tab"
            aria-selected={eventContext === "engagement"}
            className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
              eventContext === "engagement"
                ? "bg-surface text-primary shadow-sm font-semibold"
                : "text-secondary hover:text-foreground"
            }`}
            onClick={() => {
              setEventContext("engagement");
              setTasks(initialEngagement.focusTasks);
            }}
          >
            Mode Lamaran
          </button>
        </div>
        <span className="rounded-full bg-ux-dock border border-ux-border px-3 py-1 font-mono text-xs text-secondary">
          {eventContext === "wedding" ? "H–112 · 14 Feb 2027" : "H–28 · 22 Nov 2026"}
        </span>
      </div>

      <OverviewGreeting
        dateContext={data.dateContext}
        greeting={data.greeting}
        countdownLabel={data.countdownLabel}
        eventDetail={data.eventDetail}
        readinessPercent={data.readinessPercent}
        readinessLabel={data.readinessLabel}
      />

      <OverviewMetrics metrics={data.metrics} />

      <OverviewPriorities
        focusTasks={tasks}
        upcomingAgenda={data.upcomingAgenda}
        bannerMessage={data.bannerMessage}
        rundownHintTitle={data.rundownHintTitle}
        rundownHintDetail={data.rundownHintDetail}
        partnerActivity={data.partnerActivity}
        onToggleTask={handleToggleTask}
      />
    </main>
  );
}
