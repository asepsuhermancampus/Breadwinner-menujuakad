"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import type { InvoiceView } from "@/features/payments/types";
import { isWithinOriginalPrice } from "../domain/payment-pricing";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function QrisInvoiceCard({
  invoice,
  isRefreshing,
  onRefresh,
  onCreateNew,
  isCreating,
  isSubscription = false,
}: {
  invoice: InvoiceView;
  isRefreshing: boolean;
  onRefresh: () => void;
  onCreateNew: () => void;
  isCreating: boolean;
  isSubscription?: boolean;
}) {
  const isTerminal = invoice.status === "paid" || invoice.status === "expired";
  const originalAmount = invoice.originalAmount ?? invoice.amount;
  const discountAmount = invoice.discountAmount ?? 0;
  const payable = isWithinOriginalPrice(invoice.amount, originalAmount, invoice.totalAmount);
  const amountMismatch = invoice.totalAmount !== null && !payable;
  const statusLabels = {
    creating: "Membuat tagihan",
    unknown: "Perlu diperiksa",
    pending: "Menunggu pembayaran",
    paid: "Lunas",
    expired: "Kedaluwarsa",
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            ID Pesanan
          </span>
          <div className="flex items-center gap-2">
            <span className="break-all font-mono text-xs font-semibold text-foreground">
              {invoice.orderId}
            </span>
          </div>
        </div>
        <span className="rounded-full bg-subtle px-3 py-1 font-mono text-xs font-bold uppercase">
          {amountMismatch && !isTerminal ? "Nominal tidak sesuai" : statusLabels[invoice.status]}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-canvas p-3 font-mono text-xs">
        <div className="flex justify-between text-secondary">
          <span>Harga awal:</span>
          <span>{formatRupiah(originalAmount)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="mt-2 flex justify-between text-success">
            <span>Diskon pengguna baru:</span>
            <span>−{formatRupiah(discountAmount)}</span>
          </div>
        )}
        {(invoice.upgradeCredit ?? 0) > 0 && (
          <div className="mt-2 flex justify-between text-success">
            <span>Kredit Premium:</span>
            <span>−{formatRupiah(invoice.upgradeCredit!)}</span>
          </div>
        )}
        <div className="mt-2 flex justify-between text-secondary">
          <span>Setelah diskon:</span>
          <span>{formatRupiah(invoice.amount)}</span>
        </div>
        {invoice.totalAmount !== null && (
          <div className="mt-2 flex justify-between text-secondary">
            <span>Kode unik:</span>
            <span>+{formatRupiah(invoice.totalAmount - invoice.amount)}</span>
          </div>
        )}
        <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2 text-sm font-bold text-foreground sm:flex-row sm:justify-between">
          <span>{amountMismatch ? "Nominal dari penyedia:" : "Total pembayaran:"}</span>
          <span className="shrink-0 text-brand-secondary">
            {invoice.totalAmount === null
              ? "Menunggu nominal resmi"
              : formatRupiah(invoice.totalAmount)}
          </span>
        </div>
        {invoice.expiresAt && (
          <div className="mt-2 text-[11px] text-secondary">
            Batas Pembayaran: {invoice.expiresAt}
          </div>
        )}
        {invoice.paidAt && (
          <div className="mt-1 text-[11px] text-success">Waktu Lunas: {invoice.paidAt}</div>
        )}
      </div>

      {amountMismatch && !isTerminal && (
        <Status tone="danger">
          Pembayaran dihentikan karena total dari penyedia tidak sesuai batas harga. Total akhir
          termasuk kode unik tidak boleh melebihi {formatRupiah(originalAmount)}. QR tidak
          ditampilkan dan diskon tidak ditambah otomatis.
        </Status>
      )}

      {invoice.qrImage && payable && !isTerminal && (
        <div className="flex flex-col items-center justify-center p-2">
          <Image
            src={invoice.qrImage}
            alt="Kode QRIS Pembayaran"
            width={320}
            height={320}
            unoptimized
            className="h-auto max-w-full rounded-lg border border-border bg-white p-4"
          />
          <p className="mt-2 text-center text-xs text-secondary">
            Pindai dengan aplikasi m-Banking atau e-Wallet yang mendukung QRIS.
          </p>
        </div>
      )}

      {invoice.status === "unknown" && (
        <Status tone="warning">
          Status transaksi belum dipastikan oleh penyedia. Silakan tekan tombol &quot;Cek
          Status&quot; dan jangan membuat tagihan baru.
        </Status>
      )}

      {invoice.status === "paid" && (
        <div
          role="status"
          className="rounded-xl border border-success/30 bg-success-bg p-4 text-center"
        >
          <p className="text-sm font-bold text-success">Pembayaran Berhasil Diterima</p>
          <p className="mt-1 text-xs text-secondary">
            {isSubscription
              ? "Pembayaran paket telah diverifikasi oleh penyedia."
              : "Transaksi pengujian telah selesai diverifikasi."}
          </p>
        </div>
      )}

      {invoice.status === "expired" && (
        <div
          role="status"
          className="rounded-xl border border-danger/30 bg-danger-bg p-4 text-center"
        >
          <p className="text-sm font-bold text-danger">Tagihan Telah Kedaluwarsa</p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {invoice.status !== "paid" && (
          <Button variant="secondary" size="small" disabled={isRefreshing} onClick={onRefresh}>
            {isRefreshing ? "Memeriksa..." : "Cek Status"}
          </Button>
        )}
        {isTerminal && !isSubscription && (
          <Button variant="primary" size="small" disabled={isCreating} onClick={onCreateNew}>
            {isCreating ? "Membuat..." : "Buat Tagihan Uji Baru"}
          </Button>
        )}
      </div>
    </div>
  );
}
