"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckSquare, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";

type FilterTab = "all" | "urgent" | "inProgress" | "completed";

export function TaskStatusScrollCard({
  tasks = [],
  tasksAvailable = true,
  manageHref = "/planner/tasks",
  className,
}: {
  tasks?: PlannerTask[] | undefined;
  tasksAvailable?: boolean | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const urgentTasks = tasks.filter((t) => t.priority === "Tinggi" && t.status !== "Selesai");
  const inProgressTasks = tasks.filter((t) => t.status === "Dikerjakan");
  const completedTasks = tasks.filter((t) => t.status === "Selesai");

  const filteredTasks =
    activeTab === "urgent"
      ? urgentTasks
      : activeTab === "inProgress"
        ? inProgressTasks
        : activeTab === "completed"
          ? completedTasks
          : tasks;

  return (
    <div
      className={cn("bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs h-full", className)}
      aria-label="Detail daftar checklist dan tugas"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <CheckSquare size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">Daftar Checklist & Tugas</h3>
            <p className="text-xs text-secondary truncate">
              {completedTasks.length} selesai · {tasks.length - completedTasks.length} tersisa
              {urgentTasks.length > 0 && ` (${urgentTasks.length} prioritas tinggi)`}
            </p>
          </div>
        </div>
        {tasksAvailable && (
          <Link
            href={manageHref}
            className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
          >
            Kelola <ArrowUpRight size={13} />
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 mt-3 pb-2 border-b border-ux-border/40 text-[11px] overflow-x-auto app-scroll">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={cn(
            "px-2 py-0.5 rounded transition-all whitespace-nowrap",
            activeTab === "all"
              ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
              : "text-secondary hover:text-foreground",
          )}
        >
          Semua ({tasks.length})
        </button>
        {urgentTasks.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("urgent")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "urgent"
                ? "bg-rose-500/15 text-rose-800 dark:text-rose-300 font-semibold"
                : "text-rose-600/80 hover:text-rose-700",
            )}
          >
            <AlertCircle size={10} /> Mendesak ({urgentTasks.length})
          </button>
        )}
        {inProgressTasks.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("inProgress")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "inProgress"
                ? "bg-sky-500/15 text-sky-800 dark:text-sky-300 font-semibold"
                : "text-sky-600/80 hover:text-sky-700",
            )}
          >
            <Clock size={10} /> Berjalan ({inProgressTasks.length})
          </button>
        )}
        {completedTasks.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "completed"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            <CheckCircle2 size={10} /> Selesai ({completedTasks.length})
          </button>
        )}
      </div>

      {/* Scrollable Tasks List */}
      <div className="mt-3 flex-1 min-h-[140px] max-h-[280px] sm:max-h-[300px] xl:max-h-[320px] overflow-y-auto space-y-2 pr-1.5 app-scroll">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, idx) => (
            <div
              key={task.id || `task-${idx}`}
              className="p-2.5 rounded-lg border border-ux-border/70 bg-subtle/30 flex items-center justify-between gap-2 hover:bg-subtle/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{task.title}</p>
                <p className="text-[11px] text-secondary truncate">
                  PIC: {task.pic} · Tenggat {task.dueDate || "Belum ditentukan"}
                </p>
              </div>
              <div className="shrink-0">
                {task.status === "Selesai" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 size={10} /> Selesai
                  </span>
                ) : task.status === "Dikerjakan" ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/15 text-sky-800 dark:text-sky-300">
                    <Clock size={10} /> Berjalan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-500/15 text-slate-800 dark:text-slate-300">
                    Antrean
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-lg bg-subtle/40 border border-ux-border/60 text-center text-xs space-y-1 my-auto flex flex-col items-center justify-center min-h-[140px] xl:min-h-[170px]">
            <p className="font-semibold text-foreground">
              {tasks.length === 0 ? "Belum ada checklist tugas" : "Tidak ada tugas pada filter ini"}
            </p>
            <p className="text-secondary text-[11px]">
              {tasks.length === 0
                ? "Tambahkan tugas pernikahan di menu Checklist & Tugas."
                : "Ubah filter di atas untuk melihat tugas lainnya."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

