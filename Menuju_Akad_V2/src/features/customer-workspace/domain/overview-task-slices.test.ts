import { describe, it, expect } from "vitest";
import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import {
  categorizeTasks,
  buildOverviewTaskStatusSlices,
  buildOverviewTaskPicSlices,
} from "./overview-task-slices";

const sampleTasks: PlannerTask[] = [
  { id: "t1", title: "Booking Gedung", pic: "Andi", priority: "Tinggi", dueDate: "2026-11-20", status: "Selesai", event: "wedding" },
  { id: "t2", title: "Fitting Baju", pic: "Risa", priority: "Tinggi", dueDate: "2026-11-25", status: "Dikerjakan", event: "wedding" },
  { id: "t3", title: "Pilih Souvenir", pic: "Bersama", priority: "Normal", dueDate: "2026-12-01", status: "Menunggu", event: "wedding" },
  { id: "t4", title: "Cetak Undangan", pic: "Andi", priority: "Normal", dueDate: "2026-12-10", status: "Selesai", event: "wedding" },
];

describe("categorizeTasks", () => {
  it("handles empty tasks gracefully", () => {
    const c = categorizeTasks([]);
    expect(c.totalTasks).toBe(0);
    expect(c.completedCount).toBe(0);
    expect(c.completionRate).toBe(0);
  });

  it("calculates status and pic counts accurately", () => {
    const c = categorizeTasks(sampleTasks, "groom");
    expect(c.totalTasks).toBe(4);
    expect(c.completedCount).toBe(2);
    expect(c.inProgressCount).toBe(1);
    expect(c.pendingCount).toBe(1);
    expect(c.urgentCount).toBe(2);
    expect(c.picUserCount).toBe(2);
    expect(c.picPartnerCount).toBe(1);
    expect(c.picTogetherCount).toBe(1);
    expect(c.completionRate).toBe(50);
  });
});

describe("buildOverviewTaskStatusSlices", () => {
  it("creates status slices with correct percentages", () => {
    const c = categorizeTasks(sampleTasks, "groom");
    const { slices, centerValue } = buildOverviewTaskStatusSlices(c);
    expect(slices).toHaveLength(3);
    expect(centerValue).toBe("50%");
  });
});

describe("buildOverviewTaskPicSlices", () => {
  it("creates pic slices with partner names", () => {
    const c = categorizeTasks(sampleTasks, "groom");
    const names = { groom: "Herman", bride: "Latifah" };
    const { slices, centerValue } = buildOverviewTaskPicSlices(c, names, "groom");
    expect(slices).toHaveLength(3);
    expect(slices[0]?.label).toBe("Tugas Herman");
    expect(slices[1]?.label).toBe("Tugas Latifah");
    expect(centerValue).toBe(4);
  });
});
