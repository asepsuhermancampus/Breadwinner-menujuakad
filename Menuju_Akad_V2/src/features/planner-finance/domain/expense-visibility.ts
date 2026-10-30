import type { FinanceSnapshot } from "../types/finance-ledger";
import type { ExpenseKind } from "./expense-budgets";
import type { CustomerBudget } from "../types/customer-budget";

export function isHiddenBudget(row: CustomerBudget, restricted: ExpenseKind[]) {
  return restricted.some(
    (kind) =>
      row.source?.kind === kind ||
      (typeof row.id === "string" && row.id.startsWith(`expense:${kind}:`)),
  );
}

export function restrictFinanceSnapshot(
  snapshot: FinanceSnapshot,
  restricted: ExpenseKind[],
): FinanceSnapshot & { hiddenActivity: boolean } {
  const forbidden = new Set(restricted);
  const hiddenIds = new Set(
    snapshot.budgets
      .filter((row) => row.source && forbidden.has(row.source.kind))
      .map((row) => row.id),
  );
  const knownIds = new Set(snapshot.budgets.map((row) => row.id));
  const hidden = (id: string | null) =>
    id !== null &&
    (hiddenIds.has(id) ||
      restricted.some((kind) => id.startsWith(`expense:${kind}:`)) ||
      (restricted.length > 0 && !knownIds.has(id)));
  const budgets = snapshot.budgets.filter((row) => !hidden(row.id));
  const entries = snapshot.entries.filter((entry) => !hidden(entry.budgetId));
  const allocations = snapshot.allocations.filter((allocation) => !hidden(allocation.budgetId));
  return {
    ...snapshot,
    budgets,
    entries,
    allocations,
    hiddenActivity:
      snapshot.hiddenActivity === true ||
      budgets.length !== snapshot.budgets.length ||
      entries.length !== snapshot.entries.length ||
      allocations.length !== snapshot.allocations.length,
  };
}
export function mergeVisibleBudgets(
  previous: CustomerBudget[],
  incoming: CustomerBudget[],
  restricted: ExpenseKind[],
): CustomerBudget[] {
  const hidden = (row: CustomerBudget) => isHiddenBudget(row, restricted);
  const hiddenIds = new Set(previous.filter(hidden).map((row) => row.id));
  if (incoming.some((row) => hidden(row) || hiddenIds.has(row.id)))
    throw new Error("Anggaran terkait belum tersedia.");
  let next = 0;
  const result: CustomerBudget[] = [];
  for (const row of previous) {
    if (hidden(row)) result.push(row);
    else if (next < incoming.length) result.push(incoming[next++]!);
  }
  return [...result, ...incoming.slice(next)];
}
