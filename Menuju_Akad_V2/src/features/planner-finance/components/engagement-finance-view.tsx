"use client";

import { Icon } from "@/components/ui/icon";
import type { EngagementFinanceData } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import styles from "./finance.module.css";

type Props = {
  data: EngagementFinanceData;
};

export function EngagementFinanceView({ data }: Props) {
  const percentFunded = Math.round((data.totalContributed / data.targetAmount) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className={styles.disclaimerCard}>
        <Icon name="shield" size={18} className="text-brand-secondary mt-0.5 shrink-0" />
        <div>
          <strong className="block font-medium text-foreground">Konteks & Dana Terpisah.</strong>
          <span>
            Ledger lamaran tidak digabung dengan tabungan pernikahan. Rekening dan pencatatan
            anggaran tetap independen.
          </span>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Target Lamaran</span>
          <span className={styles.metricValue}>{formatRupiah(data.targetAmount)}</span>
          <span className={styles.metricDetail}>{percentFunded}% terkumpul</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Setoran Lamaran</span>
          <span className={styles.metricValue}>{formatRupiah(data.totalContributed)}</span>
          <span className={styles.metricDetail}>Kontribusi Andi & Risa</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Pembayaran Lamaran</span>
          <span className={styles.metricValue}>{formatRupiah(data.totalExpenses)}</span>
          <span className={styles.metricDetail}>Realisasi pengeluaran</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Dana Hitung</span>
          <span className={styles.metricValue}>{formatRupiah(data.cashRemaining)}</span>
          <span className={styles.metricDetail}>Kas tersedia acara</span>
        </div>
      </div>

      <div className="rounded-card border border-border bg-surface p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Rencana Menabung Mingguan
          </h3>
          <span className="font-mono text-xs font-semibold text-brand-secondary">
            {formatRupiah(data.shortfallAmount)} lagi sebelum hari lamaran
          </span>
        </div>

        <div className="h-3 w-full rounded-full bg-ux-dock overflow-hidden flex">
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${percentFunded}%` }}
          />
        </div>

        <p className="text-xs text-secondary leading-relaxed">
          4 setoran mingguan × Rp 2.000.000 · Andi Rp 1.000.000 + Risa Rp 1.000.000 per periode.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border">
          {data.weeklyInstallments.map((w) => (
            <div key={w.date} className="rounded-control bg-ux-dock p-2.5 text-center">
              <span className="text-[11px] font-mono text-secondary block">{w.date}</span>
              <strong className="font-mono text-sm text-foreground block mt-0.5">
                {formatRupiah(w.amount)}
              </strong>
              <span className="text-[10px] text-secondary">Andi 1 jt · Risa 1 jt</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Buku Anggaran Lamaran ({data.categories.length} Kategori)
          </h3>
          <span className="text-xs text-secondary">
            Sisa rencana: {formatRupiah(data.planRemaining)}
          </span>
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
            {data.categories.map((c) => (
              <tr key={c.id}>
                <td className="font-medium text-foreground">{c.name}</td>
                <td className="text-secondary">{c.pic}</td>
                <td className="font-mono">{formatRupiah(c.plannedAmount)}</td>
                <td className="font-mono text-success">{formatRupiah(c.paidAmount)}</td>
                <td className="font-mono text-secondary">
                  {formatRupiah(c.plannedAmount - c.paidAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
