"use client";

import { Icon } from "@/components/ui/icon";
import type { CustomerBudget } from "../types/customer-budget";
import styles from "./customer-budget-cells.module.css";

type CellActions = {
  pending: boolean;
  allocationMode: boolean;
  edit: (item: CustomerBudget) => void;
  remove: (item: CustomerBudget) => void;
  duplicate: (item: CustomerBudget) => void;
  onStatusChange: (item: CustomerBudget, completed: boolean) => void;
};

export function createBudgetTableCells(
  { pending, allocationMode, edit, remove, duplicate, onStatusChange }: CellActions,
  showDescription: (item: CustomerBudget) => void,
) {
  function renderDescription(item: CustomerBudget) {
    if (!item.notes?.trim()) return <span className={styles.muted}>—</span>;
    const label = `Lihat deskripsi ${item.title}`;
    return (
      <div className={styles.descriptionPreview}>
        <span className={styles.descriptionText}>{item.notes}</span>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={label}
          title={label}
          onClick={() => showDescription(item)}
        >
          <Icon name="eye" size={18} />
        </button>
      </div>
    );
  }

  function renderStatus(item: CustomerBudget) {
    const label = allocationMode
      ? item.completed
        ? `Batalkan alokasi untuk ${item.title}`
        : `Gunakan tabungan untuk ${item.title}`
      : item.completed
        ? `Tandai dana belum terkumpul untuk ${item.title}`
        : `Tandai dana terkumpul untuk ${item.title}`;
    return (
      <button
        type="button"
        className={`${styles.statusButton} ${item.completed ? styles.completed : ""}`}
        aria-label={label}
        title={label}
        aria-pressed={!!item.completed}
        disabled={pending}
        onClick={() => onStatusChange(item, !item.completed)}
      >
        <Icon name={item.completed ? "check-circle" : "circle"} size={16} />
        {item.completed ? "Tercapai" : "Belum tercapai"}
      </button>
    );
  }

  function renderActions(item: CustomerBudget) {
    return (
      <div className={styles.actions}>
        {[
          { text: "Edit", icon: "pencil", action: edit },
          { text: "Duplikat", icon: "copy", action: duplicate },
          { text: "Hapus", icon: "trash", action: remove },
        ].map(({ text, icon, action }) => (
          <button
            key={text}
            type="button"
            className={`${styles.iconButton} ${icon === "trash" ? styles.deleteButton : ""}`}
            aria-label={`${text} ${item.title}`}
            title={`${text} ${item.title}`}
            disabled={pending}
            onClick={() => action(item)}
          >
            <Icon name={icon} size={18} />
          </button>
        ))}
      </div>
    );
  }

  function renderPriority(item: CustomerBudget) {
    return (
      <span
        className={`${styles.priority} ${item.priority === "Tinggi" ? styles.highPriority : ""}`}
      >
        {item.priority ?? "Normal"}
      </span>
    );
  }

  return { renderDescription, renderStatus, renderActions, renderPriority };
}
