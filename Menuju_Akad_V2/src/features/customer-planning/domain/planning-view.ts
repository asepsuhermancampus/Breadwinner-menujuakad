import type { PlanningItem } from "./planning-resource";
export type PlanningViewProps = {
  items: PlanningItem[];
  edit: (item: PlanningItem) => void;
  remove: (item: PlanningItem) => void;
  toggle: (item: PlanningItem) => void;
};
