"use client";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { FocusTaskItem, UpcomingAgendaItem } from "../types/overview";
import styles from "./overview.module.css";

type Props = {
  focusTasks: FocusTaskItem[];
  upcomingAgenda: UpcomingAgendaItem[];
  bannerMessage: string;
  rundownHintTitle: string;
  rundownHintDetail: string;
  partnerActivity: string;
  onToggleTask?: (id: string) => void;
};

export function OverviewPriorities({
  focusTasks,
  upcomingAgenda,
  bannerMessage,
  rundownHintTitle,
  rundownHintDetail,
  partnerActivity,
  onToggleTask,
}: Props) {
  return (
    <div className="space-y-6">
      <div className={styles.banner} role="status">
        <Icon name="alert-circle" size={18} />
        <span>{bannerMessage}</span>
      </div>

      <div className={styles.columnsGrid}>
        <section className={styles.panel} aria-labelledby="focus-title">
          <div className="flex items-center justify-between">
            <h2 id="focus-title" className="text-base font-semibold text-foreground">
              Fokus kecil hari ini
            </h2>
            <Link href="/planner/tasks" className="text-xs text-brand-secondary hover:underline">
              Lihat semua →
            </Link>
          </div>
          <div className="space-y-2.5">
            {focusTasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask?.(task.id)}
                    className="size-4 rounded border-border text-brand-secondary focus:ring-primary"
                  />
                  <span className={task.completed ? "line-through text-secondary" : ""}>
                    {task.title}
                  </span>
                </label>
                <div className="flex items-center gap-2 text-xs text-secondary">
                  <span className="rounded bg-surface px-1.5 py-0.5">{task.pic}</span>
                  <span className="font-mono">{task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/planner/tasks"
            className="mt-2 block rounded-control border border-border py-2 text-center text-xs font-medium text-secondary hover:bg-subtle"
          >
            + Tambah tugas singkat
          </Link>
        </section>

        <section className={styles.panel} aria-labelledby="agenda-title">
          <div className="flex items-center justify-between">
            <h2 id="agenda-title" className="text-base font-semibold text-foreground">
              Janji berikutnya
            </h2>
            <Link href="/planner/calendar" className="text-xs text-brand-secondary hover:underline">
              Buka kalender koordinasi →
            </Link>
          </div>
          <div className="divide-y divide-border">
            {upcomingAgenda.map((item) => (
              <div key={item.id} className={styles.agendaItem}>
                <div className="w-16 shrink-0 text-center font-mono">
                  <span className="block text-[11px] font-semibold text-brand-secondary">
                    {item.day}
                  </span>
                  <span className="text-xs text-secondary">{item.time}</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                  <p className="text-xs text-secondary">{item.venue}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-control bg-subtle p-3 text-xs text-secondary">
            <strong className="block font-medium text-foreground">{rundownHintTitle}</strong>
            <p className="mt-1">{rundownHintDetail}</p>
            <Link
              href="/planner/rundown"
              className="mt-2 inline-block font-medium text-brand-secondary hover:underline"
            >
              Buka susunan rundown →
            </Link>
          </div>
        </section>
      </div>

      <footer className="rounded-card border border-border bg-surface px-4 py-3 text-xs text-secondary">
        <p>{partnerActivity}</p>
      </footer>
    </div>
  );
}
