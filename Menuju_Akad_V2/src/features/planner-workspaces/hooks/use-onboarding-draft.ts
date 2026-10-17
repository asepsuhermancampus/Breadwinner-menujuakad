"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WorkspaceFault, type OnboardingDraft, type WorkspaceAdapter } from "../contracts";

export type DraftStatus = "loading" | "saved" | "dirty" | "saving" | "error";

export function useOnboardingDraft(initial: OnboardingDraft, adapter: WorkspaceAdapter) {
  const [draft, setDraft] = useState(initial);
  const [status, setStatus] = useState<DraftStatus>("loading");
  const [message, setMessage] = useState("");
  const [generation, setGeneration] = useState(0);
  const latest = useRef(initial);
  const dirty = useRef(false);
  const revision = useRef(0);
  const inFlight = useRef<Promise<boolean> | null>(null);
  const blocked = useRef(false);

  const update = useCallback((updater: (current: OnboardingDraft) => OnboardingDraft) => {
    latest.current = updater(latest.current);
    dirty.current = true;
    revision.current += 1;
    setDraft(latest.current);
    setGeneration(revision.current);
    setStatus(blocked.current ? "error" : "dirty");
    if (!blocked.current) setMessage("");
  }, []);

  const reload = useCallback(async () => {
    setStatus("loading");
    try {
      const persisted = await adapter.loadDraft(initial.workspaceId);
      latest.current = persisted ?? initial;
      dirty.current = false;
      blocked.current = false;
      setDraft(latest.current);
      setMessage("");
      setStatus("saved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Draf belum dapat dimuat.");
      setStatus("error");
    }
  }, [adapter, initial]);

  useEffect(() => {
    let active = true;
    adapter
      .loadDraft(initial.workspaceId)
      .then((persisted) => {
        if (!active || dirty.current) return;
        latest.current = persisted ?? initial;
        setDraft(latest.current);
        setStatus("saved");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Draf belum dapat dimuat.");
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [adapter, initial]);

  const save = useCallback(
    async function persist(): Promise<boolean> {
      while (inFlight.current) {
        if (!(await inFlight.current)) return false;
      }
      if (blocked.current) return false;
      if (!dirty.current) return true;
      const snapshot = latest.current;
      const snapshotRevision = revision.current;
      setStatus("saving");
      const operation = adapter
        .saveDraft(snapshot, snapshot.version)
        .then((saved) => {
          latest.current =
            revision.current === snapshotRevision
              ? saved
              : { ...latest.current, version: saved.version };
          dirty.current = revision.current !== snapshotRevision;
          setDraft(latest.current);
          setStatus(dirty.current ? "dirty" : "saved");
          setMessage("");
          return true;
        })
        .catch((error: unknown) => {
          blocked.current =
            error instanceof WorkspaceFault &&
            (error.code === "forbidden" || error.code === "stale");
          setMessage(error instanceof Error ? error.message : "Draf belum tersimpan. Coba lagi.");
          setStatus("error");
          return false;
        });
      inFlight.current = operation;
      const success = await operation;
      inFlight.current = null;
      return success && dirty.current ? persist() : success;
    },
    [adapter],
  );

  useEffect(() => {
    if (!generation) return;
    const timeout = window.setTimeout(() => {
      void save();
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [generation, save]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  return { draft, status, message, update, save, reload };
}
