import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import type { SideNames } from "./side-profile-names";

export type TaskCategorization = {
  totalTasks: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  urgentCount: number;
  todayCount: number;
  picUserCount: number;
  picPartnerCount: number;
  picTogetherCount: number;
  completionRate: number;
};

export function categorizeTasks(
  tasks: PlannerTask[],
  ownerSide: "groom" | "bride" = "groom",
): TaskCategorization {
  const isBride = ownerSide === "bride";
  const userPicName = isBride ? "Risa" : "Andi";
  const partnerPicName = isBride ? "Andi" : "Risa";

  let completedCount = 0, inProgressCount = 0, pendingCount = 0;
  let urgentCount = 0, todayCount = 0;
  let picUserCount = 0, picPartnerCount = 0, picTogetherCount = 0;

  for (const t of tasks) {
    if (t.status === "Selesai") completedCount += 1;
    else if (t.status === "Dikerjakan") inProgressCount += 1;
    else pendingCount += 1;

    if (t.priority === "Tinggi") urgentCount += 1;

    if (t.pic === userPicName) picUserCount += 1;
    else if (t.pic === partnerPicName) picPartnerCount += 1;
    else picTogetherCount += 1;
  }

  const completionRate =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return {
    totalTasks: tasks.length,
    completedCount,
    inProgressCount,
    pendingCount,
    urgentCount,
    todayCount,
    picUserCount,
    picPartnerCount,
    picTogetherCount,
    completionRate,
  };
}

export function buildOverviewTaskStatusSlices(c: TaskCategorization): {
  slices: DonutSlice[];
  centerValue: string;
  centerLabel: string;
} {
  const total = c.totalTasks;
  if (total <= 0) {
    return { slices: [], centerValue: "0%", centerLabel: "Tugas Selesai" };
  }

  const completedPercent = Math.round((c.completedCount / total) * 100);
  const inProgressPercent = Math.round((c.inProgressCount / total) * 100);
  const pendingPercent = Math.max(0, 100 - completedPercent - inProgressPercent);

  const slices: DonutSlice[] = [];
  if (completedPercent > 0) {
    slices.push({
      id: "completed", label: "Sudah Selesai", percent: completedPercent,
      amount: c.completedCount, color: "#059669",
    });
  }
  if (inProgressPercent > 0) {
    slices.push({
      id: "in-progress", label: "Sedang Dikerjakan", percent: inProgressPercent,
      amount: c.inProgressCount, color: "#0284c7",
    });
  }
  if (pendingPercent > 0) {
    slices.push({
      id: "pending", label: "Menunggu / Antrean", percent: pendingPercent,
      amount: c.pendingCount, color: "#94a3b8",
    });
  }

  return { slices, centerValue: `${c.completionRate}%`, centerLabel: "Tugas Selesai" };
}

export function buildOverviewTaskPicSlices(
  c: TaskCategorization,
  names: SideNames,
  ownerSide: "groom" | "bride" = "groom",
): { slices: DonutSlice[]; centerValue: string | number; centerLabel: string } {
  const total = c.totalTasks;
  if (total <= 0) {
    return { slices: [], centerValue: 0, centerLabel: "Tugas" };
  }

  const isBride = ownerSide === "bride";
  const userLabel = isBride ? names.bride : names.groom;
  const partnerLabel = isBride ? names.groom : names.bride;

  const userPercent = Math.round((c.picUserCount / total) * 100);
  const partnerPercent = Math.round((c.picPartnerCount / total) * 100);
  const togetherPercent = Math.max(0, 100 - userPercent - partnerPercent);

  const slices: DonutSlice[] = [];
  if (userPercent > 0) {
    slices.push({
      id: "pic-user", label: `Tugas ${userLabel}`, percent: userPercent,
      amount: c.picUserCount, color: isBride ? "#ec4899" : "#0284c7",
    });
  }
  if (partnerPercent > 0) {
    slices.push({
      id: "pic-partner", label: `Tugas ${partnerLabel}`, percent: partnerPercent,
      amount: c.picPartnerCount, color: isBride ? "#0284c7" : "#ec4899",
    });
  }
  if (togetherPercent > 0) {
    slices.push({
      id: "pic-together", label: "Tugas Bersama", percent: togetherPercent,
      amount: c.picTogetherCount, color: "#8b5cf6",
    });
  }

  return { slices, centerValue: total, centerLabel: "Total Tugas" };
}

