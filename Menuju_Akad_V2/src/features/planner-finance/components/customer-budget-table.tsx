"use client";
import { useState } from "react";
import { BudgetDescriptionDialog } from "./budget-description-dialog";
import { BudgetColumnControl } from "./budget-column-control";
import { budgetColumns } from "../domain/budget-column-filters";
import type { BudgetFilters } from "../domain/customer-budget";
import { createBudgetTableCells } from "./customer-budget-cells";
import type { CustomerBudget } from "../types/customer-budget";
import styles from "./customer-budget-table.module.css";
type Props = {
  items: CustomerBudget[];
  pending: boolean;
  edit: (item: CustomerBudget) => void;
  remove: (item: CustomerBudget) => void;
  onStatusChange: (item: CustomerBudget, completed: boolean) => void;
  emptyMessage?: string;
  allocationMode?: boolean;
  filters: BudgetFilters;
  changeFilters: (filters: BudgetFilters) => void;
  categories: string[];
  purposes: string[];
};
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});
function displayDate(value?: string) {
  if (!value) return "—";
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+07:00` : value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}
export function CustomerBudgetTable({
  items,
  pending,
  edit,
  remove,
  onStatusChange,
  emptyMessage = "Belum ada anggaran. Mulai dari kebutuhan kalian.",
  allocationMode = false,
  filters,
  changeFilters,
  categories,
  purposes,
}: Props) {
  const [description, setDescription] = useState<CustomerBudget | null>(null);
  const { renderDescription, renderStatus, renderActions, renderPriority } = createBudgetTableCells(
    { pending, allocationMode, edit, remove, onStatusChange },
    setDescription,
  );
  return (
    <div className={styles.root}>
      <div className={styles.frame}>
        <div
          className={styles.tableScroll}
          tabIndex={0}
          role="region"
          aria-label="Daftar target anggaran"
        >
          <table className={styles.table}>
            <caption className="sr-only">Target anggaran dan status dana terkumpul</caption>
            <colgroup>
              {[
                "needColumn",
                "amountColumn",
                "categoryColumn",
                "purposeColumn",
                "descriptionColumn",
                "priorityColumn",
                "dateColumn",
                "statusColumn",
                "actionsColumn",
              ].map((name) => (
                <col key={name} className={styles[name]} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Rencana Anggaran</th>
                {budgetColumns.map((column) => (
                  <th scope="col" aria-label={column.label} key={column.key}>
                    <BudgetColumnControl
                      column={column}
                      filters={filters}
                      change={changeFilters}
                      categories={categories}
                      purposes={purposes}
                    />
                  </th>
                ))}
                <th scope="col">Status</th>
                <th scope="col" className={styles.actionsHeading}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {!items.length && (
                <tr>
                  <td colSpan={9} className={styles.empty}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  <th scope="row" className={styles.need}>
                    <span className={styles.truncate} title={item.title}>
                      {item.title}
                    </span>
                  </th>
                  <td
                    className={styles.amount}
                    title={`Rp ${(item.amount ?? 0).toLocaleString("id-ID")}`}
                  >
                    Rp {(item.amount ?? 0).toLocaleString("id-ID")}
                  </td>
                  <td>
                    <span className={styles.truncate} title={item.category ?? "Lainnya"}>
                      {item.category ?? "Lainnya"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.truncate} title={item.purpose}>
                      {item.purpose?.trim() || "—"}
                    </span>
                  </td>
                  <td>{renderDescription(item)}</td>
                  <td>{renderPriority(item)}</td>
                  <td>{displayDate(item.dueDate)}</td>
                  <td>{renderStatus(item)}</td>
                  <td className={styles.actionCell}>{renderActions(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <BudgetDescriptionDialog item={description} close={() => setDescription(null)} />
    </div>
  );
}
