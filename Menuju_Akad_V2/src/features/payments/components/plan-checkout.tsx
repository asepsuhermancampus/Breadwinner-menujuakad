"use client";
import Link from "next/link";
import { getPlan } from "@/features/plans/domain/catalog";
import { QrisInvoiceCard } from "./qris-invoice-card";
import { usePlanPayment } from "../hooks/use-plan-payment";
import { PaymentSuccess } from "./payment-success";
import { CancelPlanOrder } from "./cancel-plan-order";
export function PlanCheckout({ intentId }: { intentId: string }) {
  const state = usePlanPayment(intentId);
  return (
    <div className="space-y-5">
      <header className="rounded-card border border-ux-border bg-surface p-6">
        <h1 className="text-2xl font-semibold text-primary">
          Pembayaran paket {state.quote ? getPlan(state.quote.planId).label : "kalian"}
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Bayar sesuai total QRIS. Profil dapat dilengkapi setelah pembayaran.
        </p>
      </header>
      {state.error && (
        <p
          role="alert"
          className="rounded-card border border-danger/30 bg-surface p-4 text-sm text-danger"
        >
          {state.error}
        </p>
      )}
      {state.invoice?.status !== "paid" &&
      (state.invoice?.cancelledAt || state.quote?.cancelledAt) ? (
        <div role="status" className="rounded-card border border-ux-border bg-surface p-6">
          <h2 className="font-semibold">Pesanan dibatalkan</h2>
          <p className="mt-2 text-sm text-secondary">
            Jangan membayar QR pesanan lama. Pilih paket kembali untuk membuat pesanan baru.
          </p>
        </div>
      ) : state.loading ? (
        <p role="status">Memuat pesanan…</p>
      ) : (
        state.invoice && (
          <QrisInvoiceCard
            invoice={state.invoice}
            isRefreshing={state.refreshing}
            onRefresh={() => void state.refresh()}
            onCreateNew={() => {}}
            isCreating={false}
            isSubscription
          />
        )
      )}
      {!state.loading &&
        state.invoice?.status !== "paid" &&
        !state.invoice?.cancelledAt &&
        !state.quote?.cancelledAt && (
          <CancelPlanOrder cancel={state.cancel} disabled={state.refreshing} error={state.error} />
        )}
      {state.message && (
        <p role="status" className="text-sm text-secondary">
          {state.message}
        </p>
      )}
      {state.invoice?.status === "paid" && (
        <PaymentSuccess key={state.invoice.orderId} invoice={state.invoice} subscription />
      )}
      <Link href="/#paket" className="block text-sm text-secondary underline">
        Kembali ke pilihan paket
      </Link>
    </div>
  );
}
