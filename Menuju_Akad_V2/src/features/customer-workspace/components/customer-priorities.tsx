"use client";
import Link from "next/link";
import { useState } from "react";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { CustomerWorkspace } from "../types";
import type { OverviewResources } from "../hooks/use-overview-resources";
import styles from "./customer-overview.module.css";
import { sideProfileNames, plannerPersonLabel } from "../domain/side-profile-names";
type Agenda = {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
};
export function CustomerPriorities({
  workspace,
  tasks,
  allTasks,
  resources,
  loading,
}: {
  workspace: CustomerWorkspace;
  tasks: PlannerTask[];
  allTasks: PlannerTask[];
  resources: OverviewResources;
  loading: boolean;
}) {
  const [pending, setPending] = useState(false);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
  const agenda = ((resources.calendar.data ?? []) as Agenda[])
    .filter((a) => a.date >= today)
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
    .slice(0, 3);
  const focus = [...tasks]
    .sort(
      (a, b) =>
        Number(a.status === "Selesai") - Number(b.status === "Selesai") ||
        a.dueDate.localeCompare(b.dueDate),
    )
    .slice(0, 3);
  return (
    <div className={styles.columns}>
      <section className={styles.tasks} aria-labelledby="focus-title">
        <div className={styles.sectionHeading}>
          <h2 id="focus-title">Fokus kecil hari ini</h2>
          <Link href="/planner/tasks">Lihat semua →</Link>
        </div>
        {focus.map((task) => (
          <div key={task.id} className={styles.task}>
            <label>
              <input
                type="checkbox"
                aria-label={`Tandai ${task.title}`}
                checked={task.status === "Selesai"}
                disabled={pending || resources.tasks.saving}
                onChange={async () => {
                  setPending(true);
                  try {
                    await resources.tasks.save(
                      allTasks.map((t) =>
                        t.id === task.id
                          ? { ...t, status: t.status === "Selesai" ? "Menunggu" : "Selesai" }
                          : t,
                      ),
                    );
                  } finally {
                    setPending(false);
                  }
                }}
              />
              <span className={task.status === "Selesai" ? "line-through text-secondary" : ""}>
                {task.title}
              </span>
            </label>
            <small>
              {plannerPersonLabel(
                task.pic,
                sideProfileNames(workspace.profile, workspace.ownerSide),
              )}{" "}
              · {task.dueDate}
            </small>
          </div>
        ))}
        {!focus.length && (
          <p className={styles.empty}>
            {loading
              ? "Memuat rencana kalian…"
              : "Belum ada tugas untuk konteks acara ini. Mulai dengan satu langkah kecil."}
          </p>
        )}
        <Link href="/planner/tasks" className={styles.addTask}>
          + Tambah tugas singkat
        </Link>
      </section>
      <div className={styles.agendaColumn}>
        <section className={styles.agenda} aria-labelledby="agenda-title">
          <div className={styles.sectionHeading}>
            <h2 id="agenda-title">Janji berikutnya</h2>
            <Link href="/planner/calendar">Buka kalender →</Link>
          </div>
          {agenda.map((item) => (
            <article className={styles.appointment} key={item.id}>
              <time dateTime={item.date}>
                <strong>
                  {new Date(`${item.date}T00:00:00+07:00`).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    timeZone: "Asia/Jakarta",
                  })}
                </strong>
                <span>{item.startTime}</span>
              </time>
              <div>
                <h3>{item.title}</h3>
                <p>{item.notes || `${item.startTime}–${item.endTime}`}</p>
              </div>
            </article>
          ))}
          {!agenda.length && (
            <p className={styles.empty}>
              {loading
                ? "Memuat agenda…"
                : "Belum ada janji mendatang. Tambahkan jadwal di kalender koordinasi."}
            </p>
          )}
        </section>
        <aside className={styles.reminder}>
          <span aria-hidden="true">✦</span>
          <p>Persiapan terasa lebih ringan ketika setiap langkah direncanakan bersama.</p>
        </aside>
      </div>
    </div>
  );
}
