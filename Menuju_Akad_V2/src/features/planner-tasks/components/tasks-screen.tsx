"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { PlannerTask, TaskCategory } from "../types/tasks";
import { filterTasks, computeTaskSummary } from "../utils/task-filter";
import { TaskRow } from "./task-row";
import { TaskInspector } from "./task-inspector";
import styles from "./tasks.module.css";

type Props = {
  initialTasks: PlannerTask[];
};

export function TasksScreen({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<PlannerTask[]>(initialTasks);
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<PlannerTask | null>(null);

  const summary = useMemo(() => computeTaskSummary(tasks), [tasks]);
  const displayedTasks = useMemo(
    () => filterTasks(tasks, activeCategory, searchQuery),
    [tasks, activeCategory, searchQuery],
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

  const handleSaveTask = (updated: PlannerTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setSelectedTask(null);
  };

  const handleAddNew = () => {
    const newTask: PlannerTask = {
      id: `task-${Date.now()}`,
      title: "Tugas baru tanpa judul",
      pic: "Bersama",
      priority: "Normal",
      dueDate: "25 Okt",
      status: "Menunggu",
      event: "wedding",
    };
    setTasks((prev) => [newTask, ...prev]);
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
    <main id="main-content" className={styles.container}>
      <header className={styles.header}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-3xl font-semibold text-primary tracking-[-0.9px]">
              Checklist & tugas
            </h1>
            <p className="text-sm text-secondary">
              Bagi tanggung jawab. Selesaikan satu hal pada satu waktu.
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Icon name="plus" size={16} />
            Tambah tugas
          </Button>
        </div>
      </header>

      <div className={styles.summaryCard}>
        <div className="space-y-1">
          <span className="text-xs text-secondary">Progres pengerjaan</span>
          <p className="text-sm font-mono font-semibold text-primary">
            {summary.completed} dari {summary.total} tugas selesai · {summary.percentage}%
          </p>
        </div>
        <div className="h-2 w-48 rounded-full bg-ux-dock overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${summary.percentage}%` }}
          />
        </div>
      </div>

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
              className={`rounded-control px-3 py-1.5 text-xs font-medium transition ${
                activeCategory === c.label
                  ? "bg-surface text-primary shadow-sm font-semibold"
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
            className="w-full rounded-control border border-ux-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
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
                onSelect={(t) => setSelectedTask(t)}
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
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTask}
      />
    </main>
  );
}
