"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FinanceCommand, FinanceRequest, FinanceSnapshot } from "../types/finance-ledger";

export function useAccountFinance(workspaceId: string) {
  const [snapshot, setSnapshot] = useState<FinanceSnapshot | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const current = useRef<FinanceSnapshot | null>(null);
  const busy = useRef(false);
  const uncertain = useRef<{ key: string; request: FinanceRequest } | null>(null);
  const live = useRef(false);
  const loading = useRef(false);
  const requests = useRef(new Set<AbortController>());
  const url = `/api/workspace/finance?workspace=${encodeURIComponent(workspaceId)}`;
  const accept = useCallback((next: FinanceSnapshot) => {
    if (!live.current || (current.current && next.revision < current.current.revision)) return;
    current.current = next;
    setSnapshot(next);
  }, []);
  const refresh = useCallback(async () => {
    if (loading.current || busy.current) return;
    loading.current = true;
    const controller = new AbortController();
    requests.current.add(controller);
    try {
      const response = await fetch(url, {
        cache: "no-store",
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
      });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error ?? "Data tabungan belum dapat dimuat.");
      accept(value as FinanceSnapshot);
      if (live.current) setError("");
    } catch (cause) {
      if (live.current && !controller.signal.aborted)
        setError(cause instanceof Error ? cause.message : "Data tabungan belum dapat dimuat.");
    } finally {
      requests.current.delete(controller);
      loading.current = false;
    }
  }, [url, accept]);
  useEffect(() => {
    live.current = true;
    current.current = null;
    uncertain.current = null;
    const initial = window.setTimeout(() => void refresh(), 0);
    const update = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const interval = window.setInterval(update, 5000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    const controllers = requests.current;
    return () => {
      live.current = false;
      window.clearTimeout(initial);
      window.clearInterval(interval);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
      controllers.forEach((controller) => controller.abort());
      loading.current = false;
    };
  }, [refresh]);

  async function command(action: FinanceCommand): Promise<boolean> {
    if (busy.current || !snapshot) return false;
    const key = JSON.stringify(action);
    if (uncertain.current && uncertain.current.key !== key) {
      setError(
        "Transaksi sebelumnya belum terkonfirmasi. Ulangi dengan data yang sama atau muat ulang untuk memeriksa riwayat dahulu.",
      );
      return false;
    }
    const request = uncertain.current?.request ?? {
      revision: snapshot.revision,
      requestId: crypto.randomUUID(),
      command: action,
    };
    uncertain.current = { key, request };
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(15000),
      });
      const value = await response.json();
      if (!response.ok) {
        if (response.status < 500) uncertain.current = null;
        throw new Error(
          value.error ?? "Transaksi belum tersimpan. Coba kembali dengan data yang sama.",
        );
      }
      accept(value as FinanceSnapshot);
      uncertain.current = null;
      return true;
    } catch (cause) {
      if (live.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "Transaksi belum terkonfirmasi. Periksa riwayat sebelum mengulangi.",
        );
      return false;
    } finally {
      busy.current = false;
      if (live.current) setPending(false);
    }
  }
  return { snapshot, pending, error, command, refresh };
}
