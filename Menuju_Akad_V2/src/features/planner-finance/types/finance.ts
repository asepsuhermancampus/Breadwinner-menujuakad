export type ContributorName = "Andi" | "Risa" | "Keluarga" | "Bersama";

export type FundingScope = "event_fund" | "external_private";

export type PaymentStatus = "dp" | "lunas" | "terjadwal" | "lewat_tempo";

export type BudgetItem = {
  id: string;
  name: string;
  plannedAmount: number;
  paidAmount: number;
  pic: ContributorName;
  version: number;
};

export type ExpenseItem = {
  id: string;
  title: string;
  category: string;
  amount: number;
  paidBy: ContributorName;
  fundingScope: FundingScope;
  accountId?: string | undefined;
  accountName?: string | undefined;
  date: string;
  status: PaymentStatus;
  proofName?: string | undefined;
  recordedBy: string;
  version: number;
  reversalOf?: string | undefined;
  replacementOf?: string | undefined;
  notes?: string | undefined;
};

export type DepositItem = {
  id: string;
  contributor: ContributorName;
  amount: number;
  accountId: string;
  accountName: string;
  date: string;
  reference?: string | undefined;
  proofName?: string | undefined;
};

export type InstallmentItem = {
  id: string;
  title: string;
  category: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  payer: string;
  note?: string | undefined;
};

export type AllocationAccount = {
  id: string;
  name: string;
  bank: string;
  maskedNumber: string;
  owner: string;
  openingBalance: number;
  currentBalance: number;
  cutOffDate: string;
  formulaNote?: string | undefined;
};

export type InternalTransfer = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  fromAccountName: string;
  toAccountName: string;
  amount: number;
  date: string;
  reason: string;
  recordedBy: string;
  idempotencyKey: string;
  originalAmount?: number | undefined;
  correctionHistory?:
    | {
        date: string;
        previousAmount: number;
        newAmount: number;
        reason?: string | undefined;
      }[]
    | undefined;
};

export type ContributionTarget = {
  targetAmount: number;
  periods: number;
  andiRatio: number;
  risaRatio: number;
};

export type FinanceTabKey =
  "ringkasan" | "tabungan" | "anggaran" | "pengeluaran" | "termin" | "laporan" | "rekening";

export type EventFinanceContext = "wedding" | "engagement";

export type EngagementFinanceData = {
  targetAmount: number;
  totalContributed: number;
  totalExpenses: number;
  cashRemaining: number;
  planRemaining: number;
  shortfallAmount: number;
  categories: {
    id: string;
    name: string;
    plannedAmount: number;
    paidAmount: number;
    pic: ContributorName;
  }[];
  weeklyInstallments: {
    date: string;
    amount: number;
    andiShare: number;
    risaShare: number;
  }[];
};
