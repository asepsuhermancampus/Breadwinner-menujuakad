import type {
  AllocationAccount,
  DepositItem,
  ExpenseItem,
  InternalTransfer,
} from "../types/finance";

export function formatRupiah(amount: number): string {
  const formatted = new Intl.NumberFormat("id-ID").format(Math.abs(amount));
  return `${amount < 0 ? "-Rp " : "Rp "}${formatted}`;
}

export function calculateFinanceSummary(
  targetAmount: number,
  deposits: DepositItem[],
  expenses: ExpenseItem[],
  accounts: AllocationAccount[],
) {
  const totalContributed = deposits.reduce((sum, d) => sum + d.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const eventFundExpenses = expenses
    .filter((e) => e.fundingScope === "event_fund")
    .reduce((sum, e) => sum + e.amount, 0);

  const cashRemaining = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const planRemaining = Math.max(0, targetAmount - totalExpenses);
  const gapAmount = Math.max(0, targetAmount - totalContributed);
  const fundedPercent = targetAmount > 0 ? Math.round((totalContributed / targetAmount) * 100) : 0;

  return {
    targetAmount,
    totalContributed,
    totalExpenses,
    eventFundExpenses,
    cashRemaining,
    planRemaining,
    gapAmount,
    fundedPercent,
  };
}

export function calculateTargetSimulation(
  gapAmount: number,
  periods: number,
  andiRatio: number,
  risaRatio: number,
) {
  const safePeriods = Math.max(1, periods);
  const perPeriod = Math.round(gapAmount / safePeriods);
  const andiPerPeriod = Math.round((perPeriod * andiRatio) / 100);
  const risaPerPeriod = Math.round((perPeriod * risaRatio) / 100);

  return {
    gapAmount,
    periods: safePeriods,
    perPeriod,
    andiPerPeriod,
    risaPerPeriod,
  };
}

export function simulateTransfer(
  accounts: AllocationAccount[],
  fromId: string,
  toId: string,
  amount: number,
): { accounts: AllocationAccount[]; valid: boolean; error?: string } {
  if (fromId === toId) {
    return { accounts, valid: false, error: "Rekening asal dan tujuan tidak boleh sama." };
  }
  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return { accounts, valid: false, error: "Nominal mutasi harus lebih besar dari Rp 0." };
  }
  const fromAcc = accounts.find((a) => a.id === fromId);
  const toAcc = accounts.find((a) => a.id === toId);
  if (!fromAcc || !toAcc) {
    return { accounts, valid: false, error: "Rekening asal atau tujuan tidak valid." };
  }
  if (fromAcc.currentBalance < amount) {
    return { accounts, valid: false, error: "Saldo rekening asal tidak mencukupi." };
  }

  const updated = accounts.map((acc) => {
    if (acc.id === fromId) return { ...acc, currentBalance: acc.currentBalance - amount };
    if (acc.id === toId) return { ...acc, currentBalance: acc.currentBalance + amount };
    return acc;
  });

  return { accounts: updated, valid: true };
}

export function simulateCorrection(
  accounts: AllocationAccount[],
  originalTransfer: InternalTransfer,
  newAmount: number,
): { accounts: AllocationAccount[]; valid: boolean; error?: string } {
  if (!Number.isSafeInteger(newAmount) || newAmount <= 0) {
    return { accounts, valid: false, error: "Nominal koreksi harus lebih besar dari Rp 0." };
  }
  const fromAcc = accounts.find((a) => a.id === originalTransfer.fromAccountId);
  const toAcc = accounts.find((a) => a.id === originalTransfer.toAccountId);
  if (!fromAcc || !toAcc) {
    return { accounts, valid: false, error: "Rekening transfer tidak ditemukan." };
  }
  const delta = newAmount - originalTransfer.amount;
  if (delta > 0 && fromAcc.currentBalance < delta) {
    return { accounts, valid: false, error: "Saldo rekening asal tidak mencukupi." };
  }
  if (delta < 0 && toAcc.currentBalance < -delta) {
    return {
      accounts,
      valid: false,
      error: "Saldo rekening tujuan tidak mencukupi untuk pengurangan.",
    };
  }

  const updated = accounts.map((acc) => {
    if (acc.id === originalTransfer.fromAccountId) {
      return { ...acc, currentBalance: acc.currentBalance - delta };
    }
    if (acc.id === originalTransfer.toAccountId) {
      return { ...acc, currentBalance: acc.currentBalance + delta };
    }
    return acc;
  });

  return { accounts: updated, valid: true };
}
