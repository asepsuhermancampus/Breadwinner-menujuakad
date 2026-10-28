import { planningSchemas } from "@/features/customer-planning/domain/planning-resource";
import { cateringCost } from "@/features/customer-planning/domain/catering-menu";
import { cateringCategories } from "@/features/customer-planning/domain/catering-catalog";
import { customerBudgetSchema } from "./customer-budget-schema";
import type { CustomerBudget } from "../types/customer-budget";
import type { FinanceAllocation } from "../types/finance-ledger";
export const expenseKinds = ["catering", "seserahan"] as const;
export type ExpenseKind = (typeof expenseKinds)[number];
export type ExpenseResources = Partial<Record<ExpenseKind, unknown[]>>;
export const expenseBudgetId = (kind: ExpenseKind, id: string) => `expense:${kind}:${id}`;
const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
export function projectExpenseBudgets(
  previous: CustomerBudget[],
  resources: ExpenseResources,
  allocations: FinanceAllocation[] = [],
  now?: string,
): CustomerBudget[] {
  const next = previous.filter((row) => !row.source);
  const previousById = new Map(previous.map((row) => [row.id, row]));
  const wanted = new Set<string>();
  for (const kind of expenseKinds) {
    for (const raw of resources[kind] ?? []) {
      const item = planningSchemas[kind].parse(raw);
      const id = expenseBudgetId(kind, item.id);
      const old = previousById.get(id);
      if (old && (!old.source || old.source.kind !== kind || old.source.id !== item.id))
        throw new Error("ID anggaran sumber bertabrakan dengan catatan lain.");
      wanted.add(id);
      const catering = "portions" in item;
      const packaged = catering && item.mode === "package";
      const fixed = packaged && item.pricing === "total";
      const amount = catering ? cateringCost(item) : item.quantity * item.unitCost;
      if (!Number.isSafeInteger(amount) || amount > 1e12)
        throw new Error("Total biaya per kebutuhan maksimal Rp 1.000.000.000.000.");
      if (
        old &&
        (old.completed || allocations.some((entry) => entry.budgetId === id)) &&
        old.amount !== amount
      )
        throw new Error(
          "Batalkan alokasi pada Anggaran sebelum mengubah harga atau jumlah kebutuhan ini.",
        );
      const details = catering
        ? [
            `Jenis: ${packaged ? "Paket vendor" : (cateringCategories.find((category) => category.id === item.category)?.label ?? "Menu satuan")}`,
            ...(item.vendor ? [`Vendor: ${item.vendor}`] : []),
            ...(item.includedMenus ? [`Isi paket: ${item.includedMenus}`] : []),
            `Jumlah: ${item.portions.toLocaleString("id-ID")} ${packaged ? "orang" : "porsi"}`,
            `${fixed ? "Harga paket" : packaged ? "Harga per tamu" : "Harga per porsi"}: ${rupiah(item.unitCost)}`,
            `Harga total: ${rupiah(amount)}`,
          ]
        : [
            `Jumlah: ${item.quantity.toLocaleString("id-ID")} barang`,
            `Harga satuan: ${rupiah(item.unitCost)}`,
            `Harga total: ${rupiah(amount)}`,
          ];
      next.push(
        customerBudgetSchema.parse({
          ...old,
          id,
          title: item.title,
          amount,
          category: catering ? "Katering" : "Seserahan",
          source: { kind, id: item.id },
          notes: item.notes?.trim() ?? "",
          sourceDetails: details.join("\n"),
          ...(catering && item.dueDate !== undefined ? { dueDate: item.dueDate || undefined } : {}),
          purpose: old?.purpose ?? (catering ? "Kebutuhan katering acara" : "Kebutuhan seserahan"),
          priority: old?.priority ?? "Normal",
          completed: old?.completed ?? false,
          ...(old?.createdAt || now ? { createdAt: old?.createdAt ?? now } : {}),
        }),
      );
    }
  }
  for (const row of previous)
    if (
      row.source &&
      !wanted.has(row.id) &&
      (row.completed || allocations.some((entry) => entry.budgetId === row.id))
    )
      throw new Error("Batalkan alokasi pada Anggaran sebelum menghapus kebutuhan ini.");
  if (next.length > 10000) throw new Error("Jumlah anggaran maksimal 10.000 kebutuhan.");
  const resolved = new Map(next.map((row) => [row.id, row]));
  return [
    ...previous.flatMap((row) => (resolved.has(row.id) ? [resolved.get(row.id)!] : [])),
    ...next.filter((row) => !previousById.has(row.id)),
  ];
}
