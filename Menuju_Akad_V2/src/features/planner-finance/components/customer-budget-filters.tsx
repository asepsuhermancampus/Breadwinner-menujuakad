import type { BudgetPriority } from "../types/customer-budget";
import type { BudgetDueFilter, BudgetFilters, BudgetStatusFilter } from "../domain/customer-budget";
import styles from "./customer-finance.module.css";
import controls from "./finance-controls.module.css";

export function CustomerBudgetFilters({
  filters,
  counts,
  onChange,
}: {
  filters: BudgetFilters;
  counts: { total: number; pending: number; achieved: number };
  onChange: (next: BudgetFilters) => void;
}) {
  const statuses: [BudgetStatusFilter, number][] = [
    ["Semua", counts.total],
    ["Belum tercapai", counts.pending],
    ["Tercapai", counts.achieved],
  ];
  return (
    <div className={styles.filterArea}>
      <div className={styles.statusFilters} role="group" aria-label="Filter status anggaran">
        {statuses.map(([status, count]) => (
          <button
            key={status}
            type="button"
            className={controls.compact}
            aria-pressed={filters.status === status}
            onClick={() => onChange({ ...filters, status })}
          >
            {status} <span>{count}</span>
          </button>
        ))}
      </div>
      <div className={styles.filters}>
        <label className={styles.search}>
          Cari anggaran
          <input
            type="search"
            placeholder="Nama, tujuan, atau deskripsi…"
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
          />
        </label>
        <label>
          Prioritas
          <select
            aria-label="Prioritas"
            value={filters.priority}
            onChange={(event) =>
              onChange({ ...filters, priority: event.target.value as BudgetPriority | "Semua" })
            }
          >
            <option value="Semua">Semua prioritas</option>
            {["Tinggi", "Normal", "Rendah"].map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </label>
        <label>
          Tenggat
          <select
            aria-label="Tenggat"
            value={filters.due}
            onChange={(event) =>
              onChange({ ...filters, due: event.target.value as BudgetDueFilter })
            }
          >
            <option value="Semua">Semua tenggat</option>
            {["Mendatang", "Lewat tenggat", "Tanpa tenggat"].map((due) => (
              <option key={due}>{due}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
