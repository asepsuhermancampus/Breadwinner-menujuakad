"use client";

import { useState } from "react";
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
  const [eventContext, setEventContext] = useState<EventFinanceContext>("wedding");
  const [activeTab, setActiveTab] = useState<FinanceTabKey>("ringkasan");
  const [accounts, setAccounts] = useState<AllocationAccount[]>(initialAccounts);
  const [deposits, setDeposits] = useState<DepositItem[]>(initialDeposits);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [categories, setCategories] = useState<BudgetItem[]>(initialCategories);
  const [installments] = useState<InstallmentItem[]>(initialInstallments);
  const [transfers, setTransfers] = useState<InternalTransfer[]>(initialTransfers);
  const [targetAmount, setTargetAmount] = useState(150_000_000);

  const [recordExpenseOpen, setRecordExpenseOpen] = useState(false);
  const [recordDepositOpen, setRecordDepositOpen] = useState(false);
  const [targetSimulatorOpen, setTargetSimulatorOpen] = useState(false);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importWizardOpen, setImportWizardOpen] = useState(false);

  const summary = calculateFinanceSummary(targetAmount, deposits, expenses, accounts);

  const handleSaveExpense = (item: Omit<ExpenseItem, "id">) => {
    const newId = `EX-${1000 + expenses.length + 1}`;
    const newExpense: ExpenseItem = { ...item, id: newId };
    setExpenses((prev) => [newExpense, ...prev]);

    if (item.fundingScope === "event_fund" && item.accountId) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === item.accountId
            ? { ...a, currentBalance: Math.max(0, a.currentBalance - item.amount) }
            : a,
        ),
      );
    }
  };

  const handleSaveDeposit = (item: Omit<DepositItem, "id">) => {
    const newDeposit: DepositItem = { ...item, id: `d-${deposits.length + 1}` };
    setDeposits((prev) => [...prev, newDeposit]);
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === item.accountId ? { ...a, currentBalance: a.currentBalance + item.amount } : a,
      ),
    );
  };

  const handleUpdateCategory = (id: string, newPlanned: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, plannedAmount: newPlanned, version: c.version + 1 } : c,
      ),
    );
  };

  const handleExecuteTransfer = (fromId: string, toId: string, amount: number) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromId) return { ...a, currentBalance: a.currentBalance - amount };
        if (a.id === toId) return { ...a, currentBalance: a.currentBalance + amount };
        return a;
      }),
    );
    setTransfers((prev) => [
      ...prev,
      {
        id: `MT-${String(prev.length + 10).padStart(3, "0")}`,
        fromAccountId: fromId,
        toAccountId: toId,
        fromAccountName: accounts.find((a) => a.id === fromId)?.name || "",
        toAccountName: accounts.find((a) => a.id === toId)?.name || "",
        amount,
        date: "25 Okt 2026",
        reason: "Mutasi alokasi internal",
        recordedBy: "Risa",
        idempotencyKey: `MUT:AR:${Date.now()}`,
      },
    ]);
  };

  const handleExecuteCorrection = (newAmount: number) => {
    const orig = transfers[0];
    if (!orig) return;
    const delta = newAmount - orig.amount;
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === orig.fromAccountId) return { ...a, currentBalance: a.currentBalance - delta };
        if (a.id === orig.toAccountId) return { ...a, currentBalance: a.currentBalance + delta };
        return a;
      }),
    );
  };

  return {
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
  };
}
