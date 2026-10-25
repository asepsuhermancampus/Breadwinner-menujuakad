import type { FocusTaskItem, PlannerEventContext } from "../types/overview";

export type EventTaskMap = Record<PlannerEventContext, FocusTaskItem[]>;

export function createInitialTaskMap(
  weddingTasks: FocusTaskItem[],
  engagementTasks: FocusTaskItem[],
): EventTaskMap {
  return {
    wedding: weddingTasks,
    engagement: engagementTasks,
  };
}

export function toggleEventTask(
  map: EventTaskMap,
  context: PlannerEventContext,
  taskId: string,
): EventTaskMap {
  const currentTasks = map[context];
  return {
    ...map,
    [context]: currentTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    ),
  };
}
