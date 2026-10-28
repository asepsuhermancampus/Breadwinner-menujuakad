"use client";
import type { BudgetFilters, BudgetDueFilter } from "../domain/customer-budget";
import type { BudgetSortKey } from "../domain/budget-column-filters";
import type { BudgetPriority } from "../types/customer-budget";
import { amountRanges, type BudgetAmountRange } from "../domain/budget-quick-filters";
import { BudgetFilterChoices as Choices } from "./budget-filter-choices";
const options = (values: string[]) => values.map((value) => ({ value, label: value }));
export function BudgetColumnFields({
  column,
  filters,
  categories,
  purposes,
  change,
}: {
  column: BudgetSortKey;
  filters: BudgetFilters;
  categories: string[];
  purposes: string[];
  change: (next: BudgetFilters) => void;
}) {
  if (column === "category")
    return (
      <Choices
        label="Filter kategori anggaran"
        value={filters.category ?? "Semua"}
        options={[{ value: "Semua", label: "Semua kategori" }, ...options(categories)]}
        change={(category) => change({ ...filters, category })}
      />
    );
  if (column === "amount")
    return (
      <Choices
        label="Filter target anggaran"
        value={filters.amountRange ?? "Semua"}
        options={amountRanges}
        change={(amountRange) =>
          change({
            ...filters,
            minAmount: "",
            maxAmount: "",
            amountRange: amountRange as BudgetAmountRange,
          })
        }
      />
    );
  if (column === "purpose")
    return (
      <Choices
        label="Filter tujuan anggaran"
        value={
          filters.purposeChoice
            ? `purpose:${filters.purposeChoice}`
            : (filters.purposePresence ?? "Semua")
        }
        options={[
          { value: "Semua", label: "Semua tujuan" },
          { value: "Tanpa tujuan", label: "Tanpa tujuan" },
          ...purposes.map((purpose) => ({ value: `purpose:${purpose}`, label: purpose })),
        ]}
        change={(value) =>
          change({
            ...filters,
            purpose: "",
            purposeChoice: value.startsWith("purpose:") ? value.slice(8) : "",
            purposePresence: value === "Tanpa tujuan" ? "Tanpa tujuan" : "Semua",
          })
        }
      />
    );
  if (column === "dueDate")
    return (
      <Choices
        label="Filter tenggat"
        value={filters.due}
        options={options([
          "Semua",
          "Lewat tenggat",
          "Hari ini",
          "7 hari ke depan",
          "30 hari ke depan",
          "Tanpa tenggat",
        ])}
        change={(due) =>
          change({ ...filters, due: due as BudgetDueFilter, dueFrom: "", dueTo: "" })
        }
      />
    );
  if (column === "priority")
    return (
      <Choices
        label="Filter prioritas"
        value={filters.priority}
        options={[
          { value: "Semua", label: "Semua prioritas" },
          { value: "Tinggi", label: "Tinggi", tone: "high" },
          { value: "Normal", label: "Normal", tone: "normal" },
          { value: "Rendah", label: "Rendah", tone: "low" },
        ]}
        change={(priority) =>
          change({ ...filters, priority: priority as BudgetPriority | "Semua" })
        }
      />
    );
  if (column === "notes")
    return (
      <Choices
        label="Filter keberadaan catatan"
        value={filters.notesPresence ?? "Semua"}
        options={[
          { value: "Semua", label: "Semua detail" },
          ...options(["Ada catatan", "Tanpa catatan"]),
        ]}
        change={(notesPresence) =>
          change({
            ...filters,
            description: "",
            notesPresence: notesPresence as NonNullable<BudgetFilters["notesPresence"]>,
          })
        }
      />
    );
  return null;
}
