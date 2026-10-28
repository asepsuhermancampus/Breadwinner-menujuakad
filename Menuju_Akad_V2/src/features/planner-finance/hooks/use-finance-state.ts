"use client";
import { useUrlTab } from "@/hooks/use-url-tab";

import { useRef, useState } from "react";
import type {
  AllocationAccount,
  BudgetItem,
  DepositItem,
  EventFinanceContext,
  ExpenseItem,
  FinanceTabKey,
  InstallmentItem,
  InternalTransfer,
} from "../types/finance";
import { calculateFinanceSummary } from "../utils/finance-calc";
import {
  applyCorrection,
  applyDeposit,
  applyExpense,
  applyExpenseBatch,
  applyTransfer,
  type LedgerState,
} from "../utils/ledger-engine";

type InitialProps = {
  initialAccounts: AllocationAccount[];
  initialDeposits: DepositItem[];
  initialExpenses: ExpenseItem[];
  initialCategories: BudgetItem[];
  initialInstallments: InstallmentItem[];
  initialTransfers: InternalTransfer[];
};

export function useFinanceState({
  initialAccounts,
  initialDeposits,
  initialExpenses,
  initialCategories,
  initialInstallments,
  initialTransfers,
}: InitialProps) {
  const [eventContext, setEventContext] = useUrlTab<EventFinanceContext>(
    "context",
    ["wedding", "engagement"],
    "wedding",
  );
  const [activeTab, setActiveTab] = useUrlTab<FinanceTabKey>(
    "tab",
    ["ringkasan", "tabungan", "anggaran", "pengeluaran", "termin", "laporan", "rekening"],
    "ringkasan",
  );
  const [categories, setCategories] = useState<BudgetItem[]>(initialCategories);
  const [installments] = useState<InstallmentItem[]>(initialInstallments);
  const [targetAmount, setTargetAmount] = useState(150_000_000);

  const [recordExpenseOpen, setRecordExpenseOpen] = useState(false);
  const [recordDepositOpen, setRecordDepositOpen] = useState(false);
  const [targetSimulatorOpen, setTargetSimulatorOpen] = useState(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importWizardOpen, setImportWizardOpen] = useState(false);

  const [ledger, setLedger] = useState<LedgerState>(() => ({
    accounts: initialAccounts,
    deposits: initialDeposits,
    expenses: initialExpenses,
    transfers: initialTransfers,
  }));
  const ledgerRef = useRef(ledger);

  const summary = calculateFinanceSummary(
    targetAmount,
    ledger.deposits,
    ledger.expenses,
    ledger.accounts,
  );

  const handleSaveExpense = (item: Omit<ExpenseItem, "id">) => {
    const res = applyExpense(ledgerRef.current, item);
    if (res.success) {
      ledgerRef.current = res.state;
      setLedger(res.state);
    }
    return res;
  };

  const handleImportExpenses = (items: Omit<ExpenseItem, "id">[]) => {
    const res = applyExpenseBatch(ledgerRef.current, items);
    if (res.success) {
      ledgerRef.current = res.state;
      setLedger(res.state);
    }
    return res;
  };

  const handleSaveDeposit = (item: Omit<DepositItem, "id">) => {
    const res = applyDeposit(ledgerRef.current, item);
    if (res.success) {
      ledgerRef.current = res.state;
      setLedger(res.state);
    }
    return res;
  };

  const handleUpdateCategory = (id: string, newPlanned: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, plannedAmount: newPlanned, version: c.version + 1 } : c,
      ),
    );
  };

  const handleExecuteTransfer = (fromId: string, toId: string, amount: number) => {
    const res = applyTransfer(ledgerRef.current, fromId, toId, amount);
    if (res.success) {
      ledgerRef.current = res.state;
      setLedger(res.state);
    }
    return res;
  };

  const handleExecuteCorrection = (newAmount: number) => {
    const res = applyCorrection(ledgerRef.current, newAmount);
    if (res.success) {
      ledgerRef.current = res.state;
      setLedger(res.state);
    }
    return res;
  };

  return {
    eventContext,
    setEventContext,
    activeTab,
    setActiveTab,
    accounts: ledger.accounts,
    deposits: ledger.deposits,
    expenses: ledger.expenses,
    categories,
    installments,
    transfers: ledger.transfers,
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
  };
}
