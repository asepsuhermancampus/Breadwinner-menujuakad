import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { FinanceCommand } from "@/features/planner-finance/types/finance-ledger";
import type { ExpenseKind } from "@/features/planner-finance/domain/expense-budgets";
export function affectedExpenseSources(
  command: FinanceCommand,
  previous: CustomerBudget[],
): ExpenseKind[] {
  const removed =
    command.type === "delete-budget"
      ? previous.filter((item) => item.id === command.budgetId)
      : command.type === "save-budgets"
        ? previous.filter((item) => !command.budgets.some((next) => next.id === item.id))
        : [];
  return [...new Set(removed.flatMap((item) => (item.source ? [item.source.kind] : [])))];
}
