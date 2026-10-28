import { financeRequestSchema, rupiah } from "./finance-ledger-schema";
export { financeRequestSchema, financeBookSchema } from "./finance-ledger-schema";

import type { CustomerBudget } from "../types/customer-budget";
import type {
  FinanceActor,
  FinanceAllocation,
  FinanceBook,
  FinanceRequest,
  FinanceSnapshot,
} from "../types/finance-ledger";

export function emptyFinanceBook(): FinanceBook {
  return {
    id: "finance-book",
    revision: 0,
    members: [],
    entries: [],
    allocations: [],
    receipts: [],
  };
}
export function financeSnapshot(
  book: FinanceBook,
  budgets: CustomerBudget[],
  actorId: string,
): FinanceSnapshot {
  const balances = { groom: 0, bride: 0, total: 0 };
  for (const entry of book.entries) {
    balances[entry.side] += entry.amount;
    balances.total += entry.amount;
    if (!Number.isSafeInteger(balances[entry.side]) || !Number.isSafeInteger(balances.total))
      throw new Error("Saldo tabungan melebihi batas rupiah yang dapat dihitung tepat.");
  }
  return {
    revision: book.revision,
    budgets,
    members: book.members,
    entries: book.entries,
    allocations: book.allocations,
    balances,
    actorSide: book.members.find((member) => member.actorId === actorId)?.side ?? null,
  };
}
export function assertBudgetChanges(
  previous: CustomerBudget[],
  next: CustomerBudget[],
  allocations: FinanceAllocation[],
): void {
  for (const row of next) {
    const old = previous.find((item) => item.id === row.id);
    if (row.completed && !old?.completed)
      throw new Error("Tandai anggaran selesai melalui alokasi tabungan.");
  }
  for (const allocation of allocations) {
    const old = previous.find((row) => row.id === allocation.budgetId);
    const row = next.find((item) => item.id === allocation.budgetId);
    if (!row || !row.completed || row.amount !== old?.amount || row.amount !== allocation.amount)
      throw new Error(
        "Lepaskan alokasi sebelum mengubah nominal, status, atau menghapus anggaran.",
      );
  }
}
export function applyFinanceRequest(
  book: FinanceBook,
  budgets: CustomerBudget[],
  actor: FinanceActor,
  raw: FinanceRequest,
  now: string,
): { book: FinanceBook; budgets: CustomerBudget[] } {
  actor = { ...actor, name: actor.name.trim().slice(0, 160) || "Pasangan" };
  const parsed = financeRequestSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Perintah keuangan tidak valid.");
  const request = parsed.data;
  const fingerprint = JSON.stringify(request.command);
  const receipt = book.receipts.find((item) => item.requestId === request.requestId);
  if (receipt) {
    if (receipt.actorId !== actor.id || receipt.fingerprint !== fingerprint)
      throw new Error("ID permintaan telah digunakan untuk perintah lain.");
    return { book, budgets };
  }
  if (request.revision !== book.revision)
    throw new Error("Data telah berubah. Muat ulang sebelum menyimpan.");
  const next = structuredClone(book);
  let rows = structuredClone(budgets);
  const command = request.command;
  const member = next.members.find((item) => item.actorId === actor.id);
  const append = (
    values: Pick<
      FinanceBook["entries"][number],
      "side" | "amount" | "kind" | "source" | "notes" | "budgetId" | "reverses"
    >,
  ) => {
    const balances = financeSnapshot(next, rows, actor.id).balances;
    if (
      !Number.isSafeInteger(balances[values.side] + values.amount) ||
      !Number.isSafeInteger(balances.total + values.amount)
    )
      throw new Error("Saldo tabungan melebihi batas rupiah yang dapat dihitung tepat.");
    next.entries.push({
      ...values,
      id: `${request.requestId}:entry`,
      createdAt: now,
      actorId: actor.id,
      actorName: actor.name,
    });
  };
  if (command.type === "claim") {
    if (member || next.members.some((item) => item.side === command.side))
      throw new Error("Akun atau sisi tabungan sudah terhubung.");
    next.members.push({ actorId: actor.id, actorName: actor.name, side: command.side });
  } else if (command.type === "save-budgets") {
    assertBudgetChanges(rows, command.budgets, next.allocations);
    rows = command.budgets;
  } else {
    if (!member) throw new Error("Pilih sisi tabungan akun terlebih dahulu.");
    if (command.type === "entry") {
      if (member.side !== command.side)
        throw new Error("Anda hanya dapat mengubah tabungan sisi akun sendiri.");
      if (command.direction === "add" && !command.source.trim())
        throw new Error("Sumber pemasukan wajib diisi.");
      if (command.direction === "subtract" && !command.notes.trim())
        throw new Error("Alasan pengeluaran wajib diisi.");
      const amount = command.direction === "add" ? command.amount : -command.amount;
      if (financeSnapshot(next, rows, actor.id).balances[command.side] + amount < 0)
        throw new Error("Saldo tabungan tidak mencukupi.");
      append({
        side: command.side,
        amount,
        kind: amount > 0 ? "deposit" : "withdrawal",
        source: command.source.trim(),
        notes: command.notes.trim(),
        budgetId: null,
        reverses: null,
      });
    } else {
      const row = rows.find((item) => item.id === command.budgetId);
      if (!row) throw new Error("Anggaran tidak ditemukan.");
      const allocation = next.allocations.find((item) => item.budgetId === row.id);
      if (command.type === "allocate") {
        if (allocation || row.completed)
          throw new Error("Anggaran sudah selesai atau telah dialokasikan.");
        if (!rupiah.safeParse(row.amount).success)
          throw new Error("Nominal anggaran harus berupa rupiah positif.");
        const amount = row.amount!;
        if (financeSnapshot(next, rows, actor.id).balances[command.side] < amount)
          throw new Error("Saldo tabungan tidak mencukupi.");
        append({
          side: command.side,
          amount: -amount,
          kind: "allocation",
          source: "Anggaran",
          notes: row.title.slice(0, 2000),
          budgetId: row.id,
          reverses: null,
        });
        next.allocations.push({
          budgetId: row.id,
          entryId: `${request.requestId}:entry`,
          side: command.side,
          amount,
        });
        row.completed = true;
      } else {
        if (allocation) {
          append({
            side: allocation.side,
            amount: allocation.amount,
            kind: "reversal",
            source: "Pelepasan anggaran",
            notes: row.title.slice(0, 2000),
            budgetId: row.id,
            reverses: allocation.entryId,
          });
          next.allocations = next.allocations.filter((item) => item.budgetId !== row.id);
        }
        row.completed = false;
        if (command.type === "delete-budget") rows = rows.filter((item) => item.id !== row.id);
      }
    }
  }
  next.revision += 1;
  next.receipts.push({ requestId: request.requestId, actorId: actor.id, fingerprint });
  return { book: next, budgets: rows };
}
