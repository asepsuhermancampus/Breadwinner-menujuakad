"use client";

import type { PlannerTask } from "@/features/planner-tasks/types/tasks";
import { DualTaskDonutCard } from "./dual-task-donut-card";
import { TaskStatusScrollCard } from "./task-status-scroll-card";
import {
  categorizeTasks,
  buildOverviewTaskStatusSlices,
  buildOverviewTaskPicSlices,
} from "../domain/overview-task-slices";
import type { SideNames } from "../domain/side-profile-names";

export type CustomerTaskStatisticsProps = {
  tasks: PlannerTask[];
  partnerNames?: { user: string; partner: string } | undefined;
  ownerSide?: "groom" | "bride" | undefined;
  tasksAvailable?: boolean | undefined;
};

export function CustomerTaskStatistics({
  tasks,
  partnerNames = { user: "Saya", partner: "Pasangan" },
  ownerSide = "groom",
  tasksAvailable = true,
}: CustomerTaskStatisticsProps) {
  const c = categorizeTasks(tasks, ownerSide);

  const isBride = ownerSide === "bride";
  const names: SideNames = {
    groom: isBride ? partnerNames.partner : partnerNames.user,
    bride: isBride ? partnerNames.user : partnerNames.partner,
  };

  const {
    slices: statusSlices,
    centerValue: statusCenterValue,
  } = buildOverviewTaskStatusSlices(c);

  const {
    slices: picSlices,
    centerValue: picCenterValue,
  } = buildOverviewTaskPicSlices(c, names, ownerSide);

  const badgeText =
    c.totalTasks > 0
      ? c.completionRate === 100
        ? "Semua Tugas Selesai"
        : `${c.completionRate}% Tugas Beres`
      : undefined;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
      <DualTaskDonutCard
        className="xl:col-span-2"
        categorization={c}
        statusSlices={statusSlices}
        statusCenterValue={statusCenterValue}
        picSlices={picSlices}
        picCenterValue={picCenterValue}
        badgeText={badgeText}
        manageHref={tasksAvailable ? "/planner/tasks" : undefined}
      />
      <TaskStatusScrollCard
        className="xl:col-span-1"
        tasks={tasks}
        tasksAvailable={tasksAvailable}
        manageHref={tasksAvailable ? "/planner/tasks" : undefined}
      />
    </div>
  );
}
