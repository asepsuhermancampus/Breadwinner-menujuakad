import type { CustomerBudget } from "./customer-budget";

export type SavingsSide = "groom" | "bride";
export type FinanceMember = { actorId: string; actorName: string; side: SavingsSide };
export type FinanceEntry = {
  id: string;
  side: SavingsSide;
  amount: number;
  kind: "deposit" | "withdrawal" | "allocation" | "reversal";
  source: string;
  notes: string;
  createdAt: string;
  actorId: string;
  actorName: string;
  budgetId: string | null;
  reverses: string | null;
};
export type FinanceAllocation = {
  budgetId: string;
  entryId: string;
  side: SavingsSide;
  amount: number;
};
export type FinanceReceipt = { requestId: string; actorId: string; fingerprint: string };
export type FinanceBook = {
  id: "finance-book";
  revision: number;
  members: FinanceMember[];
  entries: FinanceEntry[];
  allocations: FinanceAllocation[];
  receipts: FinanceReceipt[];
};
export type FinanceSnapshot = {
  revision: number;
  budgets: CustomerBudget[];
  members: FinanceMember[];
  entries: FinanceEntry[];
  allocations: FinanceAllocation[];
  balances: { groom: number; bride: number; total: number };
  actorSide: SavingsSide | null;
  sideNames?: { groom: string; bride: string };
};
export type FinanceCommand =
  | { type: "claim"; side: SavingsSide }
  | {
      type: "entry";
      side: SavingsSide;
      direction: "add" | "subtract";
      amount: number;
      source: string;
      notes: string;
    }
  | { type: "save-budgets"; budgets: CustomerBudget[] }
  | { type: "allocate"; budgetId: string; side: SavingsSide }
  | { type: "release"; budgetId: string }
  | { type: "delete-budget"; budgetId: string };
export type FinanceRequest = { revision: number; requestId: string; command: FinanceCommand };
export type FinanceActor = { id: string; name: string };
