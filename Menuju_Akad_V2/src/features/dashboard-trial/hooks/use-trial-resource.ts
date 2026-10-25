"use client";
import { useCallback } from "react";
import { useTrial } from "../components/trial-provider";
import type { TrialResourceKind } from "../types";
const empty: unknown[] = [];
export function useTrialResource(kind: TrialResourceKind) {
  const context = useTrial();
  if (!context) throw new Error("Trial provider missing");
  const { snapshot, error, save } = context;
  const commit = useCallback(
    (data: unknown[]) => save(kind, data, snapshot?.revision ?? -1),
    [save, kind, snapshot?.revision],
  );
  return {
    data: snapshot ? (snapshot.resources[kind] ?? empty) : null,
    error,
    saving: false,
    save: commit,
    revision: snapshot?.revision ?? 0,
  };
}
