"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import type {
  AllocationAccount,
  ContributorName,
  ExpenseItem,
  FundingScope,
} from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import { ExpenseFundingScopeField, ExpenseProjectionCard } from "./record-expense-fields";

type Props = {
  open: boolean;
  onClose: () => void;
  accounts: AllocationAccount[];
  currentCash: number;
  currentTotalExpenses: number;
  categories: string[];
  onSaveExpense: (item: Omit<ExpenseItem, "id">) => { success?: boolean; error?: string } | void;
};

export function RecordExpenseDialog({
  open,
  onClose,
  accounts,
  currentCash,
  currentTotalExpenses,
  categories,
  onSaveExpense,
}: Props) {
  const [title, setTitle] = useState("Transport survei venue");
  const [amountInput, setAmountInput] = useState("500000");
  const [category, setCategory] = useState(categories[0] || "Transportasi & lainnya");
  const [paidBy, setPaidBy] = useState<ContributorName>("Risa");
  const [fundingScope, setFundingScope] = useState<FundingScope>("event_fund");
  const [accountId, setAccountId] = useState(accounts[1]?.id || "acc-mandiri");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const numericAmount = Number.parseInt(amountInput.replace(/[^0-9]/g, ""), 10) || 0;
  const projectedExpenses = currentTotalExpenses + numericAmount;
  const projectedCash =
    fundingScope === "event_fund" ? Math.max(0, currentCash - numericAmount) : currentCash;

  const selectedAccount = accounts.find((a) => a.id === accountId) || accounts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setErrorMessage("Nominal pengeluaran harus lebih besar dari Rp 0.");
      return;
    }
    if (fundingScope === "event_fund" && selectedAccount) {
      if (selectedAccount.currentBalance < numericAmount) {
        setErrorMessage(
          `Saldo rekening ${selectedAccount.name} tidak mencukupi (${formatRupiah(selectedAccount.currentBalance)} < ${formatRupiah(numericAmount)}).`,
        );
        return;
      }
    }
    const res = onSaveExpense({
      title,
      category,
      amount: numericAmount,
      paidBy,
      fundingScope,
      accountId: fundingScope === "event_fund" ? selectedAccount?.id : undefined,
      accountName:
        fundingScope === "event_fund"
          ? `${selectedAccount?.bank} ${selectedAccount?.maskedNumber}`
          : "Pribadi Eksternal",
      date: "25 Okt 2026",
      status: "dp",
      proofName: "bukti-transaksi.pdf",
      recordedBy: "Risa",
      version: 1,
    });
    if (res && typeof res === "object" && !res.success) {
      setErrorMessage(res.error || "Gagal menyimpan pengeluaran.");
      return;
    }
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Catat Pengeluaran Baru" side>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <p className="text-xs text-secondary">
          Pencatatan bersama. Pisahkan pembayar riil dan sumber alokasi dana acara.
        </p>

        {errorMessage && (
          <div className="rounded-control bg-danger/10 border border-danger/30 p-2.5 text-danger text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <Field
          label="Keterangan Pengeluaran"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Field
          label="Nominal (IDR)"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          placeholder="500000"
          required
        />

        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Kategori Anggaran</label>
          <select
            className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Dibayar Oleh (Payer)</label>
          <select
            className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value as ContributorName)}
          >
            <option value="Andi">Andi</option>
            <option value="Risa">Risa</option>
            <option value="Bersama">Bersama</option>
          </select>
        </div>

        <ExpenseFundingScopeField
          fundingScope={fundingScope}
          setFundingScope={setFundingScope}
          accountId={accountId}
          setAccountId={setAccountId}
          accounts={accounts}
        />

        <ExpenseProjectionCard
          projectedExpenses={projectedExpenses}
          projectedCash={projectedCash}
          fundingScope={fundingScope}
          selectedAccount={selectedAccount}
        />

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan Catatan Pengeluaran
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
