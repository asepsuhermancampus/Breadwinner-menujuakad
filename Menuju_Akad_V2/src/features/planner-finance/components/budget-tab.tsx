"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { BudgetItem } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import styles from "./finance.module.css";

type Props = {
  categories: BudgetItem[];
  targetAmount: number;
  onUpdateCategory: (id: string, newPlanned: number) => void;
  onOpenConflictDialog: () => void;
};

export function BudgetTab({
  categories,
  targetAmount,
  onUpdateCategory,
  onOpenConflictDialog,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const totalPlanned = categories.reduce((s, c) => s + c.plannedAmount, 0);
  const totalPaid = categories.reduce((s, c) => s + c.paidAmount, 0);
  const totalRemaining = totalPlanned - totalPaid;
  const isOverbudget = totalPlanned > targetAmount;

  const handleStartEdit = (cat: BudgetItem) => {
    setEditingId(cat.id);
    setEditValue(cat.plannedAmount.toString());
  };

  const handleSaveEdit = (id: string) => {
    const num = Number.parseInt(editValue.replace(/[^0-9]/g, ""), 10);
    if (!Number.isNaN(num) && num >= 0) {
      onUpdateCategory(id, num);
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Satu buku anggaran, tanpa teka-teki.
          </h2>
          <p className="text-xs text-secondary">
            Rencana biaya ≠ tagihan. PIC anggaran bukan pembayar aktual. Enter simpan · Esc batal.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="small" onClick={onOpenConflictDialog}>
            <Icon name="history" size={14} className="mr-1.5" />
            Simulasi Konflik Edit
          </Button>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Rencana</span>
          <span className={styles.metricValue}>{formatRupiah(totalPlanned)}</span>
          <span className={styles.metricDetail}>
            {isOverbudget ? (
              <span className="text-danger font-semibold">
                Lebih {formatRupiah(totalPlanned - targetAmount)} dari target!
              </span>
            ) : (
              "11 kategori · sesuai target"
            )}
          </span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Pembayaran Tercatat</span>
          <span className={styles.metricValue}>{formatRupiah(totalPaid)}</span>
          <span className={styles.metricDetail}>Berdasarkan bukti pembayaran</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Belum Dibayar</span>
          <span className={styles.metricValue}>{formatRupiah(totalRemaining)}</span>
          <span className={styles.metricDetail}>Rencana − pembayaran</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kesesuaian Target</span>
          <span className="font-mono text-xl font-semibold text-foreground mt-1">
            {formatRupiah(targetAmount)}
          </span>
          <span className="text-xs text-secondary">Target total pernikahan</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>PIC Anggaran</th>
              <th>Rencana (Klik untuk edit)</th>
              <th>Dibayar</th>
              <th>Sisa</th>
              <th>Progres</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const remaining = Math.max(0, cat.plannedAmount - cat.paidAmount);
              const percent =
                cat.plannedAmount > 0
                  ? Math.min(100, Math.round((cat.paidAmount / cat.plannedAmount) * 100))
                  : 0;

              return (
                <tr key={cat.id}>
                  <td className="font-medium text-foreground">{cat.name}</td>
                  <td className="text-secondary">{cat.pic}</td>
                  <td>
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(cat.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        onBlur={() => handleSaveEdit(cat.id)}
                        className="rounded border border-primary px-2 py-1 font-mono text-xs w-32 bg-surface"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="font-mono hover:underline text-left text-foreground cursor-pointer flex items-center gap-1.5"
                        title="Klik untuk mengubah rencana"
                      >
                        {formatRupiah(cat.plannedAmount)}
                        <Icon name="pencil" size={11} className="text-secondary opacity-60" />
                      </button>
                    )}
                  </td>
                  <td className="font-mono text-success">{formatRupiah(cat.paidAmount)}</td>
                  <td className="font-mono text-secondary">{formatRupiah(remaining)}</td>
                  <td>
                    <span className="text-xs font-mono font-medium text-secondary">{percent}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
