"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { ContributorName, DepositItem } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import styles from "./finance.module.css";

type Props = {
  deposits: DepositItem[];
  summary: {
    targetAmount: number;
    totalContributed: number;
    totalExpenses: number;
    cashRemaining: number;
    gapAmount: number;
    fundedPercent: number;
  };
  onOpenRecordDeposit: () => void;
  onOpenTargetSimulator: () => void;
};

export function SavingsTab({
  deposits,
  summary,
  onOpenRecordDeposit,
  onOpenTargetSimulator,
}: Props) {
  const [filterContributor, setFilterContributor] = useState<ContributorName | "All">("All");

  const andiTotal = deposits
    .filter((d) => d.contributor === "Andi")
    .reduce((s, d) => s + d.amount, 0);
  const risaTotal = deposits
    .filter((d) => d.contributor === "Risa")
    .reduce((s, d) => s + d.amount, 0);
  const keluargaTotal = deposits
    .filter((d) => d.contributor === "Keluarga")
    .reduce((s, d) => s + d.amount, 0);

  const filteredDeposits = deposits.filter((d) => {
    if (filterContributor === "All") return true;
    return d.contributor === filterContributor;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Tabungan, dicatat bersama.</h2>
          <p className="text-xs text-secondary">
            Setiap kontribusi punya asal, waktu, dan bukti yang jelas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="small" onClick={onOpenTargetSimulator}>
            <Icon name="sparkles" size={14} className="mr-1.5" />
            Atur target & kontribusi
          </Button>
          <Button variant="primary" size="small" onClick={onOpenRecordDeposit}>
            <Icon name="plus" size={14} className="mr-1.5" />
            Catat setoran
          </Button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Tercatat</span>
          <span className={styles.metricValue}>{formatRupiah(summary.totalContributed)}</span>
          <span className={styles.metricDetail}>
            {summary.fundedPercent}% target Rp 150 jt · {deposits.length} setoran
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Biaya Dari Dana Acara</span>
          <span className={styles.metricValue}>{formatRupiah(summary.totalExpenses)}</span>
          <span className={styles.metricDetail}>7 pembayaran bersumber dana acara</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kekurangan Dana</span>
          <span className={styles.metricValue}>{formatRupiah(summary.gapAmount)}</span>
          <span className={styles.metricDetail}>25% menuju target pelunasan</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Dana Acara</span>
          <span className={styles.metricValue}>{formatRupiah(summary.cashRemaining)}</span>
          <span className={styles.metricDetail}>Bukan saldo bank otomatis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-card border border-border bg-surface p-4 text-center">
          <span className="text-xs text-secondary block mb-1">Kontribusi Andi</span>
          <strong className="font-mono text-lg text-foreground block">
            {formatRupiah(andiTotal)}
          </strong>
          <span className="text-[11px] text-secondary">BCA ••4821</span>
        </div>
        <div className="rounded-card border border-border bg-surface p-4 text-center">
          <span className="text-xs text-secondary block mb-1">Kontribusi Risa</span>
          <strong className="font-mono text-lg text-foreground block">
            {formatRupiah(risaTotal)}
          </strong>
          <span className="text-[11px] text-secondary">Mandiri ••9012</span>
        </div>
        <div className="rounded-card border border-border bg-surface p-4 text-center">
          <span className="text-xs text-secondary block mb-1">Kontribusi Keluarga</span>
          <strong className="font-mono text-lg text-foreground block">
            {formatRupiah(keluargaTotal)}
          </strong>
          <span className="text-[11px] text-secondary">Jago ••7734</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Riwayat Setoran ({filteredDeposits.length})
          </h3>
          <div className="flex items-center gap-1.5">
            {(["All", "Andi", "Risa", "Keluarga"] as const).map((c) => (
              <button
                key={c}
                type="button"
                className={`px-3 py-1 text-xs rounded-control transition-colors ${
                  filterContributor === c
                    ? "bg-primary text-canvas font-semibold"
                    : "bg-ux-dock text-secondary hover:text-foreground"
                }`}
                onClick={() => setFilterContributor(c)}
              >
                {c === "All" ? "Semua" : c}
              </button>
            ))}
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Penyetor</th>
              <th>Rekening Tujuan</th>
              <th>Nominal</th>
              <th>Referensi / Bukti</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeposits.map((d) => (
              <tr key={d.id}>
                <td className="text-secondary">{d.date}</td>
                <td className="font-medium text-foreground">{d.contributor}</td>
                <td className="text-secondary">{d.accountName}</td>
                <td className="font-mono font-semibold text-primary">{formatRupiah(d.amount)}</td>
                <td className="text-xs text-secondary">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="link" size={12} />
                    {d.reference || "Bukti transfer tercatat"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
