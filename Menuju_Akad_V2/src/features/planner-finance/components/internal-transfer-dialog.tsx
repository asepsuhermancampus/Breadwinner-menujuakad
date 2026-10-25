"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import type { AllocationAccount } from "../types/finance";
import { formatRupiah, simulateTransfer } from "../utils/finance-calc";

export function TransferModalDialog({
  open,
  onClose,
  accounts,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  accounts: AllocationAccount[];
  onConfirm: (amount: number) => { success?: boolean; error?: string } | void;
}) {
  const [amount, setAmount] = useState("1000000");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const num = Number.parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const fromAcc = accounts.find((a) => a.id === "acc-bca") || accounts[0];
  const toAcc = accounts.find((a) => a.id === "acc-jago") || accounts[1];
  const totalCash = accounts.reduce((s, a) => s + a.currentBalance, 0);
  const sim =
    fromAcc && toAcc
      ? simulateTransfer(accounts, fromAcc.id, toAcc.id, num)
      : { accounts, valid: false, error: "Rekening tidak ditemukan." };

  const activeError = errorMessage || (!sim.valid ? sim.error : null);

  const handleConfirm = () => {
    if (!sim.valid) {
      setErrorMessage(sim.error || "Nominal mutasi tidak valid.");
      return;
    }
    const res = onConfirm(num);
    if (res && typeof res === "object" && !res.success) {
      setErrorMessage(res.error || "Gagal mencatat mutasi.");
      return;
    }
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Catat Mutasi, Bukan Kirim Uang">
      <div className="flex flex-col gap-4 p-5 max-w-md text-xs">
        <p className="text-secondary">
          Pencatatan transfer antar rekening alokasi acara. Tidak memindahkan dana bank secara riil.
        </p>
        {activeError && (
          <div className="rounded-control bg-danger/10 border border-danger/30 p-2.5 text-danger text-xs font-medium">
            {activeError}
          </div>
        )}
        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Dari Rekening</label>
          <select
            value={fromAcc?.id || "acc-bca"}
            disabled
            className="w-full rounded-control border border-border p-2 bg-surface text-sm"
          >
            <option value={fromAcc?.id || "acc-bca"}>
              {fromAcc?.name} (Saldo: {formatRupiah(fromAcc?.currentBalance || 0)})
            </option>
          </select>
        </div>
        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Ke Rekening</label>
          <select
            value={toAcc?.id || "acc-jago"}
            disabled
            className="w-full rounded-control border border-border p-2 bg-surface text-sm"
          >
            <option value={toAcc?.id || "acc-jago"}>
              {toAcc?.name} (Saldo: {formatRupiah(toAcc?.currentBalance || 0)})
            </option>
          </select>
        </div>
        <Field
          label="Nominal Mutasi (IDR)"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrorMessage(null);
          }}
        />
        {sim.valid && (
          <div className="rounded-control bg-ux-dock p-3 border border-border flex flex-col gap-1 text-[11px]">
            <strong className="text-foreground">Pratinjau setelah dicatat:</strong>
            <span>
              {fromAcc?.bank}: {formatRupiah(fromAcc?.currentBalance || 0)} →{" "}
              <strong className="text-primary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === fromAcc?.id)?.currentBalance || 0)}
              </strong>
              . {toAcc?.bank}: {formatRupiah(toAcc?.currentBalance || 0)} →{" "}
              <strong className="text-primary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === toAcc?.id)?.currentBalance || 0)}
              </strong>
              . Total dana acara tetap {formatRupiah(totalCash)}.
            </span>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!sim.valid}>
            Simpan Mutasi
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

export { CorrectionModalDialog } from "./correction-modal-dialog";
