"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { DepositItem, ExpenseItem } from "../types/finance";
import { parseIndonesianDate } from "../utils/date-helpers";
import { formatRupiah } from "../utils/finance-calc";
import styles from "./finance.module.css";

type Props = {
  deposits: DepositItem[];
  expenses: ExpenseItem[];
  cashRemaining: number;
  onOpenExport: () => void;
  onOpenImport: () => void;
};

export function ReportsTab({
  deposits,
  expenses,
  cashRemaining,
  onOpenExport,
  onOpenImport,
}: Props) {
  const [filterPayer, setFilterPayer] = useState("Semua");

  const totalIn = deposits.reduce((s, d) => s + d.amount, 0);
  const totalOut = expenses.reduce((s, e) => s + e.amount, 0);

  type TimelineItem = {
    id: string;
    date: string;
    type: "in" | "out";
    title: string;
    category: string;
    amount: number;
    actor: string;
  };

  const timeline: TimelineItem[] = [
    ...deposits.map((d) => ({
      id: d.id,
      date: d.date,
      type: "in" as const,
      title: `Setoran tabungan (${d.accountName})`,
      category: "Kontribusi",
      amount: d.amount,
      actor: d.contributor,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      date: e.date,
      type: "out" as const,
      title: e.title,
      category: e.category,
      amount: e.amount,
      actor: e.paidBy,
    })),
  ]
    .sort((a, b) => {
      const diff = parseIndonesianDate(a.date) - parseIndonesianDate(b.date);
      if (diff !== 0) return diff;
      return a.id.localeCompare(b.id);
    })
    .filter((item) => {
      if (filterPayer === "Semua") return true;
      return item.actor === filterPayer;
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Lihat alurnya. Pahami posisinya.
          </h2>
          <p className="text-xs text-secondary">
            Sejak mulai · 20 September–25 Oktober 2026 · bukan mutasi rekening bank.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="small" onClick={onOpenImport}>
            <Icon name="upload" size={14} className="mr-1.5" />
            Impor CSV
          </Button>
          <Button variant="primary" size="small" onClick={onOpenExport}>
            <Icon name="download" size={14} className="mr-1.5" />
            Ekspor laporan
          </Button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Setoran Masuk</span>
          <span className="font-mono text-2xl font-semibold text-success mt-1">
            {formatRupiah(totalIn)}
          </span>
          <span className={styles.metricDetail}>{deposits.length} catatan setoran</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Biaya Keluar</span>
          <span className="font-mono text-2xl font-semibold text-danger mt-1">
            {formatRupiah(totalOut)}
          </span>
          <span className={styles.metricDetail}>{expenses.length} pembayaran tercatat</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Kas Alokasi</span>
          <span className="font-mono text-2xl font-semibold text-primary mt-1">
            {formatRupiah(cashRemaining)}
          </span>
          <span className={styles.metricDetail}>Alokasi 3 rekening dana acara</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Rekonsiliasi</span>
          <span className="font-mono text-xl font-semibold text-foreground mt-1">
            {deposits.length + expenses.length} Catatan
          </span>
          <span className={styles.metricDetail}>Status sinkron & tervalidasi</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Arus Dana & Mutasi Tercatat ({timeline.length})
          </h3>
          <div className="flex items-center gap-1.5">
            {["Semua", "Andi", "Risa", "Keluarga", "Bersama"].map((p) => (
              <button
                key={p}
                type="button"
                className={`px-2.5 py-1 text-xs rounded-control transition-colors ${
                  filterPayer === p
                    ? "bg-primary text-canvas font-semibold"
                    : "bg-ux-dock text-secondary hover:text-foreground"
                }`}
                onClick={() => setFilterPayer(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Transaksi</th>
              <th>Kategori</th>
              <th>Pihak</th>
              <th>Arus Dana</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((item) => (
              <tr key={item.id}>
                <td className="text-secondary text-xs">{item.date}</td>
                <td className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        item.type === "in" ? "bg-success" : "bg-danger"
                      }`}
                    />
                    <span>{item.title}</span>
                  </div>
                </td>
                <td className="text-secondary">{item.category}</td>
                <td className="text-secondary text-xs">{item.actor}</td>
                <td className="font-mono font-semibold">
                  <span className={item.type === "in" ? "text-success" : "text-foreground"}>
                    {item.type === "in" ? "+" : "-"}
                    {formatRupiah(item.amount)}
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
