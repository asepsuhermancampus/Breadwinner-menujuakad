import type { BudgetPriority, CustomerBudget } from "../types/customer-budget";
import { customerBudgetSchema } from "./customer-budget-schema";

export type BudgetStatusFilter = "Semua" | "Belum tercapai" | "Tercapai";
export type BudgetDueFilter = "Semua" | "Mendatang" | "Lewat tenggat" | "Tanpa tenggat";
export type BudgetFilters = {
  status: BudgetStatusFilter;
  priority: BudgetPriority | "Semua";
  due: BudgetDueFilter;
  query: string;
};
export type BudgetDraft = {
  title: string;
  amount: string;
  purpose: string;
  dueDate: string;
  priority: BudgetPriority;
  notes: string;
  completed: boolean;
};

export function jakartaToday(now = new Date()) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(now);
}

export function filterCustomerBudgets(
  items: CustomerBudget[],
  filters: BudgetFilters,
  today = jakartaToday(),
) {
  const query = filters.query.trim().toLocaleLowerCase("id-ID");
  return items.filter((item) => {
    if (filters.status === "Tercapai" && !item.completed) return false;
    if (filters.status === "Belum tercapai" && item.completed) return false;
    if (filters.priority !== "Semua" && (item.priority ?? "Normal") !== filters.priority)
      return false;
    if (filters.due === "Tanpa tenggat" && item.dueDate) return false;
    if (filters.due === "Mendatang" && (!item.dueDate || item.dueDate < today)) return false;
    if (
      filters.due === "Lewat tenggat" &&
      (item.completed || !item.dueDate || item.dueDate >= today)
    )
      return false;
    return [item.title, item.purpose, item.notes]
      .join(" ")
      .toLocaleLowerCase("id-ID")
      .includes(query);
  });
}

export function summarizeBudgets(items: CustomerBudget[]) {
  return items.reduce(
    (summary, item) => {
      const target = item.amount ?? 0;
      summary.totalTarget += target;
      summary.total += 1;
      if (item.completed) summary.achieved += 1;
      else {
        summary.pending += 1;
        summary.pendingTarget += target;
      }
      return summary;
    },
    { totalTarget: 0, pendingTarget: 0, total: 0, achieved: 0, pending: 0 },
  );
}

export function createBudgetDraft(item?: CustomerBudget, duplicate = false): BudgetDraft {
  return {
    title: duplicate ? `Salinan ${item?.title ?? "anggaran"}`.slice(0, 160) : (item?.title ?? ""),
    amount: item?.amount === undefined ? "" : String(item.amount),
    purpose: item?.purpose ?? "",
    dueDate: item?.dueDate ?? "",
    priority: item?.priority ?? "Normal",
    notes: item?.notes ?? "",
    completed: duplicate ? false : (item?.completed ?? false),
  };
}

export function buildCustomerBudget(
  draft: BudgetDraft,
  original: CustomerBudget | undefined,
  identity: { id: string; createdAt: string },
): CustomerBudget {
  if (!draft.title.trim() || draft.title.trim().length > 160)
    throw new Error("Isi nama anggaran, maksimal 160 karakter.");
  const amount = Number(draft.amount);
  if (!draft.amount.trim() || !Number.isSafeInteger(amount) || amount < 0 || amount > 1e12)
    throw new Error("Target harus berupa rupiah utuh antara 0 dan 1.000.000.000.000.");
  const next: CustomerBudget = {
    ...original,
    ...(original ? {} : identity),
    id: original?.id ?? identity.id,
    title: draft.title.trim(),
    amount,
    purpose: draft.purpose.trim(),
    priority: draft.priority,
    notes: draft.notes,
    completed: draft.completed,
  };
  if (draft.dueDate) next.dueDate = draft.dueDate;
  else delete next.dueDate;
  if (!customerBudgetSchema.safeParse(next).success)
    throw new Error("Periksa tujuan, deskripsi, prioritas, dan tanggal tenggat anggaran.");
  return next;
}
