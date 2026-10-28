"use client";
import { useState } from "react";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useFinanceLocation } from "./use-finance-location";
import { availableBudgetCategories } from "../domain/budget-categories";
import type { BudgetFilters, BudgetStatusFilter } from "../domain/customer-budget";
import type { CustomerBudget } from "../types/customer-budget";
export const initialBudgetFilters: BudgetFilters = {
  category: "Semua",
  status: "Semua",
  priority: "Semua",
  due: "Semua",
  query: "",
};
export function useBudgetFilters(items: CustomerBudget[]) {
  const location = useFinanceLocation();
  const [status, setStatus] = useUrlTab<BudgetStatusFilter>(
    "budgetStatus",
    ["Semua", "Belum tercapai", "Tercapai"],
    "Semua",
  );
  const [category, setCategory] = useUrlTab<string>(
    "category",
    ["Semua", ...availableBudgetCategories(items), location.get("category") ?? "Semua"],
    "Semua",
  );
  const [chosen, setChosen] = useState(initialBudgetFilters);
  const filters: BudgetFilters = { ...chosen, status, category };
  function setFilters(next: BudgetFilters) {
    setChosen(next);
    setStatus(next.status);
    setCategory(next.category ?? "Semua");
  }
  return [filters, setFilters] as const;
}
