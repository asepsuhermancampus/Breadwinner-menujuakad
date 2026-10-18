import type { PlannerTask } from "../types/tasks";
import styles from "./tasks.module.css";

type Props = {
  task: PlannerTask;
  onToggle: (id: string) => void;
  onSelect: (task: PlannerTask) => void;
};

export function TaskRow({ task, onToggle, onSelect }: Props) {
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
          className="size-4.5 cursor-pointer rounded border-border text-primary focus:ring-primary"
        />
      </td>
      <td className="font-medium text-foreground">
        <span className={isDone ? "line-through text-secondary" : ""}>{task.title}</span>
      </td>
      <td>
        <span className="inline-block rounded-control bg-subtle px-2 py-0.5 text-xs text-secondary">
          {task.pic}
        </span>
      </td>
      <td>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${
            task.priority === "Tinggi"
              ? "bg-rose/10 text-rose"
              : task.priority === "Normal"
                ? "bg-champagne/15 text-foreground"
                : "bg-subtle text-secondary"
          }`}
        >
          {task.priority}
        </span>
      </td>
      <td className="font-mono text-xs text-secondary">{task.dueDate}</td>
      <td>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] ${
            isDone
              ? "bg-emerald-50 text-emerald-700"
              : task.status === "Dikerjakan"
                ? "bg-amber-50 text-amber-700"
                : "bg-subtle text-secondary"
          }`}
        >
          {task.status}
        </span>
      </td>
    </tr>
  );
}
