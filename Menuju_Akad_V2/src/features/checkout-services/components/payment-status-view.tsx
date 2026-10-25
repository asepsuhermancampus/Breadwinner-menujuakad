"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import type { PaymentStatusType } from "../types/checkout";
import { useTransactionSnapshot, updateTransactionStatus } from "../model/transaction-store";

type Props = {
  orderId?: string | undefined;
  initialStatus?: PaymentStatusType | undefined;
  amountIdr?: number | undefined;
  onViewReceipt?: (() => void) | undefined;
};

export function PaymentStatusView({
  orderId = "ORD-SIM-204",
  initialStatus,
  amountIdr,
  onViewReceipt,
}: Props) {
  const tx = useTransactionSnapshot(orderId);
  const [overrideStatus, setOverrideStatus] = useState<PaymentStatusType | undefined>(
    initialStatus,
  );
  const status = overrideStatus ?? tx.status;
  const displayAmount = amountIdr ?? tx.paidAmountIdr;
  const isFull = tx.scheme === "full";

  const handleStatusChange = (newStatus: PaymentStatusType) => {
    setOverrideStatus(newStatus);
    updateTransactionStatus(orderId, newStatus);
  };

  return (
    <div className="p-6 bg-surface rounded-2xl border border-border space-y-5 shadow-sm">
      <div className="flex flex-wrap justify-between items-start gap-2 pb-3 border-b border-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Status Pembayaran Otoritatif · PAY-SIM-204-01
          </span>
          <h2 className="text-xl font-bold text-foreground mt-0.5">
            Status Transaksi yang Tidak Menebak
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Sistem memverifikasi webhook dan status penyedia secara deterministik & idempoten.
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => handleStatusChange("waiting")}
            className={`px-2 py-1 text-[11px] rounded ${status === "waiting" ? "bg-warning text-white" : "bg-subtle text-secondary"}`}
          >
            Menunggu
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("failed")}
            className={`px-2 py-1 text-[11px] rounded ${status === "failed" ? "bg-danger text-white" : "bg-subtle text-secondary"}`}
          >
            Gagal Definitif
          </button>
          <button
            type="button"
            onClick={() => handleStatusChange("verified")}
            className={`px-2 py-1 text-[11px] rounded ${status === "verified" ? "bg-success text-white" : "bg-subtle text-secondary"}`}
          >
            Terkonfirmasi
          </button>
        </div>
      </div>

      {status === "waiting" && (
        <div className="p-5 bg-warning-bg/30 border border-warning/40 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-warning uppercase">Menunggu Kepastian Penyedia</span>
            <Status tone="warning">Status: Unknown / Processing</Status>
          </div>
          <div className="text-xl font-bold font-mono text-foreground">
            {formatIdr(displayAmount)}
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Penyedia pembayaran belum memberikan hasil akhir transaksi. Sistem mempertahankan
            payment intent yang sama (PAY-SIM-204-01) untuk mencegah penarikan dana berganda.
          </p>
          <div className="p-3 bg-surface rounded border border-border text-xs text-secondary">
            <strong>Jangan membayar ulang:</strong> Menekan tombol bayar berulang kali saat status
            belum pasti berisiko menduplikasi potongan saldo bank Anda.
          </div>
        </div>
      )}

      {status === "failed" && (
        <div className="p-5 bg-danger-bg/30 border border-danger/40 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-danger uppercase">Gagal Definitif</span>
            <Status tone="danger">Status: Gagal / Expired</Status>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Penyedia pembayaran telah memastikan bahwa transaksi tidak berhasil diproses atau waktu
            pembayaran telah kedaluwarsa.
          </p>
          <div className="p-3 bg-surface rounded border border-border text-xs text-secondary">
            Percobaan ulang pembayaran hanya diizinkan setelah penyedia menyatakan gagal definitif.
            Sistem menautkan percobaan baru ke invoice yang sama tanpa membuat pesanan baru yang
            membingungkan.
          </div>
          <Button variant="secondary" size="small" onClick={() => handleStatusChange("waiting")}>
            Coba Bayar Kembali (Invoice Sama)
          </Button>
        </div>
      )}

      {status === "verified" && (
        <div className="p-5 bg-success-bg/30 border border-success/40 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-success uppercase">
              Pembayaran Terverifikasi & Lunas
            </span>
            <Status tone="success">Status: SETTLED</Status>
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {formatIdr(displayAmount)}
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Signature webhook, nomor invoice {tx.invoiceNumber}, dan nominal pembayaran{" "}
            {formatIdr(displayAmount)} telah tervalidasi cocok.{" "}
            {isFull
              ? "Pelunasan penuh berhasil dicatat ke dalam rekening penampung aman (escrow)."
              : "DP berhasil dicatat ke dalam rekening penampung aman (escrow)."}
          </p>
          <div className="p-3 bg-surface rounded border border-border text-xs text-secondary space-y-1">
            <div className="font-bold text-foreground">
              {isFull
                ? "Bukti Pelunasan Penuh (Receipt) Resmi Diterbitkan"
                : "Bukti Tanda Terima (Receipt) Resmi Diterbitkan"}
            </div>
            <div className="text-[11px] font-mono text-secondary">
              {tx.receiptNumber} · Transaksi Idempoten
            </div>
          </div>
          <div className="pt-2">
            {onViewReceipt ? (
              <Button variant="primary" onClick={onViewReceipt}>
                Buka Invoice & Receipt Resmi →
              </Button>
            ) : (
              <Link
                href={`/orders/${tx.orderId}`}
                className="inline-flex items-center px-4 py-2.5 rounded-control bg-primary text-white text-xs font-semibold hover:bg-primary-hover"
              >
                Buka Invoice & Receipt Resmi →
              </Link>
            )}
          </div>
        </div>
      )}

      <p className="text-[11px] text-muted leading-relaxed bg-subtle p-3 rounded-control border border-border">
        <strong>Prinsip Keamanan Finansial:</strong> Pengalihan halaman kembali dari browser bukan
        bukti pelunasan. Menuju Akad selalu memeriksa status authoritatif server sebelum merilis
        tanda terima dan mengunci slot vendor.
      </p>
    </div>
  );
}
