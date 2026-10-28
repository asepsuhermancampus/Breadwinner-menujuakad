import type { CustomerBudget } from "../types/customer-budget";
import { withinBudgetRange, type BudgetAmountRange } from "./budget-quick-filters";
export type BudgetSortKey =
  "category" | "amount" | "purpose" | "dueDate" | "priority" | "notes" | "completed";
export type BudgetColumnFilters = {
  amountRange?: BudgetAmountRange;
  purposeChoice?: string;
  purposePresence?: "Semua" | "Ada tujuan" | "Tanpa tujuan";
  minAmount?: string;
  maxAmount?: string;
  purpose?: string;
  description?: string;
  dueFrom?: string;
  dueTo?: string;
  notesPresence?: "Semua" | "Ada catatan" | "Tanpa catatan";
  sort?: { key: BudgetSortKey; direction: "asc" | "desc" };
};
export const budgetColumns: { key: BudgetSortKey; label: string }[] = [
  { key: "amount", label: "Target (Rp)" },
  { key: "category", label: "Kategori" },
  { key: "purpose", label: "Tujuan" },
  { key: "notes", label: "Detail" },
  { key: "priority", label: "Prioritas" },
  { key: "dueDate", label: "Tenggat" },
];
const text = (value?: string) => (value ?? "").trim().toLocaleLowerCase("id-ID");
export function matchesBudgetColumns(item: CustomerBudget, filters: BudgetColumnFilters) {
  if (filters.amountRange && !withinBudgetRange(item.amount, filters.amountRange)) return false;
  if (filters.purposeChoice && text(item.purpose) !== text(filters.purposeChoice)) return false;
  if (filters.purposePresence === "Tanpa tujuan" && text(item.purpose)) return false;
  if (filters.purposePresence === "Ada tujuan" && !text(item.purpose)) return false;
  if (filters.minAmount && (item.amount ?? 0) < Number(filters.minAmount)) return false;
  if (filters.maxAmount && (item.amount ?? 0) > Number(filters.maxAmount)) return false;
  if (filters.purpose && !text(item.purpose).includes(text(filters.purpose))) return false;
  if (filters.description && !text(item.notes).includes(text(filters.description))) return false;
  if (filters.dueFrom && (!item.dueDate || item.dueDate < filters.dueFrom)) return false;
  if (filters.dueTo && (!item.dueDate || item.dueDate > filters.dueTo)) return false;
  if (filters.notesPresence === "Ada catatan" && !text(item.notes)) return false;
  if (filters.notesPresence === "Tanpa catatan" && text(item.notes)) return false;
  return true;
}
const collator = new Intl.Collator("id-ID", { numeric: true, sensitivity: "base" });
export function sortBudgetColumns(items: CustomerBudget[], sort?: BudgetColumnFilters["sort"]) {
  if (!sort) return items;
  const priority = { Rendah: 0, Normal: 1, Tinggi: 2 };
  const value = (item: CustomerBudget) =>
    sort.key === "amount"
      ? (item.amount ?? 0)
      : sort.key === "completed"
        ? Number(!!item.completed)
        : sort.key === "priority"
          ? priority[item.priority ?? "Normal"]
          : sort.key === "category"
            ? (item.category ?? "Lainnya")
            : (item[sort.key] ?? "");
  return [...items].sort((a, b) => {
    if (sort.key === "dueDate" && (!a.dueDate || !b.dueDate))
      return Number(!a.dueDate) - Number(!b.dueDate);
    const first = value(a),
      second = value(b);
    const compared =
      typeof first === "number" && typeof second === "number"
        ? first - second
        : collator.compare(String(first), String(second));
    return compared * (sort.direction === "asc" ? 1 : -1);
  });
}
