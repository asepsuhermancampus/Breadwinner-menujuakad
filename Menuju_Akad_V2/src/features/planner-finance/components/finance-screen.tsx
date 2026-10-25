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
import { EngagementFinanceView } from "./engagement-finance-view";
import { FinanceDialogs } from "./finance-dialogs";
import { FinanceHeader } from "./finance-header";
import { WeddingTabsView } from "./wedding-tabs-view";
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
    handleImportExpenses,
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
        <WeddingTabsView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          summary={summary}
          deposits={deposits}
          categories={categories}
          installments={installments}
          accounts={accounts}
          expenses={expenses}
          transfers={transfers}
          targetAmount={targetAmount}
          onOpenRecordDeposit={() => setRecordDepositOpen(true)}
          onOpenTargetSimulator={() => setTargetSimulatorOpen(true)}
          onUpdateCategory={handleUpdateCategory}
          onOpenConflictDialog={() => setConflictDialogOpen(true)}
          onOpenRecordExpense={() => setRecordExpenseOpen(true)}
          onSelectExpense={setSelectedExpense}
          onOpenExport={() => setExportDialogOpen(true)}
          onOpenImport={() => setImportWizardOpen(true)}
          onExecuteTransfer={handleExecuteTransfer}
          onExecuteCorrection={handleExecuteCorrection}
        />
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
        onImportExpenses={handleImportExpenses}
      />
    </div>
  );
}
