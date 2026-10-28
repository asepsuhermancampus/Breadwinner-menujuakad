"use client";

import { Icon } from "@/components/ui/icon";
import type { AllocationAccount, BudgetItem, DepositItem, InstallmentItem } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import styles from "./finance.module.css";

type Props = {
  summary: {
    targetAmount: number;
    totalContributed: number;
    totalExpenses: number;
    cashRemaining: number;
    planRemaining: number;
    gapAmount: number;
    fundedPercent: number;
  };
  deposits: DepositItem[];
  categories: BudgetItem[];
  installments: InstallmentItem[];
  accounts: AllocationAccount[];
};

export function OverviewTab({ summary, deposits, categories, installments }: Props) {
  const andiTotal = deposits
    .filter((d) => d.contributor === "Andi")
    .reduce((s, d) => s + d.amount, 0);
  const risaTotal = deposits
    .filter((d) => d.contributor === "Risa")
    .reduce((s, d) => s + d.amount, 0);
  const keluargaTotal = deposits
    .filter((d) => d.contributor === "Keluarga")
    .reduce((s, d) => s + d.amount, 0);

  const nextInstallment = installments[0];

  return (
    <div className="flex flex-col gap-6">
      <div className={styles.disclaimerCard}>
        <Icon name="shield" size={18} className="text-brand-secondary mt-0.5 shrink-0" />
        <div>
          <strong className="block font-medium text-foreground">Bukan saldo bank otomatis.</strong>
          <span>
            Saldo alokasi dana acara, bukan saldo bank. Ketujuh pembayaran contoh memakai dana
            acara; biaya pribadi di luar alokasi tidak memotong saldo ini.
          </span>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Target Dana</span>
          <span className={styles.metricValue}>{formatRupiah(summary.targetAmount)}</span>
          <span className={styles.metricDetail}>
            {summary.fundedPercent}% terkumpul ({formatRupiah(summary.totalContributed)})
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Pembayaran Tercatat</span>
          <span className={styles.metricValue}>{formatRupiah(summary.totalExpenses)}</span>
          <span className={styles.metricDetail}>7 pembayaran dari alokasi dana acara</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Dana Acara</span>
          <span className={styles.metricValue}>{formatRupiah(summary.cashRemaining)}</span>
          <span className={styles.metricDetail}>Total alokasi di 3 rekening acara</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Rencana Biaya</span>
          <span className={styles.metricValue}>{formatRupiah(summary.planRemaining)}</span>
          <span className={styles.metricDetail}>Rencana 11 kategori − pembayaran</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Progres Pendanaan Bersama
            </h3>
            <span className="font-mono text-xs font-semibold text-brand-secondary">
              {summary.fundedPercent}% dari {formatRupiah(summary.targetAmount)}
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-ux-dock overflow-hidden flex">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${summary.fundedPercent}%` }}
              aria-label={`Terkumpul ${summary.fundedPercent}%`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
            <div>
              <span className="text-xs text-secondary block">Andi</span>
              <strong className="font-mono text-sm text-foreground">
                {formatRupiah(andiTotal)}
              </strong>
            </div>
            <div>
              <span className="text-xs text-secondary block">Risa</span>
              <strong className="font-mono text-sm text-foreground">
                {formatRupiah(risaTotal)}
              </strong>
            </div>
            <div>
              <span className="text-xs text-secondary block">Keluarga</span>
              <strong className="font-mono text-sm text-foreground">
                {formatRupiah(keluargaTotal)}
              </strong>
            </div>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-4">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Pengingat Termin Terdekat
          </h3>
          {nextInstallment ? (
            <div className="rounded-control bg-ux-dock p-3.5 border border-border flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-foreground text-sm">{nextInstallment.title}</span>
                <span className="text-xs text-secondary">
                  {nextInstallment.dueDate} · {nextInstallment.payer}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-brand-secondary block">
                  {formatRupiah(nextInstallment.amount)}
                </span>
                <span className="text-[10px] uppercase font-bold text-warning bg-warning-bg px-2 py-0.5 rounded-full">
                  {nextInstallment.status}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-xs text-secondary">Tidak ada termin mendatang.</span>
          )}
          <span className="text-xs text-secondary">
            Catatan manual. Pengingat tidak melakukan autodebit atau transfer bank otomatis.
          </span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Pratinjau Anggaran Utama
          </h3>
          <span className="text-xs text-secondary">5 kategori terbesar</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>PIC</th>
              <th>Rencana</th>
              <th>Dibayar</th>
              <th>Sisa</th>
            </tr>
          </thead>
          <tbody>
            {categories.slice(0, 5).map((cat) => (
              <tr key={cat.id}>
                <td className="font-medium text-foreground">{cat.name}</td>
                <td className="text-secondary">{cat.pic}</td>
                <td className="font-mono">{formatRupiah(cat.plannedAmount)}</td>
                <td className="font-mono text-success">{formatRupiah(cat.paidAmount)}</td>
                <td className="font-mono text-secondary">
                  {formatRupiah(cat.plannedAmount - cat.paidAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
