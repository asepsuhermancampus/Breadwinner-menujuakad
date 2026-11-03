import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";

export type BudgetDueCategory = "paid" | "overdue" | "dueToday" | "dueSoon" | "unpaid";

export function getBudgetDueCategory(
  budget: CustomerBudget,
  thresholdDays = 7,
  referenceDate = new Date(),
): BudgetDueCategory {
  if (budget.completed) return "paid";
  if (!budget.dueDate) return "unpaid";

  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);

  const due = new Date(budget.dueDate);
  if (isNaN(due.getTime())) return "unpaid";
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "overdue";
  if (diffDays === 0) return "dueToday";
  if (diffDays <= thresholdDays) return "dueSoon";
  return "unpaid";
}

export function isBudgetDueSoon(budget: CustomerBudget, thresholdDays = 7): boolean {
  const cat = getBudgetDueCategory(budget, thresholdDays);
  return cat === "dueSoon";
}

export function isBudgetUrgent(budget: CustomerBudget, thresholdDays = 7): boolean {
  const cat = getBudgetDueCategory(budget, thresholdDays);
  return cat === "overdue" || cat === "dueToday" || cat === "dueSoon";
}

export type BudgetCategorizedAmounts = {
  total: number;
  paid: number;
  overdue: number;
  dueToday: number;
  dueSoon: number;
  unpaidRegular: number;
  paidCount: number;
  overdueCount: number;
  dueTodayCount: number;
  dueSoonCount: number;
  unpaidRegularCount: number;
};

export function categorizeBudgets(
  budgets: CustomerBudget[],
  thresholdDays = 7,
  referenceDate = new Date(),
): BudgetCategorizedAmounts {
  let paid = 0;
  let overdue = 0;
  let dueToday = 0;
  let dueSoon = 0;
  let unpaidRegular = 0;
  let paidCount = 0;
  let overdueCount = 0;
  let dueTodayCount = 0;
  let dueSoonCount = 0;
  let unpaidRegularCount = 0;

  for (const b of budgets) {
    const amount = b.amount ?? 0;
    const cat = getBudgetDueCategory(b, thresholdDays, referenceDate);
    switch (cat) {
      case "paid":
        paid += amount;
        paidCount++;
        break;
      case "overdue":
        overdue += amount;
        overdueCount++;
        break;
      case "dueToday":
        dueToday += amount;
        dueTodayCount++;
        break;
      case "dueSoon":
        dueSoon += amount;
        dueSoonCount++;
        break;
      case "unpaid":
        unpaidRegular += amount;
        unpaidRegularCount++;
        break;
    }
  }

  const total = paid + overdue + dueToday + dueSoon + unpaidRegular;
  return {
    total,
    paid,
    overdue,
    dueToday,
    dueSoon,
    unpaidRegular,
    paidCount,
    overdueCount,
    dueTodayCount,
    dueSoonCount,
    unpaidRegularCount,
  };
}
