"use client";
import { useEffect, useRef, useState, type Dispatch } from "react";
import { useTrial } from "@/features/dashboard-trial/components/trial-provider";
import { createCustomerEditor } from "../domain/customer-editor";
import { saveEditor } from "../domain/editor-publishing";
import type { EditorAction, EditorState, StudioDocument } from "../types/editor";
type Draft = { id: string; title: string; document: StudioDocument; activeDocument?: null };
export function useTrialStudio(
  enabled: boolean,
  state: EditorState,
  dispatch: Dispatch<EditorAction>,
) {
  const context = useTrial(),
    hydrated = useRef(false),
    baseline = useRef<Record<string, string>>({});
  const [ready, setReady] = useState(false),
    [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const drafts = context?.snapshot?.resources["studio-drafts"] as Draft[] | undefined;
  useEffect(() => {
    if (!enabled || !context?.snapshot || hydrated.current) return;
    hydrated.current = true;
    const existing = drafts?.find((d) => d.id === state.document.projectId),
      clean = createCustomerEditor(state.document.projectId);
    if (existing) {
      clean.document = structuredClone(existing.document);
      clean.savedDocument = structuredClone(existing.document);
      clean.environment.serverVersion = existing.document.expectedVersion;
    }
    baseline.current[state.document.projectId] = JSON.stringify(existing ?? null);
    dispatch({ type: "hydrate", state: clean });
    setReady(true);
  }, [enabled, context?.snapshot, drafts, state.document.projectId, dispatch]);
  async function save() {
    if (!context?.snapshot || pending) return false;
    const current = (context.snapshot.resources["studio-drafts"] ?? []) as Draft[];
    if (
      JSON.stringify(current.find((d) => d.id === state.document.projectId) ?? null) !==
      (baseline.current[state.document.projectId] ?? "null")
    ) {
      setError(
        "Draf berubah di tab lain. Muat ulang sebelum menyimpan; salin isi draf kalian terlebih dahulu.",
      );
      return false;
    }
    setPending(true);
    try {
      const next = {
        id: state.document.projectId,
        title: state.document.title,
        document: saveEditor(state).document,
        activeDocument: null,
      };
      const ok = await context.save(
        "studio-drafts",
        [...current.filter((d) => d.id !== next.id), next],
        context.snapshot.revision,
      );
      if (ok) {
        baseline.current[next.id] = JSON.stringify(next);
        dispatch({ type: "save" });
        const address = new URL(window.location.href);
        address.searchParams.set("project", next.id);
        window.history.replaceState(
          null,
          "",
          `${address.pathname}${address.search}${address.hash}`,
        );
        setError("");
      }
      return ok;
    } finally {
      setPending(false);
    }
  }
  return { ready, pending, error: error || context?.error || "", save };
}
