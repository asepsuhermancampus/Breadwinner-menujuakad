"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import type { AllocationAccount, ContributorName, DepositItem } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";

type Props = {
  open: boolean;
  onClose: () => void;
  accounts: AllocationAccount[];
  currentTotalContributed: number;
  onSave: (deposit: Omit<DepositItem, "id">) => { success?: boolean; error?: string } | void;
};

export function DepositInspector({
  open,
  onClose,
  accounts,
  currentTotalContributed,
  onSave,
}: Props) {
  const [contributor, setContributor] = useState<ContributorName>("Andi");
  const [amountInput, setAmountInput] = useState("5000000");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "acc-bca");
  const [date, setDate] = useState("25 Okt 2026");
  const [reference, setReference] = useState("Transfer alokasi mandiri");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const numericAmount = Number.parseInt(amountInput.replace(/[^0-9]/g, ""), 10) || 0;
  const projectedTotal = currentTotalContributed + numericAmount;
  const selectedAccount = accounts.find((a) => a.id === accountId) || accounts[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) {
      setErrorMessage("Nominal setoran harus lebih besar dari Rp 0.");
      return;
    }
    const res = onSave({
      contributor,
      amount: numericAmount,
      accountId: selectedAccount?.id || "acc-bca",
      accountName: `${selectedAccount?.bank} ${selectedAccount?.maskedNumber}`,
      date,
      reference,
      proofName: "bukti-transfer.pdf",
    });
    if (res && typeof res === "object" && !res.success) {
      setErrorMessage(res.error || "Gagal mencatat setoran.");
      return;
    }
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Catat Setoran Tabungan" side>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5">
        <p className="text-xs text-secondary">
          Catat setoran riil yang telah ditransfer ke rekening alokasi acara.
        </p>

        {errorMessage && (
          <div className="rounded-control bg-danger/10 border border-danger/30 p-2.5 text-danger text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Penyetor</label>
          <select
            className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
            value={contributor}
            onChange={(e) => setContributor(e.target.value as ContributorName)}
          >
            <option value="Andi">Andi</option>
            <option value="Risa">Risa</option>
            <option value="Keluarga">Keluarga</option>
          </select>
        </div>

        <Field
          label="Nominal Setoran (IDR)"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          placeholder="5000000"
          required
        />

        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Rekening Tujuan Alokasi</label>
          <select
            className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.bank} {a.maskedNumber})
              </option>
            ))}
          </select>
        </div>

        <Field label="Tanggal Setoran" value={date} onChange={(e) => setDate(e.target.value)} />

        <Field
          label="Keterangan / Referensi"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />

        <div className="rounded-card bg-ux-dock p-3.5 border border-border flex flex-col gap-1 text-xs">
          <span className="font-semibold text-foreground">
            Draf setoran {formatRupiah(numericAmount)}
          </span>
          <span className="text-secondary">
            Proyeksi kontribusi: {formatRupiah(currentTotalContributed)} →{" "}
            <strong className="text-primary font-mono">{formatRupiah(projectedTotal)}</strong>
          </span>
          <span className="text-[11px] text-secondary italic">
            Belum tersimpan di ledger hingga dikonfirmasi.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan Catatan Setoran
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
