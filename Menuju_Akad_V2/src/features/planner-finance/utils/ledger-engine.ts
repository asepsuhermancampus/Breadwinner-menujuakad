import type { DepositItem, ExpenseItem } from "../types/finance";
import type { LedgerResult, LedgerState } from "../types/ledger";
import {
  applyCorrection,
  applyTransfer,
  getNextTransferId,
  isPositiveSafeInt,
} from "./ledger-transfer-ops";

export { applyCorrection, applyTransfer, getNextTransferId, isPositiveSafeInt };
export type { LedgerResult, LedgerState };

export function getNextExpenseId(expenses: ExpenseItem[]): string {
  const max = expenses.reduce((highest, e) => {
    const match = e.id.match(/^EX-(\d+)$/i);
    const numStr = match?.[1];
    return numStr ? Math.max(highest, parseInt(numStr, 10)) : highest;
  }, 1000);
  return `EX-${max + 1}`;
}

export function getNextDepositId(deposits: DepositItem[]): string {
  const max = deposits.reduce((highest, d) => {
    const match = d.id.match(/^d-(\d+)$/i);
    const numStr = match?.[1];
    return numStr ? Math.max(highest, parseInt(numStr, 10)) : highest;
  }, 0);
  return `d-${max + 1}`;
}

export function applyExpense(
  state: LedgerState,
  item: Omit<ExpenseItem, "id">,
): LedgerResult<ExpenseItem> {
  if (!isPositiveSafeInt(item.amount)) {
    return { success: false, state, error: "Nominal pengeluaran harus berupa bilangan positif." };
  }
  let updatedAccounts = state.accounts;
  if (item.fundingScope === "event_fund") {
    if (!item.accountId) {
      return { success: false, state, error: "Rekening alokasi harus dipilih." };
    }
    const acc = state.accounts.find((a) => a.id === item.accountId);
    if (!acc) {
      return { success: false, state, error: "Rekening alokasi tidak ditemukan." };
    }
    if (acc.currentBalance < item.amount) {
      return {
        success: false,
        state,
        error: `Saldo ${acc.name} tidak mencukupi (Rp ${acc.currentBalance.toLocaleString("id-ID")} < Rp ${item.amount.toLocaleString("id-ID")}).`,
      };
    }
    updatedAccounts = state.accounts.map((a) =>
      a.id === item.accountId ? { ...a, currentBalance: a.currentBalance - item.amount } : a,
    );
  }
  const newExpense: ExpenseItem = { ...item, id: getNextExpenseId(state.expenses) };
  return {
    success: true,
    state: { ...state, accounts: updatedAccounts, expenses: [newExpense, ...state.expenses] },
    data: newExpense,
  };
}

export function applyExpenseBatch(
  state: LedgerState,
  items: Omit<ExpenseItem, "id">[],
): LedgerResult<ExpenseItem[]> {
  if (items.length === 0) return { success: true, state, data: [] };
  for (const item of items) {
    if (!isPositiveSafeInt(item.amount)) {
      return {
        success: false,
        state,
        error: `Nominal "${item.title}" harus berupa bilangan positif.`,
      };
    }
  }
  const deductions = new Map<string, number>();
  for (const item of items) {
    if (item.fundingScope === "event_fund") {
      if (!item.accountId) {
        return { success: false, state, error: "Rekening alokasi wajib ditentukan." };
      }
      const prev = deductions.get(item.accountId) || 0;
      const totalNeeded = prev + item.amount;
      if (!Number.isSafeInteger(totalNeeded)) {
        return {
          success: false,
          state,
          error: "Total pengeluaran melampaui batas maksimum yang aman.",
        };
      }
      deductions.set(item.accountId, totalNeeded);
    }
  }
  for (const [accId, needed] of deductions.entries()) {
    const acc = state.accounts.find((a) => a.id === accId);
    if (!acc) return { success: false, state, error: "Rekening alokasi tidak ditemukan." };
    if (acc.currentBalance < needed) {
      return {
        success: false,
        state,
        error: `Saldo ${acc.name} tidak mencukupi untuk total impor (Rp ${acc.currentBalance.toLocaleString("id-ID")} < Rp ${needed.toLocaleString("id-ID")}).`,
      };
    }
  }
  const updatedAccounts = state.accounts.map((a) => {
    const needed = deductions.get(a.id);
    return needed ? { ...a, currentBalance: a.currentBalance - needed } : a;
  });
  let currentExpenses = [...state.expenses];
  const createdList: ExpenseItem[] = [];
  for (const item of items) {
    const created: ExpenseItem = { ...item, id: getNextExpenseId(currentExpenses) };
    createdList.push(created);
    currentExpenses = [created, ...currentExpenses];
  }
  return {
    success: true,
    state: { ...state, accounts: updatedAccounts, expenses: currentExpenses },
    data: createdList,
  };
}

export function applyDeposit(
  state: LedgerState,
  item: Omit<DepositItem, "id">,
): LedgerResult<DepositItem> {
  if (!isPositiveSafeInt(item.amount)) {
    return { success: false, state, error: "Nominal setoran harus berupa bilangan positif." };
  }
  const acc = state.accounts.find((a) => a.id === item.accountId);
  if (!acc) return { success: false, state, error: "Rekening tujuan tidak ditemukan." };
  const nextBalance = acc.currentBalance + item.amount;
  if (!Number.isSafeInteger(nextBalance)) {
    return { success: false, state, error: "Saldo rekening melampaui batas maksimum yang aman." };
  }
  const newDeposit: DepositItem = { ...item, id: getNextDepositId(state.deposits) };
  const updatedAccounts = state.accounts.map((a) =>
    a.id === item.accountId ? { ...a, currentBalance: nextBalance } : a,
  );
  return {
    success: true,
    state: { ...state, accounts: updatedAccounts, deposits: [...state.deposits, newDeposit] },
    data: newDeposit,
  };
}
