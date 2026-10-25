"use client";

import type {
  AllocationAccount,
  BudgetItem,
  DepositItem,
  ExpenseItem,
  FinanceTabKey,
  InstallmentItem,
  InternalTransfer,
} from "../types/finance";
import { AccountsTab } from "./accounts-tab";
import { BudgetTab } from "./budget-tab";
import { ExpensesTab } from "./expenses-tab";
import { FinanceTabs } from "./finance-tabs";
import { InstallmentsTab } from "./installments-tab";
import { OverviewTab } from "./overview-tab";
import { ReportsTab } from "./reports-tab";
import { SavingsTab } from "./savings-tab";

type Props = {
  activeTab: FinanceTabKey;
  setActiveTab: (tab: FinanceTabKey) => void;
  summary: {
    targetAmount: number;
    totalContributed: number;
    totalExpenses: number;
    cashRemaining: number;
    planRemaining: number;
    gapAmount: number;
    fundedPercent: number;
  };
  deposits: DepositItem[];
  categories: BudgetItem[];
  installments: InstallmentItem[];
  accounts: AllocationAccount[];
  expenses: ExpenseItem[];
  transfers: InternalTransfer[];
  targetAmount: number;
  onOpenRecordDeposit: () => void;
  onOpenTargetSimulator: () => void;
  onUpdateCategory: (id: string, newPlanned: number) => void;
  onOpenConflictDialog: () => void;
  onOpenRecordExpense: () => void;
  onSelectExpense: (item: ExpenseItem) => void;
  onOpenExport: () => void;
  onOpenImport: () => void;
  onExecuteTransfer: (
    fromId: string,
    toId: string,
    amount: number,
  ) => { success?: boolean; error?: string } | void;
  onExecuteCorrection: (newAmount: number) => { success?: boolean; error?: string } | void;
};

export function WeddingTabsView({
  activeTab,
  setActiveTab,
  summary,
  deposits,
  categories,
  installments,
  accounts,
  expenses,
  transfers,
  targetAmount,
  onOpenRecordDeposit,
  onOpenTargetSimulator,
  onUpdateCategory,
  onOpenConflictDialog,
  onOpenRecordExpense,
  onSelectExpense,
  onOpenExport,
  onOpenImport,
  onExecuteTransfer,
  onExecuteCorrection,
}: Props) {
  return (
    <>
      <FinanceTabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "ringkasan" && (
        <OverviewTab
          summary={summary}
          deposits={deposits}
          categories={categories}
          installments={installments}
          accounts={accounts}
        />
      )}
      {activeTab === "tabungan" && (
        <SavingsTab
          deposits={deposits}
          expenses={expenses}
          summary={summary}
          onOpenRecordDeposit={onOpenRecordDeposit}
          onOpenTargetSimulator={onOpenTargetSimulator}
        />
      )}
      {activeTab === "anggaran" && (
        <BudgetTab
          categories={categories}
          targetAmount={targetAmount}
          onUpdateCategory={onUpdateCategory}
          onOpenConflictDialog={onOpenConflictDialog}
        />
      )}
      {activeTab === "pengeluaran" && (
        <ExpensesTab
          expenses={expenses}
          cashRemaining={summary.cashRemaining}
          planRemaining={summary.planRemaining}
          onOpenRecordExpense={onOpenRecordExpense}
          onSelectExpense={onSelectExpense}
        />
      )}
      {activeTab === "termin" && (
        <InstallmentsTab
          installments={installments}
          cashRemaining={summary.cashRemaining}
          gapAmount={summary.gapAmount}
          onOpenTargetSimulator={onOpenTargetSimulator}
        />
      )}
      {activeTab === "laporan" && (
        <ReportsTab
          deposits={deposits}
          expenses={expenses}
          cashRemaining={summary.cashRemaining}
          onOpenExport={onOpenExport}
          onOpenImport={onOpenImport}
        />
      )}
      {activeTab === "rekening" && (
        <AccountsTab
          accounts={accounts}
          transfers={transfers}
          totalContributed={summary.totalContributed}
          totalExpenses={summary.totalExpenses}
          cashRemaining={summary.cashRemaining}
          onExecuteTransfer={onExecuteTransfer}
          onExecuteCorrection={onExecuteCorrection}
        />
      )}
    </>
  );
}
