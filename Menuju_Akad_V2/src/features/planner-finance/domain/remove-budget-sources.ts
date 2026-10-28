import type { CustomerBudget } from "../types/customer-budget";
import { expenseKinds, type ExpenseResources } from "./expense-budgets";
export function removeBudgetSources(
  resources: ExpenseResources,
  previous: CustomerBudget[],
  next: CustomerBudget[],
): ExpenseResources {
  const retained = new Set(next.map((item) => item.id));
  const removed = previous.filter((item) => item.source && !retained.has(item.id));
  const result = { ...resources };
  for (const kind of expenseKinds) {
    const ids = new Set(
      removed.filter((item) => item.source?.kind === kind).map((item) => item.source!.id),
    );
    if (ids.size && resources[kind])
      result[kind] = resources[kind]!.filter((item) => !ids.has((item as { id: string }).id));
  }
  return result;
}
