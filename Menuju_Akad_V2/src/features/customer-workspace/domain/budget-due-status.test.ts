import { describe, expect, it } from "vitest";
import { isBudgetDueSoon, categorizeBudgets } from "./budget-due-status";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";

describe("budget-due-status", () => {
  const today = new Date();
  const formatISO = (date: Date) => date.toISOString().split("T")[0]!;

  const in3Days = new Date(today);
  in3Days.setDate(in3Days.getDate() + 3);

  const in20Days = new Date(today);
  in20Days.setDate(in20Days.getDate() + 20);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  it("identifies budget due soon or overdue", () => {
    const overdueBudget: CustomerBudget = {
      id: "b-1",
      title: "Dekorasi",
      amount: 5000000,
      completed: false,
      dueDate: formatISO(yesterday),
    };

    const soonBudget: CustomerBudget = {
      id: "b-2",
      title: "Katering",
      amount: 10000000,
      completed: false,
      dueDate: formatISO(in3Days),
    };

    const laterBudget: CustomerBudget = {
      id: "b-3",
      title: "Souvenir",
      amount: 2000000,
      completed: false,
      dueDate: formatISO(in20Days),
    };

    const paidBudget: CustomerBudget = {
      id: "b-4",
      title: "Gedung",
      amount: 15000000,
      completed: true,
      dueDate: formatISO(yesterday),
    };

    expect(isBudgetDueSoon(overdueBudget)).toBe(true);
    expect(isBudgetDueSoon(soonBudget)).toBe(true);
    expect(isBudgetDueSoon(laterBudget)).toBe(false);
    expect(isBudgetDueSoon(paidBudget)).toBe(false);
  });

  it("categorizes budgets correctly into 3 buckets", () => {
    const budgets: CustomerBudget[] = [
      { id: "1", title: "Lunas", amount: 10000000, completed: true },
      { id: "2", title: "Segera", amount: 5000000, completed: false, dueDate: formatISO(in3Days) },
      { id: "3", title: "Santai", amount: 3000000, completed: false, dueDate: formatISO(in20Days) },
      { id: "4", title: "Tanpa Tenggat", amount: 2000000, completed: false },
    ];

    const result = categorizeBudgets(budgets);
    expect(result.total).toBe(20000000);
    expect(result.paid).toBe(10000000);
    expect(result.dueSoon).toBe(5000000);
    expect(result.unpaidRegular).toBe(5000000);
    expect(result.paidCount).toBe(1);
    expect(result.dueSoonCount).toBe(1);
    expect(result.unpaidRegularCount).toBe(2);
  });
});

