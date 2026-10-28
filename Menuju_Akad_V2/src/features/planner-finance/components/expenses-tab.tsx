"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { ExpenseItem } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import styles from "./finance.module.css";

type Props = {
  expenses: ExpenseItem[];
  cashRemaining: number;
  planRemaining: number;
  onOpenRecordExpense: () => void;
  onSelectExpense: (item: ExpenseItem) => void;
};

export function ExpensesTab({
  expenses,
  cashRemaining,
  planRemaining,
  onOpenRecordExpense,
  onSelectExpense,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const categories = ["Semua", ...new Set(expenses.map((e) => e.category))];

  const filtered = expenses.filter((e) => {
    const matchesCat = selectedCategory === "Semua" || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Semua pengeluaran, satu jejak.</h2>
          <p className="text-xs text-secondary">
            Realisasi dihitung dari pembayaran yang dicatat, bukan nilai kontrak.
          </p>
        </div>
        <Button variant="primary" size="small" onClick={onOpenRecordExpense}>
          <Icon name="plus" size={14} className="mr-1.5" />
          Catat pengeluaran
        </Button>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Pembayaran Tercatat</span>
          <span className={styles.metricValue}>{formatRupiah(totalSpent)}</span>
          <span className={styles.metricDetail}>{expenses.length} bukti pembayaran</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Dana Acara</span>
          <span className={styles.metricValue}>{formatRupiah(cashRemaining)}</span>
          <span className={styles.metricDetail}>Kas tersedia saat ini</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Bukti Tersimpan</span>
          <span className="font-mono text-2xl font-semibold text-brand-secondary mt-1">
            {expenses.filter((e) => e.proofName).length} Dokumen
          </span>
          <span className="text-xs text-secondary">Kuitansi / invoice terverifikasi</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kebutuhan Tersisa</span>
          <span className={styles.metricValue}>{formatRupiah(planRemaining)}</span>
          <span className={styles.metricDetail}>Target rencana yang belum dibayar</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            placeholder="Cari transaksi atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-control border border-border bg-surface px-3 py-1.5 text-xs w-64"
          />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`px-2.5 py-1 text-xs rounded-control transition-colors ${
                  selectedCategory === c
                    ? "bg-primary text-on-primary font-semibold"
                    : "bg-ux-dock text-secondary hover:text-foreground"
                }`}
                onClick={() => setSelectedCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID / Tanggal</th>
              <th>Pengeluaran</th>
              <th>Kategori</th>
              <th>Nominal</th>
              <th>Pembayar</th>
              <th>Sumber Dana</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                onClick={() => onSelectExpense(e)}
                className="cursor-pointer hover:bg-canvas"
                title="Klik untuk melihat detail & bukti audit"
              >
                <td>
                  <span className="font-mono text-xs font-semibold text-brand-secondary block">
                    {e.id}
                  </span>
                  <span className="text-xs text-secondary">{e.date}</span>
                </td>
                <td className="font-medium text-foreground">{e.title}</td>
                <td className="text-secondary">{e.category}</td>
                <td className="font-mono font-semibold text-foreground">
                  {formatRupiah(e.amount)}
                </td>
                <td className="text-secondary">{e.paidBy}</td>
                <td>
                  <span
                    className={`inline-block text-[11px] px-2 py-0.5 rounded-full ${
                      e.fundingScope === "event_fund"
                        ? "bg-primary/10 text-brand-secondary font-medium"
                        : "bg-ux-dock text-secondary"
                    }`}
                  >
                    {e.fundingScope === "event_fund" ? "Dana Acara" : "Pribadi Eksternal"}
                  </span>
                </td>
                <td>
                  <span
                    className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      e.status === "lunas"
                        ? "bg-success-bg text-success"
                        : "bg-warning-bg text-warning"
                    }`}
                  >
                    {e.status}
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
