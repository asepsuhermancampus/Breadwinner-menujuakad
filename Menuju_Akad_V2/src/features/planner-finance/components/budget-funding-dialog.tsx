"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CustomerBudget } from "../types/customer-budget";
import type { FinanceSnapshot, SavingsSide } from "../types/finance-ledger";
import { formatRupiah } from "../domain/rupiah";
import styles from "./customer-finance.module.css";
import { savingsName } from "../domain/savings-name";

export function BudgetFundingDialog({
  item,
  complete,
  snapshot,
  pending,
  error,
  onClose,
  onConfirm,
}: {
  item: CustomerBudget;
  complete: boolean;
  snapshot: FinanceSnapshot;
  pending: boolean;
  error: string;
  onClose: () => void;
  onConfirm: (side: SavingsSide) => Promise<void>;
}) {
  const [side, setSide] = useState<SavingsSide>(snapshot.actorSide ?? "groom");
  const allocation = snapshot.allocations.find((value) => value.budgetId === item.id);
  const amount = item.amount ?? 0;
  const enough = amount > 0 && snapshot.balances[side] >= amount;
  return (
    <Dialog
      open
      title={complete ? "Gunakan tabungan untuk anggaran" : "Batalkan alokasi anggaran?"}
      onClose={() => !pending && onClose()}
    >
      <div className="space-y-4">
        <p className="break-words text-sm">
          <strong>{item.title}</strong> · {formatRupiah(amount)}
        </p>
        {complete ? (
          <>
            <fieldset disabled={pending} className={styles.fundingChoices}>
              <legend className="mb-2 text-sm font-medium">Pilih sumber dana</legend>
              {(["groom", "bride"] as const).map((value) => (
                <label key={value}>
                  <input
                    type="radio"
                    name="budget-source"
                    value={value}
                    checked={side === value}
                    onChange={() => setSide(value)}
                  />
                  <span>
                    Tabungan {savingsName(snapshot, value, true)}
                    <strong className="block font-mono">
                      {formatRupiah(snapshot.balances[value])}
                    </strong>
                  </span>
                </label>
              ))}
            </fieldset>
            <p className="text-xs text-secondary">
              Saldo sumber yang dipilih akan berkurang sekali dan tercatat dalam riwayat. Kedua
              sumber boleh digunakan tanpa persetujuan tambahan.
            </p>
            {!enough && (
              <p role="status" className="text-sm text-danger">
                {amount <= 0
                  ? "Isi target anggaran lebih dari Rp 0 terlebih dahulu."
                  : "Saldo sumber ini belum mencukupi. Pilih sumber lain atau tambahkan tabungan."}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-secondary">
            {allocation
              ? `Dana ${formatRupiah(allocation.amount)} akan dikembalikan ke tabungan ${savingsName(snapshot, allocation.side, true)} dan dicatat sebagai pengembalian alokasi.`
              : "Status catatan lama ini akan diubah menjadi Belum tercapai. Tidak ada saldo tabungan yang berubah."}
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className={styles.formActions}>
          <Button disabled={pending || (complete && !enough)} onClick={() => void onConfirm(side)}>
            {pending
              ? "Menyimpan…"
              : complete
                ? "Gunakan dana & tandai tercapai"
                : "Batalkan alokasi"}
          </Button>
          <Button variant="secondary" disabled={pending} onClick={onClose}>
            Kembali
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
