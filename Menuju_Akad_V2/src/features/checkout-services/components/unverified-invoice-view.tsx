"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import type { TransactionSnapshot } from "../model/transaction-types";
import { DisputeSubmissionDialog } from "./dispute-submission-dialog";

type UnverifiedInvoiceProps = {
  tx: TransactionSnapshot;
};

export function UnverifiedInvoiceView({ tx }: UnverifiedInvoiceProps) {
  const isFull = tx.scheme === "full";
  const isWaiting = tx.status === "waiting";
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Tagihan Pembayaran Belum Terverifikasi
          </span>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">Invoice: {tx.invoiceNumber}</h1>
          <p className="text-xs text-secondary mt-0.5">
            Pesanan: <strong>{tx.orderId}</strong> ·{" "}
            {isWaiting ? "Menunggu Konfirmasi Pembayaran" : "Pembayaran Gagal / Kedaluwarsa"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="small"
            className="text-xs border-danger text-danger hover:bg-danger-bg"
            onClick={() => setDisputeOpen(true)}
          >
            Ajukan Sengketa Terarah…
          </Button>
        </div>
      </div>

      {disputeSubmitted && (
        <div className="p-3 bg-warning-bg text-warning border border-warning/40 rounded-control text-xs font-semibold">
          ✓ Permohonan sengketa untuk item Lensa Teduh telah diterima dan diteruskan ke tim mediasi
          kepatuhan.
        </div>
      )}

      {/* Invoice Card */}
      <div className="p-6 bg-surface rounded-2xl border-2 border-border space-y-4 shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-2 pb-3 border-b border-border">
          <div>
            <div className="text-xs font-bold text-foreground">
              TAGIHAN PEMBAYARAN {isFull ? "PENUH (100%)" : "UANG MUKA (DP 30%)"}
            </div>
            <div className="font-mono text-xs text-secondary mt-0.5">
              Invoice No: {tx.invoiceNumber} · Provider:{" "}
              {tx.gateway === "midtrans" ? "Virtual Account" : "KlikQRIS"}{" "}
              {isWaiting ? "(PENDING)" : "(FAILED)"}
            </div>
          </div>
          <Status tone={isWaiting ? "warning" : "danger"}>
            {isWaiting ? "Menunggu Verifikasi" : "Pembayaran Gagal"}
          </Status>
        </div>

        <div className="overflow-x-auto border border-border rounded-xl text-xs">
          <table className="w-full text-left">
            <thead className="bg-subtle text-secondary font-semibold border-b border-border">
              <tr>
                <th className="p-3">Item Layanan</th>
                <th className="p-3">Nilai Kontrak</th>
                <th className="p-3">Jumlah Ditagihkan</th>
                <th className="p-3">Status Tagihan</th>
              </tr>
            </thead>
            <tbody>
              {tx.items.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="p-3 font-semibold text-foreground">{item.label}</td>
                  <td className="p-3 font-mono">{formatIdr(item.totalPriceIdr)}</td>
                  <td className="p-3 font-mono text-brand-secondary font-bold">
                    {formatIdr(item.paidAmountIdr)}
                  </td>
                  <td className="p-3 text-secondary">
                    {isWaiting ? "Menunggu Verifikasi" : "Belum Terbayar"}
                  </td>
                </tr>
              ))}
              <tr className="bg-canvas font-bold">
                <td className="p-3 text-foreground">
                  Total Tagihan ({isFull ? "Bayar Penuh" : "DP 30%"})
                </td>
                <td className="p-3 font-mono text-sm text-foreground">
                  {formatIdr(tx.totalAmountIdr)}
                </td>
                <td className="p-3 font-mono text-sm text-brand-secondary">
                  {formatIdr(tx.paidAmountIdr)}
                </td>
                <td className={`p-3 ${isWaiting ? "text-warning" : "text-danger"}`}>
                  {isWaiting ? "Menunggu Verifikasi Pembayaran" : "Pembayaran Gagal / Dibatalkan"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-canvas rounded-xl border border-border space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">
            {isWaiting ? "Menunggu Verifikasi Pembayaran" : "Informasi Status Tagihan"}
          </div>
          <div className="p-3 bg-surface rounded-lg border border-border text-xs">
            <div className="font-semibold text-foreground">
              {isWaiting ? "Verifikasi Sedang Berjalan" : "Pembayaran Tidak Berhasil"}
            </div>
            <p className="text-secondary mt-1">
              {isWaiting
                ? `Tagihan pembayaran sebesar ${formatIdr(tx.paidAmountIdr)} telah dibuat dan sedang menunggu verifikasi pembayaran.`
                : `Tagihan pembayaran sebesar ${formatIdr(tx.paidAmountIdr)} belum berhasil diproses atau telah kedaluwarsa.`}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
          {isWaiting ? (
            <>
              <strong>Perhatian:</strong> Tagihan ini belum diverifikasi. Bukti tanda terima resmi
              dan jadwal termin hanya diterbitkan setelah pembayaran terverifikasi oleh sistem.
            </>
          ) : (
            <>
              <strong>Perhatian:</strong> Pembayaran untuk tagihan ini gagal atau kedaluwarsa. Tidak
              ada pembayaran yang tercatat lunas.
            </>
          )}
        </p>
      </div>

      <DisputeSubmissionDialog
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        onSubmitted={() => setDisputeSubmitted(true)}
      />
    </div>
  );
}
