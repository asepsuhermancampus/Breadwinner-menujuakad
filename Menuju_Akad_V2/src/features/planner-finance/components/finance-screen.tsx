"use client";

import type {
  AllocationAccount,
  BudgetItem,
  DepositItem,
  EngagementFinanceData,
  ExpenseItem,
  InstallmentItem,
  InternalTransfer,
} from "../types/finance";
import { useFinanceState } from "../hooks/use-finance-state";
import { AccountsTab } from "./accounts-tab";
import { BudgetTab } from "./budget-tab";
import { EngagementFinanceView } from "./engagement-finance-view";
import { ExpensesTab } from "./expenses-tab";
import { FinanceDialogs } from "./finance-dialogs";
import { FinanceHeader } from "./finance-header";
import { FinanceTabs } from "./finance-tabs";
import { InstallmentsTab } from "./installments-tab";
import { OverviewTab } from "./overview-tab";
import { ReportsTab } from "./reports-tab";
import { SavingsTab } from "./savings-tab";
import styles from "./finance.module.css";

type Props = {
  initialAccounts: AllocationAccount[];
  initialDeposits: DepositItem[];
  initialExpenses: ExpenseItem[];
  initialCategories: BudgetItem[];
  initialInstallments: InstallmentItem[];
  initialTransfers: InternalTransfer[];
  initialEngagement: EngagementFinanceData;
};

export function FinanceScreen({
  initialAccounts,
  initialDeposits,
  initialExpenses,
  initialCategories,
  initialInstallments,
  initialTransfers,
  initialEngagement,
}: Props) {
  const {
    eventContext,
    setEventContext,
    activeTab,
    setActiveTab,
    accounts,
    deposits,
    expenses,
    categories,
    installments,
    transfers,
    targetAmount,
    setTargetAmount,
    summary,
    recordExpenseOpen,
    setRecordExpenseOpen,
    recordDepositOpen,
    setRecordDepositOpen,
    targetSimulatorOpen,
    setTargetSimulatorOpen,
    conflictDialogOpen,
    setConflictDialogOpen,
    selectedExpense,
    setSelectedExpense,
    exportDialogOpen,
    setExportDialogOpen,
    importWizardOpen,
    setImportWizardOpen,
    handleSaveExpense,
    handleSaveDeposit,
    handleUpdateCategory,
    handleExecuteTransfer,
    handleExecuteCorrection,
  } = useFinanceState({
    initialAccounts,
    initialDeposits,
    initialExpenses,
    initialCategories,
    initialInstallments,
    initialTransfers,
  });

  return (
    <div className={styles.container}>
      <FinanceHeader
        eventContext={eventContext}
        onToggleContext={() =>
          setEventContext((prev) => (prev === "wedding" ? "engagement" : "wedding"))
        }
        onOpenRecordExpense={() => setRecordExpenseOpen(true)}
        onOpenRecordDeposit={() => setRecordDepositOpen(true)}
      />

      {eventContext === "engagement" ? (
        <EngagementFinanceView data={initialEngagement} />
      ) : (
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
              summary={summary}
              onOpenRecordDeposit={() => setRecordDepositOpen(true)}
              onOpenTargetSimulator={() => setTargetSimulatorOpen(true)}
            />
          )}
          {activeTab === "anggaran" && (
            <BudgetTab
              categories={categories}
              targetAmount={targetAmount}
              onUpdateCategory={handleUpdateCategory}
              onOpenConflictDialog={() => setConflictDialogOpen(true)}
            />
          )}
          {activeTab === "pengeluaran" && (
            <ExpensesTab
              expenses={expenses}
              cashRemaining={summary.cashRemaining}
              planRemaining={summary.planRemaining}
              onOpenRecordExpense={() => setRecordExpenseOpen(true)}
              onSelectExpense={setSelectedExpense}
            />
          )}
          {activeTab === "termin" && (
            <InstallmentsTab
              installments={installments}
              cashRemaining={summary.cashRemaining}
              gapAmount={summary.gapAmount}
              onOpenTargetSimulator={() => setTargetSimulatorOpen(true)}
            />
          )}
          {activeTab === "laporan" && (
            <ReportsTab
              deposits={deposits}
              expenses={expenses}
              cashRemaining={summary.cashRemaining}
              onOpenExport={() => setExportDialogOpen(true)}
              onOpenImport={() => setImportWizardOpen(true)}
            />
          )}
          {activeTab === "rekening" && (
            <AccountsTab
              accounts={accounts}
              transfers={transfers}
              totalContributed={summary.totalContributed}
              totalExpenses={summary.totalExpenses}
              cashRemaining={summary.cashRemaining}
              onExecuteTransfer={handleExecuteTransfer}
              onExecuteCorrection={handleExecuteCorrection}
            />
          )}
        </>
      )}

      <FinanceDialogs
        accounts={accounts}
        deposits={deposits}
        expenses={expenses}
        categoryNames={categories.map((c) => c.name)}
        totalContributed={summary.totalContributed}
        cashRemaining={summary.cashRemaining}
        totalExpenses={summary.totalExpenses}
        targetAmount={targetAmount}
        recordExpenseOpen={recordExpenseOpen}
        onCloseRecordExpense={() => setRecordExpenseOpen(false)}
        onSaveExpense={handleSaveExpense}
        recordDepositOpen={recordDepositOpen}
        onCloseRecordDeposit={() => setRecordDepositOpen(false)}
        onSaveDeposit={handleSaveDeposit}
        targetSimulatorOpen={targetSimulatorOpen}
        onCloseTargetSimulator={() => setTargetSimulatorOpen(false)}
        onSavePlan={setTargetAmount}
        conflictDialogOpen={conflictDialogOpen}
        onCloseConflictDialog={() => setConflictDialogOpen(false)}
        onResolveConflict={(amt) => handleUpdateCategory("b-1", amt)}
        selectedExpense={selectedExpense}
        onCloseExpenseInspector={() => setSelectedExpense(null)}
        exportDialogOpen={exportDialogOpen}
        onCloseExportDialog={() => setExportDialogOpen(false)}
        importWizardOpen={importWizardOpen}
        onCloseImportWizard={() => setImportWizardOpen(false)}
        onImportExpenses={(items) => items.forEach((i) => handleSaveExpense(i))}
      />
    </div>
  );
}
