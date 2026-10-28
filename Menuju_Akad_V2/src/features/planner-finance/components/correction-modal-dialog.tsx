"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import type { AllocationAccount, InternalTransfer } from "../types/finance";
import { formatRupiah, simulateCorrection } from "../utils/finance-calc";

export function CorrectionModalDialog({
  open,
  onClose,
  accounts,
  originalTransfer,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  accounts: AllocationAccount[];
  originalTransfer?: InternalTransfer | undefined;
  onConfirm: (amount: number) => { success?: boolean; error?: string } | void;
}) {
  const [amount, setAmount] = useState("8000000");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const num = Number.parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const fromAcc =
    accounts.find((a) => a.id === (originalTransfer?.fromAccountId || "acc-bca")) || accounts[0];
  const toAcc =
    accounts.find((a) => a.id === (originalTransfer?.toAccountId || "acc-jago")) || accounts[1];
  const totalCash = accounts.reduce((s, a) => s + a.currentBalance, 0);
  const sim = originalTransfer
    ? simulateCorrection(accounts, originalTransfer, num)
    : { accounts, valid: false, error: "Data mutasi tidak ditemukan." };

  const activeError = errorMessage || (!sim.valid ? sim.error : null);

  const handleConfirm = () => {
    if (!sim.valid) {
      setErrorMessage(sim.error || "Nominal koreksi tidak valid.");
      return;
    }
    const res = onConfirm(num);
    if (res && typeof res === "object" && !res.success) {
      setErrorMessage(res.error || "Gagal melakukan koreksi.");
      return;
    }
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Koreksi Mutasi · Pratinjau">
      <div className="flex flex-col gap-4 p-5 max-w-md text-xs">
        <p className="text-secondary">
          Koreksi mutasi {originalTransfer?.id || "MT-009"} (
          {originalTransfer?.fromAccountName || fromAcc?.name}→
          {originalTransfer?.toAccountName || toAcc?.name}) tercatat{" "}
          {formatRupiah(originalTransfer?.amount || 9000000)} menjadi {formatRupiah(num)}.
        </p>
        {activeError && (
          <div className="rounded-control bg-danger/10 border border-danger/30 p-2.5 text-danger text-xs font-medium">
            {activeError}
          </div>
        )}
        <Field
          label="Nominal Koreksi yang Benar (IDR)"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrorMessage(null);
          }}
        />
        {sim.valid && (
          <div className="rounded-control bg-ux-dock p-3 border border-border flex flex-col gap-1 text-[11px]">
            <strong className="text-foreground">Dampak Reversal & Replacement:</strong>
            <span>
              {fromAcc?.name}: {formatRupiah(fromAcc?.currentBalance || 0)} →{" "}
              <strong className="text-brand-secondary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === fromAcc?.id)?.currentBalance || 0)}
              </strong>
              . {toAcc?.name}: {formatRupiah(toAcc?.currentBalance || 0)} →{" "}
              <strong className="text-brand-secondary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === toAcc?.id)?.currentBalance || 0)}
              </strong>
              . Total kas tetap {formatRupiah(totalCash)}.
            </span>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={!sim.valid}>
            Konfirmasi Koreksi
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
