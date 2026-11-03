import { describe, expect, it } from "vitest";
import {
  getBudgetDueCategory,
  isBudgetDueSoon,
  isBudgetUrgent,
  categorizeBudgets,
} from "./budget-due-status";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";

describe("budget-due-status", () => {
  const today = new Date();
  const formatISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const in3Days = new Date(today);
  in3Days.setDate(in3Days.getDate() + 3);

  const in20Days = new Date(today);
  in20Days.setDate(in20Days.getDate() + 20);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  it("identifies budget due categories accurately", () => {
    const overdueBudget: CustomerBudget = {
      id: "b-1",
      title: "Dekorasi",
      amount: 5000000,
      completed: false,
      dueDate: formatISO(yesterday),
    };

    const todayBudget: CustomerBudget = {
      id: "b-today",
      title: "Pelaminan",
      amount: 4000000,
      completed: false,
      dueDate: formatISO(today),
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

    expect(getBudgetDueCategory(overdueBudget)).toBe("overdue");
    expect(getBudgetDueCategory(todayBudget)).toBe("dueToday");
    expect(getBudgetDueCategory(soonBudget)).toBe("dueSoon");
    expect(getBudgetDueCategory(laterBudget)).toBe("unpaid");
    expect(getBudgetDueCategory(paidBudget)).toBe("paid");

    expect(isBudgetDueSoon(soonBudget)).toBe(true);
    expect(isBudgetUrgent(overdueBudget)).toBe(true);
    expect(isBudgetUrgent(todayBudget)).toBe(true);
    expect(isBudgetUrgent(laterBudget)).toBe(false);
  });

  it("categorizes budgets into paid, overdue, dueToday, dueSoon, and unpaid buckets", () => {
    const budgets: CustomerBudget[] = [
      { id: "1", title: "Lunas", amount: 10000000, completed: true },
      { id: "2", title: "Lewat", amount: 4000000, completed: false, dueDate: formatISO(yesterday) },
      { id: "3", title: "Hari Ini", amount: 2000000, completed: false, dueDate: formatISO(today) },
      { id: "4", title: "Segera", amount: 5000000, completed: false, dueDate: formatISO(in3Days) },
      { id: "5", title: "Santai", amount: 3000000, completed: false, dueDate: formatISO(in20Days) },
      { id: "6", title: "Tanpa Tenggat", amount: 1000000, completed: false },
    ];

    const result = categorizeBudgets(budgets);
    expect(result.total).toBe(25000000);
    expect(result.paid).toBe(10000000);
    expect(result.overdue).toBe(4000000);
    expect(result.dueToday).toBe(2000000);
    expect(result.dueSoon).toBe(5000000);
    expect(result.unpaidRegular).toBe(4000000);

    expect(result.paidCount).toBe(1);
    expect(result.overdueCount).toBe(1);
    expect(result.dueTodayCount).toBe(1);
    expect(result.dueSoonCount).toBe(1);
    expect(result.unpaidRegularCount).toBe(2);
  });
});
