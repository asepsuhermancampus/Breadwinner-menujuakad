import { describe, expect, it } from "vitest";
import { filterTasks, computeTaskSummary } from "./task-filter";
import type { PlannerTask } from "../types/tasks";

const sampleTasks: PlannerTask[] = [
  {
    id: "1",
    title: "Konfirmasi jadwal fitting ke-2",
    pic: "Bersama",
    priority: "Normal",
    dueDate: "25 Okt",
    status: "Dikerjakan",
    event: "wedding",
  },
  {
    id: "2",
    title: "Unggah sertifikat Elsimil",
    pic: "Andi",
    priority: "Tinggi",
    dueDate: "25 Okt",
    status: "Menunggu",
    event: "wedding",
  },
  {
    id: "3",
    title: "Foto formal latar biru",
    pic: "Risa",
    priority: "Normal",
    dueDate: "20 Okt",
    status: "Selesai",
    event: "wedding",
  },
];

describe("Task filtering & summary logic", () => {
  it("filters tasks by category and search query", () => {
    expect(filterTasks(sampleTasks, "Semua", "")).toHaveLength(3);
    expect(filterTasks(sampleTasks, "Selesai", "")).toHaveLength(1);
    expect(filterTasks(sampleTasks, "Hari ini", "")).toHaveLength(2);
    expect(filterTasks(sampleTasks, "Mendesak", "")).toHaveLength(1);
    expect(filterTasks(sampleTasks, "Semua", "Elsimil")).toHaveLength(1);
  });

  it("calculates summary statistics correctly", () => {
    const summary = computeTaskSummary(sampleTasks);
    expect(summary.total).toBe(3);
    expect(summary.completed).toBe(1);
    expect(summary.today).toBe(2);
    expect(summary.urgent).toBe(1);
    expect(summary.percentage).toBe(33);
  });
});
