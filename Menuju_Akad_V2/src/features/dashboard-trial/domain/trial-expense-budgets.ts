import { projectExpenseBudgets } from "@/features/planner-finance/domain/expense-budgets";
import { financeBookSchema } from "@/features/planner-finance/domain/finance-ledger-schema";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { TrialSnapshot } from "../types";
export function syncTrialExpenseResources(
  resources: TrialSnapshot["resources"],
  now?: string,
): TrialSnapshot["resources"] {
  const previous = (resources.finance ?? []) as CustomerBudget[];
  const book = resources.savings?.[0] ? financeBookSchema.parse(resources.savings[0]) : null;
  const next = projectExpenseBudgets(
    previous,
    { catering: resources.catering ?? [], seserahan: resources.seserahan ?? [] },
    book?.allocations ?? [],
    now,
  );
  if (JSON.stringify(previous) === JSON.stringify(next)) return resources;
  return {
    ...resources,
    finance: next,
    ...(book ? { savings: [{ ...book, revision: book.revision + 1 }] } : {}),
  };
}
