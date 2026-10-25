"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PaymentSnapshot } from "../types";

export async function fetchInvoice(
  path: string,
  method: "GET" | "POST",
  signal: AbortSignal,
  claimDiscount = false,
): Promise<PaymentSnapshot> {
  const response = await fetch(`/api/payments/klikqris${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
    },
    ...(method === "POST" ? { body: JSON.stringify({ claimNewUserDiscount: claimDiscount }) } : {}),
    cache: "no-store",
    signal: AbortSignal.any([signal, AbortSignal.timeout(20_000)]),
  });
  const body = (await response.json()) as Partial<PaymentSnapshot> & { error?: string };
  if (!response.ok) throw new Error(body.error ?? "Layanan pembayaran belum dapat dihubungi.");
  if (!("invoice" in body)) throw new Error("Balasan layanan pembayaran tidak valid.");
  return {
    invoice: body.invoice ?? null,
    ...(body.discountOffer ? { discountOffer: body.discountOffer } : {}),
  };
}

export function useQrisTransport() {
  const active = useRef<AbortController | null>(null);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      active.current?.abort();
      active.current = null;
    };
  }, []);
  return useCallback(async (work: (signal: AbortSignal) => Promise<void>) => {
    if (!mounted.current || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    try {
      await work(controller.signal);
    } finally {
      if (active.current === controller) active.current = null;
    }
  }, []);
}
