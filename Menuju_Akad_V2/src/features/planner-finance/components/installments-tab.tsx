"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { InstallmentItem } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";
import styles from "./finance.module.css";

type Props = {
  installments: InstallmentItem[];
  cashRemaining: number;
  gapAmount: number;
  onOpenTargetSimulator: () => void;
};

export function InstallmentsTab({
  installments,
  cashRemaining,
  gapAmount,
  onOpenTargetSimulator,
}: Props) {
  const novemberTotal = installments
    .filter((i) => i.dueDate.includes("Nov 2026"))
    .reduce((s, i) => s + i.amount, 0);

  const totalUnpaid = installments.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            13 rencana termin · belum diverifikasi sebagai tagihan.
          </h2>
          <p className="text-xs text-secondary">
            Jadwal dari catatan manual. Pengingat tidak melakukan pembayaran otomatis.
          </p>
        </div>
        <Button variant="secondary" size="small" onClick={onOpenTargetSimulator}>
          <Icon name="sparkles" size={14} className="mr-1.5" />
          Atur target kontribusi
        </Button>
      </div>

      <div className={styles.disclaimerCard}>
        <Icon name="shield" size={18} className="text-brand-secondary mt-0.5 shrink-0" />
        <div>
          <strong className="block font-medium text-foreground">
            Vendor Hidden · catatan mandiri.
          </strong>
          <span>
            Kontrak dan jadwal tetap dicatat manual. Tidak ada sinkronisasi escrow atau autodebit ke
            rekening vendor.
          </span>
        </div>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Termin November</span>
          <span className={styles.metricValue}>{formatRupiah(novemberTotal)}</span>
          <span className={styles.metricDetail}>3 pengingat jatuh tempo Nov 2026</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Belum Dibayar</span>
          <span className={styles.metricValue}>{formatRupiah(totalUnpaid)}</span>
          <span className={styles.metricDetail}>13 rencana termin manual</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Sisa Dana Acara</span>
          <span className={styles.metricValue}>{formatRupiah(cashRemaining)}</span>
          <span className={styles.metricDetail}>Alokasi kas siap pakai</span>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Kekurangan Pendanaan</span>
          <span className={styles.metricValue}>{formatRupiah(gapAmount)}</span>
          <span className={styles.metricDetail}>Dana belum cukup untuk sisa rencana</span>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">
            Daftar Termin Pembayaran ({installments.length})
          </h3>
          <span className="text-xs text-secondary">Bukan liabilitas terverifikasi</span>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Termin</th>
              <th>Kategori</th>
              <th>Pengingat / Rekening</th>
              <th>Nominal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((i) => (
              <tr key={i.id}>
                <td className="text-secondary font-mono text-xs">{i.dueDate}</td>
                <td className="font-medium text-foreground">{i.title}</td>
                <td className="text-secondary">{i.category}</td>
                <td className="text-secondary text-xs">{i.payer}</td>
                <td className="font-mono font-semibold text-foreground">
                  {formatRupiah(i.amount)}
                </td>
                <td>
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded-full bg-ux-dock text-secondary">
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-border bg-ux-dock text-xs text-secondary flex flex-wrap items-center justify-between gap-2">
          <span>
            Total rencana {formatRupiah(totalUnpaid)}; konfirmasi kontrak dan invoice sebelum
            menandai sebagai lunas.
          </span>
          <Button variant="secondary" size="small" onClick={onOpenTargetSimulator}>
            Buka simulasi kontribusi
          </Button>
        </div>
      </div>
    </div>
  );
}
