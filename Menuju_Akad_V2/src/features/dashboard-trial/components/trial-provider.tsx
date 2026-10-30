"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TrialResourceKind, TrialSnapshot } from "../types";
import { createTrialStore, TRIAL_KEY, TRIAL_LOCK } from "../storage/trial-store";
import { TrialNotice } from "./trial-notice";
import type { FinanceRequest } from "@/features/planner-finance/types/finance-ledger";
import {
  taskAvailability,
  planningAvailability,
  vendorAvailability,
} from "../domain/task-availability";
import { isMaintainedPlanningFeature } from "@/features/customer-planning/domain/maintenance-catalog";
type Context = {
  snapshot: TrialSnapshot | null;
  error: string;
  consumeExport: () => Promise<boolean>;
  save: (kind: TrialResourceKind, data: unknown[], revision: number) => Promise<boolean>;
  finance: (request: FinanceRequest) => Promise<boolean>;
};
const TrialContext = createContext<Context | null>(null);
export const useTrial = () => useContext(TrialContext);
export function TrialProvider({ children }: { children: ReactNode }) {
  const store = useRef<ReturnType<typeof createTrialStore> | null>(null);
  const [snapshot, setSnapshot] = useState<TrialSnapshot | null>(null);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(false);
  useEffect(() => {
    try {
      store.current = createTrialStore({
        storage: localStorage,
        restrictedExpenseSources: async () => {
          const sources = ["seserahan", "catering"] as const;
          const statuses = await Promise.all(sources.map((source) => planningAvailability(source)));
          if (statuses.includes("unavailable"))
            throw new Error(
              "Status fitur terkait belum dapat diperiksa. Perubahan belum disimpan.",
            );
          return sources.filter((_, index) => statuses[index] === "disabled");
        },
        checkExpenseSources: async (sources) => {
          for (const source of sources) {
            const status = await planningAvailability(source);
            if (status !== "active")
              return status === "maintenance"
                ? "Fitur terkait sedang dalam pemeliharaan. Perubahan belum disimpan."
                : status === "disabled"
                  ? "Fitur terkait belum tersedia. Perubahan belum disimpan."
                  : "Status fitur terkait belum dapat diperiksa. Perubahan belum disimpan.";
          }
          return null;
        },
        lock: navigator.locks
          ? async (run) => await navigator.locks.request(TRIAL_LOCK, async () => await run())
          : undefined,
      });
      const refresh = () => {
        try {
          setSnapshot(store.current!.read());
        } catch {
          setSnapshot(null);
          setError(
            "Data trial browser tidak dapat dibaca. Silakan masuk; data lama tidak dihapus.",
          );
        }
      };
      refresh();
      const unsubscribe = store.current.subscribe(refresh);
      const onStorage = (event: StorageEvent) => {
        if (event.key === TRIAL_KEY || event.key === TRIAL_LOCK || event.key === null) refresh();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        unsubscribe();
        window.removeEventListener("storage", onStorage);
      };
    } catch {
      queueMicrotask(() =>
        setError("Penyimpanan browser tidak tersedia. Silakan masuk untuk melanjutkan."),
      );
    }
  }, []);
  const save = useCallback(async (kind: TrialResourceKind, data: unknown[], revision: number) => {
    if (!store.current) return false;
    if (kind === "vendor-favorites" && (await vendorAvailability()) !== "active") {
      setError(
        "Status vendor belum tersedia atau belum dapat diperiksa. Perubahan belum disimpan.",
      );
      return false;
    }
    const maintained =
      kind === "catering-settings" ? "catering" : kind === "savings" ? "finance" : kind;
    if (kind === "tasks" || isMaintainedPlanningFeature(maintained)) {
      const status =
        kind === "tasks"
          ? await taskAvailability()
          : isMaintainedPlanningFeature(maintained)
            ? await planningAvailability(maintained)
            : "unavailable";
      if (status !== "active") {
        setError(
          status === "maintenance"
            ? `${kind === "tasks" ? "Tugas" : "Fitur ini"} sedang dalam pemeliharaan. Perubahan belum disimpan.`
            : status === "disabled"
              ? "Fitur ini belum tersedia untuk pengguna percobaan. Perubahan belum disimpan."
              : "Status fitur belum dapat diperiksa. Periksa koneksi dan coba lagi; perubahan belum disimpan.",
        );
        return false;
      }
    }
    if (kind === "catering" || kind === "seserahan") {
      const financeStatus = await planningAvailability("finance");
      if (financeStatus !== "active") {
        setError(
          financeStatus === "maintenance"
            ? "Keuangan terkait sedang dalam pemeliharaan. Perubahan belum disimpan."
            : financeStatus === "disabled"
              ? "Keuangan terkait belum tersedia. Perubahan belum disimpan."
              : "Status keuangan belum dapat diperiksa. Perubahan belum disimpan.",
        );
        return false;
      }
    }
    const result = await store.current.commit(kind, data, revision);
    if (result.ok) {
      setError("");
      setSnapshot(result.snapshot);
      return true;
    }
    setError(result.message);
    if (result.reason === "limit") setLimit(true);
    if (result.reason === "conflict") setSnapshot(store.current.read());
    return false;
  }, []);
  const finance = async (request: FinanceRequest) => {
    if (!store.current) return false;
    const status = await planningAvailability("finance");
    if (status !== "active") {
      setError(
        status === "maintenance"
          ? "Keuangan sedang dalam pemeliharaan. Perubahan belum disimpan."
          : status === "disabled"
            ? "Keuangan belum tersedia. Perubahan belum disimpan."
            : "Status keuangan belum dapat diperiksa. Perubahan belum disimpan.",
      );
      return false;
    }
    const result = await store.current.finance(request);
    if (result.ok) {
      setSnapshot(result.snapshot);
      setError("");
      return true;
    }
    setError(result.message);
    if (result.reason === "limit") setLimit(true);
    if (result.reason === "conflict") setSnapshot(store.current.read());
    return false;
  };
  const consumeExport = async () => {
    if (!store.current || !snapshot) return false;
    const status = await planningAvailability("pdf");
    if (status !== "active") {
      setError(
        status === "maintenance"
          ? "Ringkasan cetak sedang dalam pemeliharaan."
          : status === "disabled"
            ? "Ringkasan cetak belum tersedia untuk pengguna percobaan."
            : "Status ringkasan belum dapat diperiksa. Periksa koneksi dan coba lagi.",
      );
      return false;
    }
    const result = await store.current.consumeExport(snapshot.revision);
    if (result.ok) {
      setSnapshot(result.snapshot);
      setError("");
      return true;
    }
    setError(result.message);
    if (result.reason === "limit") setLimit(true);
    return false;
  };
  return (
    <TrialContext value={{ snapshot, error, save, finance, consumeExport }}>
      <TrialNotice snapshot={snapshot} error={error} limit={limit} close={() => setLimit(false)} />
      {children}
    </TrialContext>
  );
}
