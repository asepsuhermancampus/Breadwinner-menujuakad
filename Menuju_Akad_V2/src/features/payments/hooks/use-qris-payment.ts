"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { InvoiceView, PaymentSnapshot, DiscountOffer } from "../types";
import { fetchInvoice, useQrisTransport } from "./use-qris-transport";

const isActive = (invoice: InvoiceView | null) =>
  Boolean(invoice && ["creating", "pending", "unknown"].includes(invoice.status));
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Layanan QRIS belum dapat dihubungi.";

export function useQrisPayment() {
  const [invoice, setInvoice] = useState<InvoiceView | null>(null);
  const [discountOffer, setDiscountOffer] = useState<DiscountOffer | null>(null);
  const [isLoadingCurrent, setLoading] = useState(true);
  const [hasLoadedCurrent, setLoaded] = useState(false);
  const [isCreating, setCreating] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkMessage, setCheckMessage] = useState("");
  const current = useRef<InvoiceView | null>(null);
  const loaded = useRef(false);
  const run = useQrisTransport();
  const accept = useCallback((snapshot: PaymentSnapshot) => {
    const value = snapshot.invoice;
    current.current = value;
    setInvoice(value);
    if (snapshot.discountOffer) setDiscountOffer(snapshot.discountOffer);
    if (value?.status === "paid") setDiscountOffer(null);
    loaded.current = true;
    setLoaded(true);
  }, []);

  const loadCurrent = useCallback(
    () =>
      run(async (signal) => {
        loaded.current = false;
        setLoaded(false);
        setLoading(true);
        setError(null);
        try {
          const value = await fetchInvoice("", "GET", signal);
          if (!signal.aborted) accept(value);
        } catch (cause) {
          if (!signal.aborted) setError(message(cause));
        } finally {
          if (!signal.aborted) setLoading(false);
        }
      }),
    [accept, run],
  );

  const createInvoice = useCallback(
    async (claimDiscount = false) => {
      if (!loaded.current || isActive(current.current)) return;
      await run(async (signal) => {
        setCreating(true);
        setError(null);
        try {
          const value = await fetchInvoice("", "POST", signal, claimDiscount);
          if (!signal.aborted) accept(value);
        } catch (cause) {
          if (signal.aborted) return;
          setError(message(cause));
          loaded.current = false;
          setLoaded(false);
          // A timed-out POST may have created a reservation. Restore it before enabling creation.
          try {
            const recovered = await fetchInvoice("", "GET", signal);
            if (!signal.aborted) accept(recovered);
          } catch {
            if (!signal.aborted)
              setError("Belum dapat memastikan tagihan. Muat ulang status sebelum mencoba lagi.");
          }
        } finally {
          if (!signal.aborted) setCreating(false);
        }
      });
    },
    [accept, run],
  );

  const refreshStatus = useCallback(
    (manual = true) =>
      run(async (signal) => {
        const target = current.current;
        if (!target || target.status === "paid" || (!manual && !isActive(target))) return;
        if (manual) setRefreshing(true);
        try {
          const value = await fetchInvoice(
            `/${encodeURIComponent(target.orderId)}${manual ? "?manual=1" : ""}`,
            "GET",
            signal,
          );
          if (!value.invoice) throw new Error("Tagihan belum ditemukan.");
          if (!signal.aborted) {
            accept(value);
            setError(null);
            if (manual)
              setCheckMessage(
                `Pemeriksaan selesai ${new Date().toLocaleTimeString("id-ID")}. ${value.invoice.status === "paid" ? "Pembayaran terverifikasi." : value.invoice.status === "expired" ? "Tagihan kedaluwarsa menurut penyedia." : "Pembayaran masih menunggu konfirmasi penyedia."}`,
              );
          }
        } catch (cause) {
          if (manual && !signal.aborted) setError(message(cause));
        } finally {
          if (manual && !signal.aborted) setRefreshing(false);
        }
      }),
    [accept, run],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadCurrent();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadCurrent]);

  const status = invoice?.status;
  useEffect(() => {
    if (!status || status === "paid" || status === "expired") return;
    const timer = setInterval(() => {
      void refreshStatus(false);
    }, 5000);
    return () => clearInterval(timer);
  }, [status, refreshStatus]);

  return {
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
  };
}
