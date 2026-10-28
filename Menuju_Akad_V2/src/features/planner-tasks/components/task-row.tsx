"use client";
import { useCustomerNames } from "@/features/customer-workspace/components/customer-names-context";
import { plannerPersonLabel } from "@/features/customer-workspace/domain/side-profile-names";
import type { PlannerTask } from "../types/tasks";
import styles from "./tasks.module.css";

type Props = {
  task: PlannerTask;
  onToggle: (id: string) => void;
  onSelect: (task: PlannerTask) => void;
};

export function TaskRow({ task, onToggle, onSelect }: Props) {
  const names = useCustomerNames();
  const isDone = task.status === "Selesai";

  return (
    <tr
      className={styles.row}
      onClick={() => onSelect(task)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(task);
        }
      }}
    >
      <td className="w-12 text-center" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggle(task.id)}
          aria-label={`Tandai ${task.title}`}
          className="size-4.5 cursor-pointer rounded border-border text-brand-secondary focus:ring-primary"
        />
      </td>
      <td className="font-medium text-foreground">
        <span className={isDone ? "line-through text-secondary" : ""}>{task.title}</span>
      </td>
      <td>
        <span className="inline-block rounded-control bg-ux-dock border border-ux-border px-2 py-0.5 text-xs text-secondary">
          {plannerPersonLabel(task.pic, names)}
        </span>
      </td>
      <td>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
            task.priority === "Tinggi"
              ? "bg-danger-bg text-danger font-semibold"
              : task.priority === "Normal"
                ? "bg-ux-dock text-secondary"
                : "bg-ux-dock text-secondary"
          }`}
        >
          {task.priority}
        </span>
      </td>
      <td className="font-mono text-xs text-secondary">{task.dueDate}</td>
      <td>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
            isDone
              ? "bg-success-bg text-success"
              : task.status === "Dikerjakan"
                ? "bg-ux-dock text-secondary"
                : "bg-ux-dock text-secondary"
          }`}
        >
          {task.status}
        </span>
      </td>
    </tr>
  );
}
