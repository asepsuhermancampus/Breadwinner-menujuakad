import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";

export function isBudgetDueSoon(budget: CustomerBudget, thresholdDays = 7): boolean {
  if (budget.completed) return false;
  if (!budget.dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(budget.dueDate);
  if (isNaN(due.getTime())) return false;
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Jatuh tempo jika sudah terlewat (diffDays < 0) atau dalam rentang thresholdDays
  return diffDays <= thresholdDays;
}

export type BudgetCategorizedAmounts = {
  total: number;
  paid: number;
  dueSoon: number;
  unpaidRegular: number;
  paidCount: number;
  dueSoonCount: number;
  unpaidRegularCount: number;
};

export function categorizeBudgets(budgets: CustomerBudget[]): BudgetCategorizedAmounts {
  let paid = 0;
  let dueSoon = 0;
  let unpaidRegular = 0;
  let paidCount = 0;
  let dueSoonCount = 0;
  let unpaidRegularCount = 0;

  for (const b of budgets) {
    const amount = b.amount ?? 0;
    if (b.completed) {
      paid += amount;
      paidCount++;
    } else if (isBudgetDueSoon(b)) {
      dueSoon += amount;
      dueSoonCount++;
    } else {
      unpaidRegular += amount;
      unpaidRegularCount++;
    }
  }

  const total = paid + dueSoon + unpaidRegular;
  return {
    total,
    paid,
    dueSoon,
    unpaidRegular,
    paidCount,
    dueSoonCount,
    unpaidRegularCount,
  };
}

