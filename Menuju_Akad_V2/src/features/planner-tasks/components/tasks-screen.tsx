"use client";
import { useState, useMemo } from "react";
import { useCommittedList } from "@/hooks/use-committed-list";
import { SummaryCard } from "@/components/ui/summary-card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { PlannerTask, TaskCategory } from "../types/tasks";
import { filterTasks, computeTaskSummary, taskTodayLabel } from "../utils/task-filter";
import { TaskRow } from "./task-row";
import { TaskInspector } from "./task-inspector";
import { TaskHeading } from "./task-heading";
import styles from "./tasks.module.css";

type Props = {
  initialTasks: PlannerTask[];
  event?: PlannerTask["event"];
  onChange?: (tasks: PlannerTask[]) => void | Promise<boolean | void>;
};

export function TasksScreen({ initialTasks, onChange, event }: Props) {
  const [tasks, setTasks] = useCommittedList(initialTasks, onChange);
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<PlannerTask | null>(null);
  const [creating, setCreating] = useState(false);
  const [conflict, setConflict] = useState("");

  const eventTasks = useMemo(
    () => tasks.filter((t) => !event || t.event === event),
    [tasks, event],
  );
  const summary = useMemo(() => computeTaskSummary(eventTasks), [eventTasks]);
  const displayedTasks = useMemo(
    () => filterTasks(eventTasks, activeCategory, searchQuery),
    [eventTasks, activeCategory, searchQuery],
  );

  const handleToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextStatus = t.status === "Selesai" ? "Dikerjakan" : "Selesai";
        return { ...t, status: nextStatus };
      }),
    );
  };

  const handleSaveTask = async (updated: PlannerTask) => {
    if (
      (!creating &&
        JSON.stringify(tasks.find((t) => t.id === updated.id)) !== JSON.stringify(selectedTask)) ||
      (creating && tasks.some((t) => t.id === updated.id))
    ) {
      setConflict(
        "Data tugas berubah di tab lain. Salin draf kalian lalu buka ulang tugas terbaru.",
      );
      return false;
    }
    setConflict("");
    if (
      !(await setTasks((prev) =>
        creating ? [updated, ...prev] : prev.map((t) => (t.id === updated.id ? updated : t)),
      ))
    )
      return false;
    setCreating(false);
    setSelectedTask(null);
    return true;
  };

  const handleAddNew = () => {
    const newTask: PlannerTask = {
      id: crypto.randomUUID(),
      title: "",
      pic: "Bersama",
      priority: "Normal",
      dueDate: taskTodayLabel(),
      status: "Menunggu",
      event: event ?? "wedding",
    };
    setCreating(true);
    setConflict("");
    setSelectedTask(newTask);
  };

  const categories: { label: TaskCategory; count?: number }[] = [
    { label: "Semua", count: summary.total },
    { label: "Hari ini", count: summary.today },
    { label: "Mendesak", count: summary.urgent },
    { label: "Mendatang" },
    { label: "Selesai", count: summary.completed },
  ];

  return (
    <section className={styles.container}>
      {conflict && (
        <p role="alert" className="text-sm text-danger">
          {conflict}
        </p>
      )}
      <header className={styles.header}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TaskHeading />
          <Button onClick={handleAddNew}>
            <Icon name="plus" size={16} />
            Tambah tugas
          </Button>
        </div>
      </header>

      <SummaryCard
        label="Progres pengerjaan"
        value={`${summary.percentage}%`}
        detail={`${summary.completed} dari ${summary.total} tugas selesai`}
        ornament={2}
        highlight
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex flex-wrap gap-1 rounded-control bg-ux-dock border border-ux-border p-1"
          role="tablist"
        >
          {categories.map((c) => (
            <button
              key={c.label}
              role="tab"
              aria-selected={activeCategory === c.label}
              className={`customer-control rounded-control px-3 py-1.5 text-xs font-medium transition ${
                activeCategory === c.label
                  ? "bg-surface text-brand-secondary shadow-sm font-semibold"
                  : "text-secondary hover:text-foreground"
              }`}
              onClick={() => setActiveCategory(c.label)}
            >
              {c.label} {c.count !== undefined ? c.count : ""}
            </button>
          ))}
        </div>

        <div className="relative min-w-64">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tugas…"
            className="customer-control w-full rounded-control border border-ux-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className={`${styles.tableContainer} app-scroll`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="w-12 text-center">Status</th>
              <th>Tugas</th>
              <th>Penanggung jawab</th>
              <th>Prioritas</th>
              <th>Tenggat</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onSelect={(t) => {
                  setCreating(false);
                  setSelectedTask(t);
                }}
              />
            ))}
          </tbody>
        </table>
        {displayedTasks.length === 0 && (
          <div className="p-8 text-center text-sm text-secondary">
            Tidak ada tugas yang sesuai filter atau pencarian.
          </div>
        )}
      </div>

      <TaskInspector
        key={selectedTask?.id ?? "none"}
        task={selectedTask}
        creating={creating}
        onClose={() => {
          setCreating(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
      />
    </section>
  );
}
