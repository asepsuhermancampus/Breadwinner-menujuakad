"use client";
import { DiscountLoginDialog } from "./discount-login-dialog";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPlan, type PaidPlanId } from "@/features/plans/domain/catalog";
import type { PlanQuote } from "../checkout-types";
import type { PurchaseOffer } from "../purchase-offer";
import { PlanPurchaseContext } from "../hooks/plan-purchase-context";
export function PlanPurchaseProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false),
    [login, setLogin] = useState(false);
  const [quote, setQuote] = useState<PlanQuote | null>(null),
    [offer, setOffer] = useState<PurchaseOffer | null>(null);
  const [pending, setPending] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [change, setChange] = useState<{
    plan: PaidPlanId;
    claim: boolean;
    previous: PlanQuote;
  } | null>(null);
  const busy = useRef(false),
    revision = useRef(0),
    lifetime = useRef<AbortController | null>(null),
    channel = useRef<BroadcastChannel | null>(null);
  const load = useCallback(async () => {
    const version = revision.current;
    const signal = lifetime.current?.signal;
    if (!signal || signal.aborted) return;
    try {
      const response = await fetch("/api/payments/plans", {
        cache: "no-store",
        signal: AbortSignal.any([signal, AbortSignal.timeout(20000)]),
      });
      const data = (await response.json()) as {
        authenticated?: boolean;
        quote?: PlanQuote | null;
        activeQuote?: PlanQuote | null;
        offer?: PurchaseOffer | null;
        error?: string;
      };
      if (!response.ok) throw new Error(data.error ?? "Paket belum dapat dimuat.");
      if (!signal.aborted && version === revision.current) {
        setQuote(data.activeQuote ?? data.quote ?? null);
        setOffer(data.offer ?? null);
        setAuthenticated(data.authenticated === true);
        setError("");
      }
    } catch (cause) {
      if (!signal.aborted)
        setError(cause instanceof Error ? cause.message : "Paket belum dapat dimuat.");
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    lifetime.current = controller;
    channel.current = new BroadcastChannel("menuju-akad-checkout");
    channel.current.onmessage = () => void load();
    const refresh = () => {
      if (document.visibilityState === "visible") void load();
    };
    window.addEventListener("focus", refresh);
    void load();
    return () => {
      controller.abort();
      channel.current?.close();
      window.removeEventListener("focus", refresh);
    };
  }, [load]);
  async function request(plan: PaidPlanId, claim: boolean, replaceIntentId?: string) {
    if (busy.current) return null;
    busy.current = true;
    revision.current++;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/payments/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan,
          claimDiscount: claim,
          ...(replaceIntentId ? { replaceIntentId } : {}),
        }),
        signal: AbortSignal.any([lifetime.current!.signal, AbortSignal.timeout(20000)]),
      });
      const data = (await response.json()) as { quote?: PlanQuote; error?: string };
      if (!response.ok || !data.quote)
        throw new Error(
          data.error ??
            "Reservasi belum terkonfirmasi. Coba lagi untuk memulihkan pesanan yang sama.",
        );
      setQuote(data.quote);
      setChange(null);
      channel.current?.postMessage("changed");
      return data.quote;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Reservasi gagal";
      await load();
      if (!lifetime.current?.signal.aborted) setError(message);
      return null;
    } finally {
      busy.current = false;
      if (!lifetime.current?.signal.aborted) setPending(false);
    }
  }
  async function reserve(plan: PaidPlanId, claim: boolean) {
    if (loading || pending) return null;
    if (claim && !authenticated) {
      setLogin(true);
      return null;
    }
    if (
      quote &&
      quote.planId !== plan &&
      !quote.cancelledAt &&
      !["paid", "expired"].includes(quote.status)
    ) {
      setChange({ plan, claim, previous: quote });
      return null;
    }
    return request(plan, claim);
  }
  return (
    <PlanPurchaseContext.Provider value={{ quote, offer, pending, loading, error, reserve }}>
      {children}
      <DiscountLoginDialog open={login} close={() => setLogin(false)} />
      {error && (
        <div role="alert" className="mx-auto max-w-7xl px-6 py-3 text-sm text-danger">
          {error}{" "}
          <button className="underline" onClick={() => void load()}>
            Muat ulang paket
          </button>
        </div>
      )}
      <Dialog
        open={Boolean(change)}
        title="Perubahan klaim diskon paket"
        onClose={() => {
          if (!pending) setChange(null);
        }}
      >
        <p className="text-sm text-secondary">
          Pindahkan klaim dari {change && getPlan(change.previous.planId).label} ke{" "}
          {change && getPlan(change.plan).label}? Pesanan lama akan dibatalkan di aplikasi. Jangan
          membayar QR pesanan lama.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            disabled={pending}
            onClick={() =>
              change && void request(change.plan, change.claim, change.previous.intentId)
            }
          >
            {pending ? "Memproses…" : "Konfirmasi perubahan"}
          </Button>
          <Button variant="secondary" disabled={pending} onClick={() => setChange(null)}>
            Tetap di paket sebelumnya
          </Button>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
      </Dialog>
    </PlanPurchaseContext.Provider>
  );
}
