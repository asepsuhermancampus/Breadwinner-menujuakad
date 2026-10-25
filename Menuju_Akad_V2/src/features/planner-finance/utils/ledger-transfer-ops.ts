import type { InternalTransfer } from "../types/finance";
import type { LedgerResult, LedgerState } from "../types/ledger";

export function isPositiveSafeInt(val: number): boolean {
  return typeof val === "number" && Number.isSafeInteger(val) && val > 0;
}

export function getNextTransferId(transfers: InternalTransfer[]): string {
  const max = transfers.reduce((highest, t) => {
    const match = t.id.match(/^MT-(\d+)$/i);
    const numStr = match?.[1];
    return numStr ? Math.max(highest, parseInt(numStr, 10)) : highest;
  }, 0);
  return `MT-${String(max + 1).padStart(3, "0")}`;
}

export function applyTransfer(
  state: LedgerState,
  fromId: string,
  toId: string,
  amount: number,
): LedgerResult<InternalTransfer> {
  if (fromId === toId) {
    return { success: false, state, error: "Rekening asal dan tujuan tidak boleh sama." };
  }
  if (!isPositiveSafeInt(amount)) {
    return { success: false, state, error: "Nominal mutasi harus berupa bilangan positif." };
  }
  const fromAcc = state.accounts.find((a) => a.id === fromId);
  const toAcc = state.accounts.find((a) => a.id === toId);
  if (!fromAcc || !toAcc) {
    return { success: false, state, error: "Rekening asal atau tujuan tidak valid." };
  }
  if (fromAcc.currentBalance < amount) {
    return { success: false, state, error: "Saldo rekening asal tidak mencukupi." };
  }
  const nextToBalance = toAcc.currentBalance + amount;
  if (!Number.isSafeInteger(nextToBalance)) {
    return {
      success: false,
      state,
      error: "Saldo rekening tujuan melampaui batas maksimum yang aman.",
    };
  }
  const updatedAccounts = state.accounts.map((a) => {
    if (a.id === fromId) return { ...a, currentBalance: a.currentBalance - amount };
    if (a.id === toId) return { ...a, currentBalance: nextToBalance };
    return a;
  });
  const transferId = getNextTransferId(state.transfers);
  const newTransfer: InternalTransfer = {
    id: transferId,
    fromAccountId: fromId,
    toAccountId: toId,
    fromAccountName: fromAcc.name,
    toAccountName: toAcc.name,
    amount,
    date: "25 Okt 2026",
    reason: "Mutasi alokasi internal",
    recordedBy: "Risa",
    idempotencyKey: `MUT:AR:${Date.now()}:${transferId}`,
  };
  return {
    success: true,
    state: { ...state, accounts: updatedAccounts, transfers: [...state.transfers, newTransfer] },
    data: newTransfer,
  };
}

export function applyCorrection(
  state: LedgerState,
  newAmount: number,
  transferId?: string,
): LedgerResult<InternalTransfer> {
  if (!isPositiveSafeInt(newAmount)) {
    return { success: false, state, error: "Nominal koreksi harus lebih besar dari Rp 0." };
  }
  const targetTransfer = transferId
    ? state.transfers.find((t) => t.id.toLowerCase() === transferId.toLowerCase())
    : state.transfers[0];
  if (!targetTransfer) return { success: false, state, error: "Catatan mutasi tidak ditemukan." };
  const fromAcc = state.accounts.find((a) => a.id === targetTransfer.fromAccountId);
  const toAcc = state.accounts.find((a) => a.id === targetTransfer.toAccountId);
  if (!fromAcc || !toAcc) {
    return { success: false, state, error: "Rekening mutasi tidak ditemukan." };
  }
  const currentAmount = targetTransfer.amount;
  const delta = newAmount - currentAmount;
  if (delta === 0) return { success: true, state, data: targetTransfer };
  if (delta > 0) {
    if (fromAcc.currentBalance < delta) {
      return { success: false, state, error: "Saldo rekening asal tidak mencukupi untuk koreksi." };
    }
    const nextToBalance = toAcc.currentBalance + delta;
    if (!Number.isSafeInteger(nextToBalance)) {
      return {
        success: false,
        state,
        error: "Saldo rekening tujuan melampaui batas maksimum yang aman.",
      };
    }
  }
  if (delta < 0) {
    if (toAcc.currentBalance < -delta) {
      return {
        success: false,
        state,
        error: "Saldo rekening tujuan tidak mencukupi untuk pengurangan nominal.",
      };
    }
    const nextFromBalance = fromAcc.currentBalance - delta;
    if (!Number.isSafeInteger(nextFromBalance)) {
      return {
        success: false,
        state,
        error: "Saldo rekening asal melampaui batas maksimum yang aman.",
      };
    }
  }
  const updatedAccounts = state.accounts.map((a) => {
    if (a.id === targetTransfer.fromAccountId)
      return { ...a, currentBalance: a.currentBalance - delta };
    if (a.id === targetTransfer.toAccountId)
      return { ...a, currentBalance: a.currentBalance + delta };
    return a;
  });
  const originalAmount = targetTransfer.originalAmount ?? targetTransfer.amount;
  const updatedTransfer: InternalTransfer = {
    ...targetTransfer,
    amount: newAmount,
    originalAmount,
    correctionHistory: [
      ...(targetTransfer.correctionHistory || []),
      { date: "25 Okt 2026", previousAmount: currentAmount, newAmount, reason: "Koreksi mutasi" },
    ],
  };
  return {
    success: true,
    state: {
      ...state,
      accounts: updatedAccounts,
      transfers: state.transfers.map((t) => (t.id === targetTransfer.id ? updatedTransfer : t)),
    },
    data: updatedTransfer,
  };
}
