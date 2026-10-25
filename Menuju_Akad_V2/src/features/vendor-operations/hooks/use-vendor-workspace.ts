"use client";
import { useEffect, useRef, useState } from "react";
import {
  createVendorWorkspace,
  createVendorContext,
  saveVendorCatalog,
} from "../domain/vendor-operations";
import type { VendorContext, VendorResult } from "../types/vendor";
import { decodeVendorCatalog, vendorCatalogStorageKey } from "./vendor-catalog-storage";

export function useVendorWorkspace() {
  const [state, setState] = useState(createVendorWorkspace);
  const [context, setContext] = useState(() => createVendorContext(state));
  const [draft, setDraft] = useState(() => structuredClone(state.catalog));
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [storageError, setStorageError] = useState(false);
  const [refreshRevision, setRefreshRevision] = useState(0);
  const current = useRef({ state, context });
  useEffect(() => {
    current.current = { state, context };
  }, [state, context]);
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem(vendorCatalogStorageKey);
        if (raw) {
          const catalog = decodeVendorCatalog(raw);
          setState((value) => ({ ...value, catalog }));
          setDraft(structuredClone(catalog));
        }
      } catch {
        setStorageError(true);
        setMessage(
          "Katalog lokal tidak dapat dibaca. Draf awal tetap tersedia; data lama belum ditimpa.",
        );
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  function onResult(result: VendorResult) {
    setMessage(result.message);
    setErrors(result.errors ?? {});
    if (!result.ok) return;
    setState(result.state);
    setContext((value) => ({ ...value, latestVersion: result.state.version }));
  }
  async function save() {
    if (busy) return false;
    setBusy(true);
    setMessage("Menyimpan perubahan katalog…");
    await new Promise((resolve) => setTimeout(resolve, 250));
    const latest = current.current;
    const result = saveVendorCatalog(latest.state, draft, latest.context, latest.state.version);
    onResult(result);
    if (result.ok) {
      setDraft((latestDraft) =>
        JSON.stringify(latestDraft) === JSON.stringify(draft)
          ? structuredClone(result.state.catalog)
          : latestDraft,
      );
      try {
        localStorage.setItem(vendorCatalogStorageKey, JSON.stringify(result.state.catalog));
        setStorageError(false);
      } catch {
        setStorageError(true);
        setMessage(
          "Katalog berubah pada sesi ini, tetapi penyimpanan perangkat gagal. Jangan tutup sebelum menyalin draf.",
        );
      }
    }
    setBusy(false);
    return result.ok;
  }
  function environment(patch: Partial<VendorContext>) {
    setContext((value) => ({ ...value, ...patch }));
  }
  function refreshVersion() {
    setState((value) => ({ ...value, version: context.latestVersion }));
    setRefreshRevision((value) => value + 1);
    setMessage(
      "Versi simulasi terbaru dimuat. Draf katalog dipertahankan; tinjau sebelum menyimpan lagi.",
    );
  }
  return {
    state,
    context,
    draft,
    setDraft,
    ready,
    busy,
    message,
    errors,
    storageError,
    refreshRevision,
    onResult,
    save,
    environment,
    refreshVersion,
    dirty: JSON.stringify(draft) !== JSON.stringify(state.catalog),
    discard: () => setDraft(structuredClone(state.catalog)),
  };
}
