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
type Context = {
  snapshot: TrialSnapshot | null;
  error: string;
  consumeExport: () => Promise<boolean>;
  save: (kind: TrialResourceKind, data: unknown[], revision: number) => Promise<boolean>;
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
  const consumeExport = async () => {
    if (!store.current || !snapshot) return false;
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
    <TrialContext value={{ snapshot, error, save, consumeExport }}>
      <TrialNotice snapshot={snapshot} error={error} limit={limit} close={() => setLimit(false)} />
      {children}
    </TrialContext>
  );
}
