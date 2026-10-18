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

type Props = {
  open: boolean;
  onClose: () => void;
  accounts: AllocationAccount[];
  currentCash: number;
  currentTotalExpenses: number;
  categories: string[];
  onSaveExpense: (item: Omit<ExpenseItem, "id">) => void;
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

  const numericAmount = Number.parseInt(amountInput.replace(/[^0-9]/g, ""), 10) || 0;
  const projectedExpenses = currentTotalExpenses + numericAmount;
  const projectedCash =
    fundingScope === "event_fund" ? Math.max(0, currentCash - numericAmount) : currentCash;

  const selectedAccount = accounts.find((a) => a.id === accountId) || accounts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    onSaveExpense({
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
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Catat Pengeluaran Baru" side>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <p className="text-xs text-secondary">
          Pencatatan bersama. Pisahkan pembayar riil dan sumber alokasi dana acara.
        </p>

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

        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Sumber Pendanaan</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={`p-2.5 text-xs text-left rounded-control border transition-all ${
                fundingScope === "event_fund"
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border bg-surface text-secondary"
              }`}
              onClick={() => setFundingScope("event_fund")}
            >
              <strong className="block">Dana Acara</strong>
              <span className="text-[11px] opacity-80">Mengurangi saldo kas</span>
            </button>
            <button
              type="button"
              className={`p-2.5 text-xs text-left rounded-control border transition-all ${
                fundingScope === "external_private"
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border bg-surface text-secondary"
              }`}
              onClick={() => setFundingScope("external_private")}
            >
              <strong className="block">Pribadi Eksternal</strong>
              <span className="text-[11px] opacity-80">Kas acara tidak berkurang</span>
            </button>
          </div>
        </div>

        {fundingScope === "event_fund" && (
          <div className="grid min-w-0 gap-2">
            <label className="text-sm font-medium">Rekening Alokasi Pembayar</label>
            <select
              className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.bank} {a.maskedNumber} · Saldo: {formatRupiah(a.currentBalance)})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="rounded-card bg-ux-dock p-3.5 border border-border flex flex-col gap-1 text-xs">
          <div className="flex justify-between">
            <span className="text-secondary">Proyeksi Realisasi Biaya:</span>
            <strong className="font-mono text-foreground">{formatRupiah(projectedExpenses)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Proyeksi Sisa Dana Acara:</span>
            <strong
              className={`font-mono font-semibold ${fundingScope === "event_fund" ? "text-primary" : "text-success"}`}
            >
              {formatRupiah(projectedCash)}
            </strong>
          </div>
          <span className="text-[11px] text-secondary italic mt-0.5">
            {fundingScope === "event_fund"
              ? `Biaya memotong saldo ${selectedAccount?.name}`
              : "Biaya pribadi di luar alokasi acara; saldo kas tetap utuh."}
          </span>
        </div>

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
