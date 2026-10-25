import type { PlannerTask, TaskCategory, TaskSummary } from "../types/tasks";
export const taskTodayLabel = () =>
  new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Jakarta",
  });
const dueToday = (task: PlannerTask) =>
  task.dueDate.toLocaleLowerCase("id-ID") === taskTodayLabel().toLocaleLowerCase("id-ID");

export function filterTasks(
  tasks: PlannerTask[],
  category: TaskCategory,
  searchQuery: string,
): PlannerTask[] {
  return tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.pic.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (category === "Semua") return true;
    if (category === "Selesai") return task.status === "Selesai";
    if (category === "Hari ini") return dueToday(task);
    if (category === "Mendesak") return task.priority === "Tinggi" && task.status !== "Selesai";
    if (category === "Mendatang") return !dueToday(task) && task.status !== "Selesai";
    return true;
  });
}

export function computeTaskSummary(tasks: PlannerTask[]): TaskSummary {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Selesai").length;
  const today = tasks.filter(dueToday).length;
  const urgent = tasks.filter((t) => t.priority === "Tinggi" && t.status !== "Selesai").length;
  const upcoming = tasks.filter((t) => !dueToday(t) && t.status !== "Selesai").length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, today, urgent, upcoming, percentage };
}
