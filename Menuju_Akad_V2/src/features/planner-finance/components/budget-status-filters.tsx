import type { BudgetFilters, BudgetStatusFilter } from "../domain/customer-budget";
import styles from "./customer-finance.module.css";
import controls from "./finance-controls.module.css";
import toolbar from "./budget-status-filters.module.css";
import { Icon } from "@/components/ui/icon";
import { initialBudgetFilters } from "../hooks/use-budget-filters";
export function BudgetStatusFilters({
  filters,
  counts,
  change,
}: {
  filters: BudgetFilters;
  counts: { total: number; pending: number; achieved: number };
  change: (filters: BudgetFilters) => void;
}) {
  const statuses: [BudgetStatusFilter, number][] = [
    ["Semua", counts.total],
    ["Belum tercapai", counts.pending],
    ["Tercapai", counts.achieved],
  ];
  const active = Object.values(filters).some(
    (value) => value !== "" && value !== undefined && value !== "Semua",
  );
  return (
    <div className={toolbar.toolbar}>
      <div className={styles.statusFilters} role="group" aria-label="Filter status anggaran">
        {statuses.map(([status, count]) => (
          <button
            key={status}
            type="button"
            className={controls.compact}
            aria-pressed={filters.status === status}
            onClick={() => change({ ...filters, status })}
          >
            {status} <span>{count}</span>
          </button>
        ))}
      </div>
      {active && (
        <button
          type="button"
          className={toolbar.reset}
          onClick={() => change(initialBudgetFilters)}
        >
          <Icon name="refresh" size={16} />
          Reset filter
        </button>
      )}
    </div>
  );
}
