"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { InvoiceView } from "../types";
import type { PlanQuote } from "../checkout-types";
export function usePlanPayment(intentId: string) {
  const [invoice, setInvoice] = useState<InvoiceView | null>(null);
  const [quote, setQuote] = useState<PlanQuote | null>(null);
  const [loading, setLoading] = useState(true),
    [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const active = useRef(false),
    current = useRef<InvoiceView | null>(null);
  const lifetime = useRef<AbortController | null>(null);
  const request = useCallback(
    async (url: string, method: "GET" | "POST" | "DELETE", signal: AbortSignal) => {
      const response = await fetch(url, {
        method,
        cache: "no-store",
        signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
      });
      const data = (await response.json()) as {
        invoice?: InvoiceView;
        quote?: PlanQuote;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Pembayaran belum dapat diperiksa.");
      return data;
    },
    [],
  );
  useEffect(() => {
    const controller = new AbortController();
    lifetime.current = controller;
    void request(`/api/payments/plans/${intentId}/adopt`, "POST", controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        if (data.invoice) {
          setInvoice(data.invoice);
          current.current = data.invoice;
        }
        if (data.quote) setQuote(data.quote);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : "Gagal memuat pesanan");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [intentId, request]);
  const refresh = useCallback(
    async (manual = true) => {
      const controller = lifetime.current;
      if (active.current || !current.current || !controller || controller.signal.aborted) return;
      active.current = true;
      if (manual) setRefreshing(true);
      try {
        await request(
          `/api/payments/klikqris/${current.current.orderId}${manual ? "?manual=1" : ""}`,
          "GET",
          controller.signal,
        );
        const data = await request(
          `/api/payments/plans/${intentId}?checkout=1`,
          "GET",
          controller.signal,
        );
        if (controller.signal.aborted) return;
        if (data.invoice) {
          setInvoice(data.invoice);
          current.current = data.invoice;
        }
        setError("");
        if (manual)
          setMessage(
            `Pemeriksaan selesai ${new Date().toLocaleTimeString("id-ID")}. ${data.invoice?.status === "paid" ? "Pembayaran terverifikasi." : data.invoice?.status === "expired" ? "Tagihan masih kedaluwarsa menurut penyedia." : "Pembayaran masih menunggu konfirmasi penyedia."}`,
          );
      } catch (cause) {
        if (manual && !controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : "Gagal memeriksa status");
      } finally {
        active.current = false;
        if (manual && !controller.signal.aborted) setRefreshing(false);
      }
    },
    [intentId, request],
  );
  useEffect(() => {
    if (
      !invoice ||
      invoice.cancelledAt ||
      invoice.status === "paid" ||
      invoice.status === "expired"
    )
      return;
    const timer = setInterval(() => void refresh(false), 5000);
    return () => clearInterval(timer);
  }, [invoice, refresh]);
  async function cancel() {
    const controller = lifetime.current;
    if (active.current || !controller || controller.signal.aborted) {
      setError("Pemeriksaan masih berlangsung. Coba batalkan sesaat lagi.");
      return false;
    }
    active.current = true;
    setError("");
    try {
      const data = await request(`/api/payments/plans/${intentId}`, "DELETE", controller.signal);
      if (!data.quote?.cancelledAt) throw new Error("Pembatalan belum terkonfirmasi.");
      const cancelledAt = data.quote.cancelledAt;
      setQuote(data.quote);
      setMessage("");
      setInvoice((previous) => (previous ? { ...previous, cancelledAt, qrImage: null } : null));
      return true;
    } catch (cause) {
      if (!controller.signal.aborted)
        setError(cause instanceof Error ? cause.message : "Pembatalan gagal");
      return false;
    } finally {
      active.current = false;
    }
  }
  return { invoice, quote, loading, refreshing, error, message, refresh, cancel };
}
