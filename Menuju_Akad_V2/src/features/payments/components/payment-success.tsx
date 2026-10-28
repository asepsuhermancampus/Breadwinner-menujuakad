"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import type { InvoiceView } from "../types";
export function PaymentSuccess({
  invoice,
  subscription = false,
}: {
  invoice: InvoiceView;
  subscription?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const accessReady = subscription && invoice.accessReady === true;
  const href = accessReady ? "/dashboard?tour=features" : "/dashboard";
  const label = subscription ? "Buka dashboard dan fitur paket" : "Buka dashboard";
  const link = (
    <Link
      href={href}
      className="inline-flex justify-center rounded-control bg-primary px-5 py-3 text-sm font-semibold text-on-primary"
    >
      {label}
    </Link>
  );
  return (
    <>
      <Dialog open={open} title="Pembayaran berhasil" onClose={() => setOpen(false)}>
        <div className="space-y-5 text-center">
          <CheckCircle2 className="mx-auto text-success" size={52} aria-hidden="true" />
          <p className="text-sm text-secondary">Pembayaran telah diterima dan diverifikasi.</p>
          <p className="text-2xl font-semibold">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(invoice.totalAmount ?? invoice.amount)}
          </p>
          <p className="break-all text-xs text-secondary">ID pesanan: {invoice.orderId}</p>
          <p className="text-sm text-secondary">
            {invoice.settlementIssue
              ? invoice.settlementIssue
              : accessReady
                ? "Fitur paket kalian sudah terbuka. Jelajahi panduannya di dashboard."
                : subscription
                  ? "Pembayaran terverifikasi. Akses paket sedang direkonsiliasi; hubungi bantuan dengan ID pesanan jika belum aktif."
                  : "Transaksi pengujian selesai. Tagihan uji tidak mengaktifkan paket."}
          </p>
          {link}
          {invoice.settlementIssue && (
            <Link href="/account/support" className="block text-sm underline">
              Lihat bantuan untuk pesanan ini
            </Link>
          )}
        </div>
      </Dialog>
      {!open && link}
    </>
  );
}
