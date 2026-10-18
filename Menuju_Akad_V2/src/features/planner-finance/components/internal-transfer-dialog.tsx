"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import type { AllocationAccount, InternalTransfer } from "../types/finance";
import { formatRupiah, simulateCorrection, simulateTransfer } from "../utils/finance-calc";

export function TransferModalDialog({
  open,
  onClose,
  accounts,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  accounts: AllocationAccount[];
  onConfirm: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("1000000");
  const num = Number.parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const sim = simulateTransfer(accounts, "acc-bca", "acc-jago", num);

  return (
    <Dialog open={open} onClose={onClose} title="Catat Mutasi, Bukan Kirim Uang">
      <div className="flex flex-col gap-4 p-5 max-w-md text-xs">
        <p className="text-secondary">
          Pencatatan transfer antar rekening alokasi acara. Tidak memindahkan dana bank secara riil.
        </p>
        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Dari Rekening</label>
          <select
            value="acc-bca"
            disabled
            className="w-full rounded-control border border-border p-2 bg-surface text-sm"
          >
            <option value="acc-bca">BCA Andi (Saldo: Rp 10.000.000)</option>
          </select>
        </div>
        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Ke Rekening</label>
          <select
            value="acc-jago"
            disabled
            className="w-full rounded-control border border-border p-2 bg-surface text-sm"
          >
            <option value="acc-jago">Jago Bersama (Saldo: Rp 14.500.000)</option>
          </select>
        </div>
        <Field
          label="Nominal Mutasi (IDR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {sim.valid && (
          <div className="rounded-control bg-ux-dock p-3 border border-border flex flex-col gap-1 text-[11px]">
            <strong className="text-foreground">Pratinjau setelah dicatat:</strong>
            <span>
              BCA: Rp 10 jt →{" "}
              <strong className="text-primary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === "acc-bca")?.currentBalance || 0)}
              </strong>
              . Jago: Rp 14,5 jt →{" "}
              <strong className="text-primary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === "acc-jago")?.currentBalance || 0)}
              </strong>
              . Total dana acara tetap Rp 55 jt.
            </span>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm(num);
              onClose();
            }}
            disabled={!sim.valid}
          >
            Simpan Mutasi
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

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
  onConfirm: (amount: number) => void;
}) {
  const [amount, setAmount] = useState("8000000");
  const num = Number.parseInt(amount.replace(/[^0-9]/g, ""), 10) || 0;
  const sim = originalTransfer
    ? simulateCorrection(accounts, originalTransfer, num)
    : { accounts, valid: false };

  return (
    <Dialog open={open} onClose={onClose} title="Koreksi Mutasi · Pratinjau">
      <div className="flex flex-col gap-4 p-5 max-w-md text-xs">
        <p className="text-secondary">
          Koreksi mutasi MT-009 (BCA→Jago) tercatat Rp 9.000.000 menjadi Rp 8.000.000.
        </p>
        <Field
          label="Nominal Koreksi yang Benar (IDR)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {sim.valid && (
          <div className="rounded-control bg-ux-dock p-3 border border-border flex flex-col gap-1 text-[11px]">
            <strong className="text-foreground">Dampak Reversal & Replacement:</strong>
            <span>
              BCA Andi: Rp 10 jt →{" "}
              <strong className="text-primary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === "acc-bca")?.currentBalance || 0)}
              </strong>
              . Jago Bersama: Rp 14,5 jt →{" "}
              <strong className="text-primary font-mono">
                {formatRupiah(sim.accounts.find((a) => a.id === "acc-jago")?.currentBalance || 0)}
              </strong>
              . Total kas tetap Rp 55 jt.
            </span>
          </div>
        )}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm(num);
              onClose();
            }}
            disabled={!sim.valid}
          >
            Konfirmasi Koreksi
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
