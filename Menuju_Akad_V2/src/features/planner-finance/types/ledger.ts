import type { AllocationAccount, DepositItem, ExpenseItem, InternalTransfer } from "./finance";

export type LedgerState = {
  accounts: AllocationAccount[];
  deposits: DepositItem[];
  expenses: ExpenseItem[];
  transfers: InternalTransfer[];
};

export type LedgerResult<T = unknown> = {
  success: boolean;
  state: LedgerState;
  error?: string;
  data?: T;
};
