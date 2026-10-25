"use client";
import { useEffect, useRef, useState, type Dispatch } from "react";
import type { EditorAction, EditorState, StudioDocument } from "../types/editor";
import { createCustomerEditor } from "../domain/customer-editor";
import { isStudioDocument } from "../domain/editor-storage";
type Draft = {
  id: string;
  title: string;
  document: StudioDocument;
  activeDocument?: StudioDocument | null;
};
export function useRemoteStudio(
  enabled: boolean,
  state: EditorState,
  dispatch: Dispatch<EditorAction>,
  workspaceId: string,
) {
  const url = `/api/workspace/resources/studio-drafts?workspace=${encodeURIComponent(workspaceId)}`;
  const [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  const [acknowledged, setAcknowledged] = useState("");
  const revision = useRef(0),
    drafts = useRef<Draft[]>([]),
    saved = useRef("");
  const snapshot = { document: state.document, activeDocument: state.activeDocument };
  const latest = useRef(snapshot),
    busy = useRef(false);
  useEffect(() => {
    latest.current = { document: state.document, activeDocument: state.activeDocument };
  }, [state.document, state.activeDocument]);
  const projectId = useRef(state.document.projectId);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    void fetch(url, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Draf akun belum dapat dibuka");
        const body = (await response.json()) as { revision: number; data: Draft[] };
        if (controller.signal.aborted) return;
        revision.current = body.revision;
        drafts.current = body.data;
        const clean = createCustomerEditor(projectId.current),
          existing = body.data.find((d) => d.id === projectId.current);
        if (existing && isStudioDocument(existing.document)) {
          clean.document = existing.document;
          clean.savedDocument = structuredClone(existing.document);
          clean.activeDocument =
            existing.activeDocument && isStudioDocument(existing.activeDocument)
              ? existing.activeDocument
              : null;
          clean.environment.serverVersion = existing.document.expectedVersion;
        }
        saved.current = JSON.stringify({
          document: clean.document,
          activeDocument: clean.activeDocument,
        });
        setAcknowledged(saved.current);
        dispatch({ type: "hydrate", state: clean });
        setReady(true);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted)
          setError(cause instanceof Error ? cause.message : "Draf gagal dimuat");
      });
    return () => controller.abort();
  }, [enabled, dispatch, url]);
  useEffect(() => {
    if (!enabled || !ready || busy.current || JSON.stringify(latest.current) === saved.current)
      return;
    busy.current = true;
    setPending(true);
    void (async () => {
      try {
        while (JSON.stringify(latest.current) !== saved.current) {
          const current = latest.current,
            doc = current.document,
            serialized = JSON.stringify(current);
          const next = [
            ...drafts.current.filter((d) => d.id !== doc.projectId),
            {
              id: doc.projectId,
              title: doc.title,
              document: doc,
              activeDocument: current.activeDocument,
            },
          ];
          const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ revision: revision.current, data: next }),
            signal: AbortSignal.timeout(15000),
          });
          const body = (await response.json()) as { revision?: number; error?: string };
          if (!response.ok || body.revision === undefined)
            throw new Error(body.error ?? "Draf belum tersimpan pada akun");
          revision.current = body.revision;
          drafts.current = next;
          saved.current = serialized;
          setAcknowledged(serialized);
          const address = new URL(window.location.href);
          address.searchParams.set("project", doc.projectId);
          window.history.replaceState(null, "", `${address.pathname}${address.search}`);
        }
        setError("");
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Draf belum tersimpan");
      } finally {
        busy.current = false;
        setPending(false);
      }
    })();
  }, [enabled, ready, state.document, state.activeDocument, url]);
  return {
    ready,
    error,
    pending: pending || (ready && JSON.stringify(snapshot) !== acknowledged),
  };
}
