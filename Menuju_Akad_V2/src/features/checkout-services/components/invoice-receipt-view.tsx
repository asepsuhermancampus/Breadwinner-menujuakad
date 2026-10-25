"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { useTransactionSnapshot } from "../model/transaction-store";
import { DisputeSubmissionDialog } from "./dispute-submission-dialog";
import { UnverifiedInvoiceView } from "./unverified-invoice-view";

type InvoiceReceiptProps = {
  orderId?: string | undefined;
};

export function InvoiceReceiptView({ orderId = "ORD-SIM-204" }: InvoiceReceiptProps) {
  const tx = useTransactionSnapshot(orderId);
  const isFull = tx.scheme === "full";
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const isVerified = tx.status === "verified";

  if (!isVerified) {
    return <UnverifiedInvoiceView tx={tx} />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Tanda Terima Resmi & Jadwal Termin
          </span>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Invoice & Receipt: {tx.invoiceNumber}
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Pesanan: <strong>{tx.orderId}</strong> · Terverifikasi 25 Okt 2026, 10.50 WIB
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

      {/* Official Receipt Card */}
      <div className="p-6 bg-surface rounded-2xl border-2 border-primary/20 space-y-4 shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-2 pb-3 border-b border-border">
          <div>
            <div className="text-xs font-bold text-foreground">
              {isFull
                ? "BUKTI PELUNASAN KONTRAK (BAYAR PENUH 100%)"
                : "BUKTI PEMBAYARAN UANG MUKA (DP 30%)"}
            </div>
            <div className="font-mono text-xs text-secondary mt-0.5">
              Receipt No: {tx.receiptNumber} · Provider:{" "}
              {tx.gateway === "midtrans" ? "Virtual Account" : "KlikQRIS"} (SETTLED)
            </div>
          </div>
          <Status tone="success">
            {isFull ? "Pelunasan Terverifikasi" : "DP Lunas Terverifikasi"}
          </Status>
        </div>

        <div className="overflow-x-auto border border-border rounded-xl text-xs">
          <table className="w-full text-left">
            <thead className="bg-subtle text-secondary font-semibold border-b border-border">
              <tr>
                <th className="p-3">Item Layanan</th>
                <th className="p-3">Nilai Kontrak</th>
                <th className="p-3">{isFull ? "Pelunasan Dibayar" : "DP Dibayar"}</th>
                <th className="p-3">Status Escrow</th>
              </tr>
            </thead>
            <tbody>
              {tx.items.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="p-3 font-semibold text-foreground">{item.label}</td>
                  <td className="p-3 font-mono">{formatIdr(item.totalPriceIdr)}</td>
                  <td className="p-3 font-mono text-primary font-bold">
                    {formatIdr(item.paidAmountIdr)}
                  </td>
                  <td className="p-3 text-secondary">Ditahan aman di escrow</td>
                </tr>
              ))}
              <tr className="bg-canvas font-bold">
                <td className="p-3 text-foreground">
                  {isFull ? "Total Diterima (Bayar Penuh)" : "Total Diterima (DP 30%)"}
                </td>
                <td className="p-3 font-mono text-sm text-foreground">
                  {formatIdr(tx.totalAmountIdr)}
                </td>
                <td className="p-3 font-mono text-sm text-primary">
                  {formatIdr(tx.paidAmountIdr)}
                </td>
                <td className="p-3 text-success">Lunas Masuk Rekening Escrow</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-canvas rounded-xl border border-border space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">
            {isFull
              ? "Status Pelunasan Kontrak (Sisa Rp 0)"
              : `Jadwal Sisa Pembayaran (Sisa ${formatIdr(tx.remainingAmountIdr)})`}
          </div>
          {isFull ? (
            <div className="p-3 bg-surface rounded-lg border border-border text-xs">
              <div className="font-semibold text-foreground">Tidak Ada Tagihan Termin Tersisa</div>
              <p className="text-secondary mt-1">
                Seluruh nilai kontrak {formatIdr(tx.totalAmountIdr)} telah dibayar penuh dalam satu
                transaksi aman.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-surface rounded-lg border border-border">
                <div className="font-semibold text-secondary">Termin 2 · 40%</div>
                <div className="font-mono text-sm font-bold text-foreground mt-0.5">
                  {formatIdr(14000000)}
                </div>
                <div className="text-[11px] text-muted mt-0.5">Jatuh tempo 15 Januari 2027</div>
              </div>
              <div className="p-3 bg-surface rounded-lg border border-border">
                <div className="font-semibold text-secondary">Pelunasan Akhir · 30%</div>
                <div className="font-mono text-sm font-bold text-foreground mt-0.5">
                  {formatIdr(10500000)}
                </div>
                <div className="text-[11px] text-muted mt-0.5">Jatuh tempo 07 Februari 2027</div>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
          {isFull ? (
            <>
              <strong>Perhatian:</strong> Kontrak telah lunas sepenuhnya (100%). Seluruh dana
              disimpan di rekening penampung aman dan dilepas ke saldo siap cair vendor setelah
              konfirmasi pekerjaan selesai.
            </>
          ) : (
            <>
              <strong>Perhatian:</strong> Pembayaran DP bukan berarti kontrak lunas sepenuhnya. Sisa
              pembayaran {formatIdr(tx.remainingAmountIdr)} wajib diselesaikan sesuai jadwal termin
              di atas. Dana DP ditahan di rekening penampung aman dan dilepas ke saldo siap cair
              vendor setelah konfirmasi pekerjaan selesai.
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
