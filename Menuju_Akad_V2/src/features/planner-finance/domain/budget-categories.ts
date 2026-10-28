import type { CustomerBudget } from "../types/customer-budget";
export const budgetCategories = [
  "Katering",
  "Seserahan",
  "Gedung",
  "Dekorasi",
  "Busana",
  "Undangan",
  "Dokumentasi",
  "Transportasi",
  "Lainnya",
];
export function availableBudgetCategories(items: CustomerBudget[]) {
  return [...new Set([...budgetCategories, ...items.map((item) => item.category ?? "Lainnya")])];
}
