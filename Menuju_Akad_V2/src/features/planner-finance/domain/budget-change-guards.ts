import type { CustomerBudget } from "../types/customer-budget";
import type { FinanceAllocation } from "../types/finance-ledger";
export const linkedBudgetMessage =
  "Ubah nama, nominal, kategori, atau detail kebutuhan terhubung melalui fitur asalnya.";
export function assertBudgetChanges(
  previous: CustomerBudget[],
  next: CustomerBudget[],
  allocations: FinanceAllocation[],
): void {
  for (const row of next) {
    const old = previous.find((item) => item.id === row.id);
    if (
      (row.source || row.id.startsWith("expense:")) &&
      (!old?.source || JSON.stringify(row.source) !== JSON.stringify(old.source))
    )
      throw new Error(linkedBudgetMessage);
    if (row.completed && !old?.completed)
      throw new Error("Tandai anggaran selesai melalui alokasi tabungan.");
  }
  for (const old of previous) {
    if (!old.source) continue;
    const row = next.find((item) => item.id === old.id);
    if (
      !row ||
      [
        "title",
        "amount",
        "category",
        "notes",
        "source",
        "sourceDetails",
        ...(old.source.kind === "catering" ? ["dueDate"] : []),
      ].some(
        (key) =>
          JSON.stringify(row[key as keyof CustomerBudget]) !==
          JSON.stringify(old[key as keyof CustomerBudget]),
      )
    )
      throw new Error(linkedBudgetMessage);
  }
  for (const allocation of allocations) {
    const old = previous.find((item) => item.id === allocation.budgetId);
    const row = next.find((item) => item.id === allocation.budgetId);
    if (!row || !row.completed || row.amount !== old?.amount || row.amount !== allocation.amount)
      throw new Error(
        "Lepaskan alokasi sebelum mengubah nominal, status, atau menghapus anggaran.",
      );
  }
}
