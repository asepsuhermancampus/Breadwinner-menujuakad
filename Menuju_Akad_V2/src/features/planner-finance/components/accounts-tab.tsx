"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { AllocationAccount, InternalTransfer } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import { CorrectionModalDialog, TransferModalDialog } from "./internal-transfer-dialog";
import styles from "./finance.module.css";

type Props = {
  accounts: AllocationAccount[];
  transfers: InternalTransfer[];
  totalContributed: number;
  totalExpenses: number;
  cashRemaining: number;
  onExecuteTransfer: (
    fromId: string,
    toId: string,
    amount: number,
  ) => { success?: boolean; error?: string } | void;
  onExecuteCorrection: (newAmount: number) => { success?: boolean; error?: string } | void;
};

export function AccountsTab({
  accounts,
  transfers,
  totalContributed,
  totalExpenses,
  cashRemaining,
  onExecuteTransfer,
  onExecuteCorrection,
}: Props) {
  const [transferModal, setTransferModal] = useState(false);
  const [correctionModal, setCorrectionModal] = useState(false);
  const totalTransfer = transfers.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Rekening dana acara & mutasi</h2>
          <p className="text-xs text-secondary">
            Pernikahan · saldo alokasi catatan, bukan saldo bank otomatis.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="small" onClick={() => setCorrectionModal(true)}>
            <Icon name="history" size={14} className="mr-1.5" />
            Koreksi Catatan MT-009
          </Button>
          <Button variant="primary" size="small" onClick={() => setTransferModal(true)}>
            <Icon name="repeat" size={14} className="mr-1.5" />
            Catat mutasi internal
          </Button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kontribusi</span>
          <span className={styles.metricValue}>{formatRupiah(totalContributed)}</span>
          <span className={styles.metricDetail}>7 setoran, bukan mutasi</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Biaya Dari Dana Acara</span>
          <span className={styles.metricValue}>{formatRupiah(totalExpenses)}</span>
          <span className={styles.metricDetail}>7 pembayaran dari kas</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Dana Acara</span>
          <span className={styles.metricValue}>{formatRupiah(cashRemaining)}</span>
          <span className={styles.metricDetail}>Jumlah 3 alokasi rekening</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Mutasi Internal</span>
          <span className={styles.metricValue}>{formatRupiah(totalTransfer)}</span>
          <span className={styles.metricDetail}>Tidak menambah biaya/kontribusi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-card border border-border bg-surface p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-secondary">
                {acc.owner} · {acc.bank}
              </span>
              <span className="font-mono text-xs text-secondary">{acc.maskedNumber}</span>
            </div>
            <div>
              <span className="text-xs text-secondary block">Saldo Alokasi Acara</span>
              <strong className="font-mono text-2xl font-semibold text-brand-secondary block mt-0.5">
                {formatRupiah(acc.currentBalance)}
              </strong>
            </div>
            {acc.formulaNote && (
              <span className="text-[11px] text-secondary bg-ux-dock p-2 rounded-control border border-border">
                {acc.formulaNote}
              </span>
            )}
          </div>
        ))}
      </div>

      <TransferModalDialog
        open={transferModal}
        onClose={() => setTransferModal(false)}
        accounts={accounts}
        onConfirm={(amount) => onExecuteTransfer("acc-bca", "acc-jago", amount)}
      />

      <CorrectionModalDialog
        open={correctionModal}
        onClose={() => setCorrectionModal(false)}
        accounts={accounts}
        originalTransfer={transfers[0]}
        onConfirm={onExecuteCorrection}
      />
    </div>
  );
}
