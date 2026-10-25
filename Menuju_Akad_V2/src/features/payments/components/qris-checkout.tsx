"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { useQrisPayment } from "@/features/payments/hooks/use-qris-payment";
import { QrisInvoiceCard } from "./qris-invoice-card";
import { QrisDiscountOffer } from "./qris-discount-offer";
import { PaymentSuccess } from "./payment-success";

export function QrisCheckout({
  userEmail,
  userName,
  environment,
  isReady,
}: {
  userEmail: string;
  userName: string | null;
  environment: "production" | "sandbox" | null;
  isReady: boolean;
}) {
  const {
    invoice,
    discountOffer,
    isLoadingCurrent,
    hasLoadedCurrent,
    isCreating,
    isRefreshing,
    error,
    checkMessage,
    createInvoice,
    refreshStatus,
    loadCurrent,
  } = useQrisPayment();

  const envBadge =
    environment === "production"
      ? { text: "Pembayaran nyata" }
      : { text: environment === "sandbox" ? "Tanpa dana asli (Sandbox)" : "Belum tersedia" };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Pembayaran QRIS</h1>
            <p className="mt-1 break-words text-xs text-secondary">
              Terhubung sebagai <span className="font-semibold text-foreground">{userEmail}</span>
              {userName ? ` (${userName})` : ""}
            </p>
          </div>
          <span className="rounded-full bg-subtle px-3 py-1 font-mono text-xs font-bold text-foreground">
            {envBadge.text}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs leading-relaxed text-secondary">
            {environment === "production"
              ? "Tagihan uji ini menggunakan uang nyata dengan harga awal Rp5.000. Klaim diskon pengguna baru untuk menutup kode unik. Total akhir tidak akan melebihi harga awal."
              : environment === "sandbox"
                ? "Tagihan uji sandbox Rp5.000 ini tidak menggunakan uang nyata."
                : "Layanan pembayaran QRIS belum tersedia."}{" "}
            Tagihan uji ini terpisah dari pesanan contoh paket vendor pernikahan.
          </p>

          {!isReady && (
            <Status tone="danger">
              Layanan pembayaran QRIS belum tersedia. Silakan coba kembali nanti.
            </Status>
          )}

          {error && (
            <div className="space-y-2">
              <Status tone="danger">{error}</Status>
              {!hasLoadedCurrent && !isLoadingCurrent && (
                <Button variant="secondary" size="small" onClick={() => void loadCurrent()}>
                  Coba Muat Ulang
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {discountOffer?.eligible && (!invoice || invoice.status === "expired") && (
        <QrisDiscountOffer
          offer={discountOffer}
          disabled={isCreating || isLoadingCurrent || !isReady || !hasLoadedCurrent}
          onClaim={() => void createInvoice(true)}
        />
      )}

      {isLoadingCurrent ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center text-xs text-secondary">
          Memeriksa tagihan aktif...
        </div>
      ) : invoice ? (
        <QrisInvoiceCard
          invoice={invoice}
          isRefreshing={isRefreshing}
          onRefresh={() => void refreshStatus()}
          onCreateNew={() => void createInvoice()}
          isCreating={isCreating || !isReady || !hasLoadedCurrent}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-foreground">Belum ada tagihan aktif.</p>
          <p className="mb-4 mt-1 text-xs text-secondary">
            Klik tombol di bawah untuk membuat tagihan uji QRIS senilai Rp 5.000.
          </p>
          <Button
            variant="primary"
            disabled={isCreating || !isReady || !hasLoadedCurrent}
            onClick={() => void createInvoice()}
          >
            {isCreating ? "Membuat Tagihan..." : "Buat tagihan QRIS Rp5.000"}
          </Button>
        </div>
      )}

      {invoice?.status === "paid" && <PaymentSuccess key={invoice.orderId} invoice={invoice} />}
      <div className="text-center">
        {checkMessage && (
          <p role="status" className="mb-3 text-xs text-secondary">
            {checkMessage}
          </p>
        )}
        <Link href="/account" className="text-xs text-secondary underline hover:text-foreground">
          ← Kembali ke Akun
        </Link>
      </div>
    </div>
  );
}
