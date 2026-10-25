"use client";
import { useCallback, useEffect, useRef, useState } from "react";
export function useCustomerResource(kind: string, workspaceId: string) {
  const url = "/api/workspace/resources/" + kind + "?workspace=" + encodeURIComponent(workspaceId);
  const [data, setData] = useState<unknown[] | null>(null),
    [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [version, setVersion] = useState(0);
  const revision = useRef(0),
    saved = useRef("[]"),
    busy = useRef(false);
  useEffect(() => {
    const abort = new AbortController();
    void fetch(url, { cache: "no-store", signal: abort.signal })
      .then(async (res) => {
        const value = await res.json();
        if (!res.ok) throw new Error(value.error ?? "Data gagal dimuat");
        if (!abort.signal.aborted) {
          revision.current = value.revision;
          setVersion(value.revision);
          saved.current = JSON.stringify(value.data);
          setData(value.data);
        }
      })
      .catch((cause) => {
        if (!abort.signal.aborted)
          setError(cause instanceof Error ? cause.message : "Data gagal dimuat");
      });
    return () => abort.abort();
  }, [url]);
  const save = useCallback(
    async (value: unknown[]): Promise<boolean> => {
      if (busy.current) return false;
      const serialized = JSON.stringify(value);
      if (serialized === saved.current) return true;
      busy.current = true;
      setSaving(true);
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: revision.current, data: value }),
          signal: AbortSignal.timeout(15000),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Perubahan belum tersimpan");
        revision.current = result.revision;
        setVersion(result.revision);
        saved.current = serialized;
        setData(value);
        setError("");
        return true;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Perubahan belum tersimpan");
        return false;
      } finally {
        busy.current = false;
        setSaving(false);
      }
    },
    [url],
  );
  return { data, error, saving, save, revision: version };
}
