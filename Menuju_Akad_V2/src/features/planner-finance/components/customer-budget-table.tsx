"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { createBudgetTableCells } from "./customer-budget-cells";
import type { CustomerBudget } from "../types/customer-budget";
import styles from "./customer-budget-table.module.css";

type Props = {
  items: CustomerBudget[];
  pending: boolean;
  edit: (item: CustomerBudget) => void;
  remove: (item: CustomerBudget) => void;
  duplicate: (item: CustomerBudget) => void;
  onStatusChange: (item: CustomerBudget, completed: boolean) => void;
  emptyMessage?: string;
  allocationMode?: boolean;
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

function displayAmount(item: CustomerBudget) {
  return `Rp ${(item.amount ?? 0).toLocaleString("id-ID")}`;
}

export function CustomerBudgetTable({
  items,
  pending,
  edit,
  remove,
  duplicate,
  onStatusChange,
  emptyMessage = "Belum ada anggaran. Mulai dari kebutuhan kalian.",
  allocationMode = false,
}: Props) {
  const [description, setDescription] = useState<CustomerBudget | null>(null);

  const { renderDescription, renderStatus, renderActions, renderPriority } = createBudgetTableCells(
    { pending, allocationMode, edit, remove, duplicate, onStatusChange },
    setDescription,
  );

  return (
    <div className={styles.root}>
      {!items.length ? (
        <p className={styles.empty}>{emptyMessage}</p>
      ) : (
        <>
          <div className={styles.desktop}>
            <div
              className={styles.tableScroll}
              tabIndex={0}
              role="region"
              aria-label="Daftar target anggaran"
            >
              <table className={styles.table}>
                <caption className="sr-only">Target anggaran dan status dana terkumpul</caption>
                <colgroup>
                  <col className={styles.needColumn} />
                  <col className={styles.amountColumn} />
                  <col className={styles.purposeColumn} />
                  <col className={styles.dateColumn} />
                  <col className={styles.priorityColumn} />
                  <col className={styles.descriptionColumn} />
                  <col className={styles.statusColumn} />
                  <col className={styles.actionsColumn} />
                </colgroup>
                <thead>
                  <tr>
                    {[
                      "Kebutuhan",
                      "Target (Rp)",
                      "Tujuan",
                      "Tenggat",
                      "Prioritas",
                      "Deskripsi",
                      "Status",
                      "Aksi",
                    ].map((heading) => (
                      <th scope="col" key={heading}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <th scope="row" className={styles.need}>
                        <span>{item.title}</span>
                        <small className={styles.created}>
                          Dibuat {displayDate(item.createdAt)}
                        </small>
                      </th>
                      <td className={styles.amount}>{displayAmount(item)}</td>
                      <td>{item.purpose?.trim() || "—"}</td>
                      <td>{displayDate(item.dueDate)}</td>
                      <td>{renderPriority(item)}</td>
                      <td>{renderDescription(item)}</td>
                      <td>{renderStatus(item)}</td>
                      <td>{renderActions(item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ul className={styles.mobile} aria-label="Daftar target anggaran">
            {items.map((item) => (
              <li key={item.id} className={styles.card}>
                <div className={styles.cardHeading}>
                  <h3>{item.title}</h3>
                  <small className={styles.created}>Dibuat {displayDate(item.createdAt)}</small>
                </div>
                <dl className={styles.details}>
                  <div>
                    <dt>Target (Rp)</dt>
                    <dd className={styles.amount}>{displayAmount(item)}</dd>
                  </div>
                  <div>
                    <dt>Tujuan</dt>
                    <dd>{item.purpose?.trim() || "—"}</dd>
                  </div>
                  <div>
                    <dt>Tenggat</dt>
                    <dd>{displayDate(item.dueDate)}</dd>
                  </div>
                  <div>
                    <dt>Prioritas</dt>
                    <dd>{renderPriority(item)}</dd>
                  </div>
                  <div className={styles.cardDescription}>
                    <dt>Deskripsi</dt>
                    <dd>{renderDescription(item)}</dd>
                  </div>
                </dl>
                <div className={styles.cardFooter}>
                  {renderStatus(item)}
                  {renderActions(item)}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      <Dialog open={!!description} onClose={() => setDescription(null)} title="Deskripsi kebutuhan">
        <div className={styles.descriptionDialog}>
          <h3>{description?.title}</h3>
          <p>{description?.notes}</p>
        </div>
      </Dialog>
    </div>
  );
}
