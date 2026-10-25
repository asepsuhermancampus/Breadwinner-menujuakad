"use client";

import type { AllocationAccount, DepositItem, ExpenseItem } from "../types/finance";
import { BudgetConflictDialog } from "./budget-conflict-dialog";
import { CsvImportWizard } from "./csv-import-wizard";
import { DepositInspector } from "./deposit-inspector";
import { ExpenseInspector } from "./expense-inspector";
import { ExportReportDialog } from "./export-report-dialog";
import { RecordExpenseDialog } from "./record-expense-dialog";
import { TargetSimulatorDialog } from "./target-simulator-dialog";

type Props = {
  accounts: AllocationAccount[];
  deposits: DepositItem[];
  expenses: ExpenseItem[];
  categoryNames: string[];
  totalContributed: number;
  cashRemaining: number;
  totalExpenses: number;
  targetAmount: number;
  recordExpenseOpen: boolean;
  onCloseRecordExpense: () => void;
  onSaveExpense: (item: Omit<ExpenseItem, "id">) => { success?: boolean; error?: string } | void;
  recordDepositOpen: boolean;
  onCloseRecordDeposit: () => void;
  onSaveDeposit: (item: Omit<DepositItem, "id">) => { success?: boolean; error?: string } | void;
  targetSimulatorOpen: boolean;
  onCloseTargetSimulator: () => void;
  onSavePlan: (amt: number) => void;
  conflictDialogOpen: boolean;
  onCloseConflictDialog: () => void;
  onResolveConflict: (amt: number) => void;
  selectedExpense: ExpenseItem | null;
  onCloseExpenseInspector: () => void;
  exportDialogOpen: boolean;
  onCloseExportDialog: () => void;
  importWizardOpen: boolean;
  onCloseImportWizard: () => void;
  onImportExpenses: (
    items: Omit<ExpenseItem, "id">[],
  ) => { success?: boolean; error?: string } | void;
};

export function FinanceDialogs({
  accounts,
  deposits,
  expenses,
  categoryNames,
  totalContributed,
  cashRemaining,
  totalExpenses,
  targetAmount,
  recordExpenseOpen,
  onCloseRecordExpense,
  onSaveExpense,
  recordDepositOpen,
  onCloseRecordDeposit,
  onSaveDeposit,
  targetSimulatorOpen,
  onCloseTargetSimulator,
  onSavePlan,
  conflictDialogOpen,
  onCloseConflictDialog,
  onResolveConflict,
  selectedExpense,
  onCloseExpenseInspector,
  exportDialogOpen,
  onCloseExportDialog,
  importWizardOpen,
  onCloseImportWizard,
  onImportExpenses,
}: Props) {
  return (
    <>
      <DepositInspector
        open={recordDepositOpen}
        onClose={onCloseRecordDeposit}
        accounts={accounts}
        currentTotalContributed={totalContributed}
        onSave={onSaveDeposit}
      />
      <RecordExpenseDialog
        open={recordExpenseOpen}
        onClose={onCloseRecordExpense}
        accounts={accounts}
        currentCash={cashRemaining}
        currentTotalExpenses={totalExpenses}
        categories={categoryNames}
        onSaveExpense={onSaveExpense}
      />
      <TargetSimulatorDialog
        open={targetSimulatorOpen}
        onClose={onCloseTargetSimulator}
        targetAmount={targetAmount}
        totalContributed={totalContributed}
        onSavePlan={onSavePlan}
      />
      <BudgetConflictDialog
        open={conflictDialogOpen}
        onClose={onCloseConflictDialog}
        onResolve={onResolveConflict}
      />
      <ExpenseInspector expense={selectedExpense} onClose={onCloseExpenseInspector} />
      <ExportReportDialog
        open={exportDialogOpen}
        onClose={onCloseExportDialog}
        deposits={deposits}
        expenses={expenses}
      />
      <CsvImportWizard
        open={importWizardOpen}
        onClose={onCloseImportWizard}
        accounts={accounts}
        onImportComplete={onImportExpenses}
      />
    </>
  );
}
