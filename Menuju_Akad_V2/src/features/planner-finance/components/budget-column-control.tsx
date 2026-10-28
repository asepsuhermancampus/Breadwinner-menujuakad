"use client";
import type { BudgetFilters } from "../domain/customer-budget";
import type { BudgetSortKey } from "../domain/budget-column-filters";
import { BudgetColumnPopover } from "./budget-column-popover";
import { BudgetColumnFields } from "./budget-column-fields";
import styles from "./budget-column-controls.module.css";
const filterKeys: Record<BudgetSortKey, (keyof BudgetFilters)[]> = {
  category: ["category"],
  amount: ["amountRange", "minAmount", "maxAmount"],
  purpose: ["purpose", "purposeChoice", "purposePresence"],
  dueDate: ["due", "dueFrom", "dueTo"],
  priority: ["priority"],
  notes: ["description", "notesPresence"],
  completed: ["status"],
};
export function BudgetColumnControl({
  column,
  filters,
  categories,
  purposes,
  change,
}: {
  column: { key: BudgetSortKey; label: string };
  filters: BudgetFilters;
  categories: string[];
  purposes: string[];
  change: (filters: BudgetFilters) => void;
}) {
  const active = filterKeys[column.key].some((key) => filters[key] && filters[key] !== "Semua");
  return (
    <BudgetColumnPopover label={column.label} active={Boolean(active)}>
      {(close) => (
        <>
          <div className={styles.fields}>
            <BudgetColumnFields
              column={column.key}
              filters={filters}
              categories={categories}
              purposes={purposes}
              change={change}
            />
          </div>
          <footer>
            <button
              type="button"
              disabled={!active}
              onClick={() => {
                const next = { ...filters };
                for (const key of filterKeys[column.key]) delete next[key];
                change({
                  ...next,
                  status: next.status ?? "Semua",
                  priority: next.priority ?? "Semua",
                  due: next.due ?? "Semua",
                });
                close();
              }}
            >
              Reset filter
            </button>
          </footer>
        </>
      )}
    </BudgetColumnPopover>
  );
}
