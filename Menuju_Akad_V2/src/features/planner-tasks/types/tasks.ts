export type TaskPriority = "Tinggi" | "Normal" | "Rendah";
export type TaskStatus = "Selesai" | "Dikerjakan" | "Menunggu";
export type TaskPIC = "Andi" | "Risa" | "Bersama";
export type TaskCategory = "Semua" | "Hari ini" | "Mendesak" | "Mendatang" | "Selesai";

export type PlannerTask = {
  id: string;
  title: string;
  pic: TaskPIC;
  priority: TaskPriority;
  dueDate: string;
  status: TaskStatus;
  notes?: string;
  event: "wedding" | "engagement";
};

export type TaskSummary = {
  total: number;
  completed: number;
  today: number;
  urgent: number;
  upcoming: number;
  percentage: number;
};
