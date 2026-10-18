"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { createEditorState, editorReducer } from "../domain/editor-reducer";
import { isStoredEditorState } from "../domain/editor-storage";
import type { StudioDocument, StudioNode } from "../types/editor";

const storageKey = (projectId: string) => `ma-studio-v1:${projectId}`;

export function useStudioEditor(projectId: string) {
  const [state, dispatch] = useReducer(editorReducer, projectId, createEditorState);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const loadedScope = useRef<string | null>(null);
  const protectedRecovery = useRef<string | null>(null);
  const pendingOpen = useRef<string | null>(null);
  const pendingStorage = useRef(false);

  useEffect(() => {
    if (loadedScope.current === projectId) return;
    pendingOpen.current = projectId;
    const timer = setTimeout(() => {
      loadedScope.current = projectId;
      protectedRecovery.current = null;
      dispatch({ type: "open", projectId });
      try {
        const raw = localStorage.getItem(storageKey(projectId));
        if (raw) {
          const recovered: unknown = JSON.parse(raw);
          if (!isStoredEditorState(recovered, projectId)) throw new Error("Invalid recovery data");
          dispatch({ type: "hydrate", state: recovered });
        }
        setStorageError("");
      } catch {
        protectedRecovery.current = projectId;
        setStorageError(
          "Salinan lokal tidak dapat dibuka. Data pemulihan asli dipertahankan; ekspor draf sebelum keluar.",
        );
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [projectId]);

  useEffect(() => {
    if (!ready) return;
    const currentProjectId = state.document.projectId;
    if (pendingOpen.current !== null && pendingOpen.current !== currentProjectId) return;
    pendingStorage.current = true;
    const timer = setTimeout(() => {
      if (pendingOpen.current !== null && pendingOpen.current !== currentProjectId) return;
      pendingOpen.current = null;
      if (loadedScope.current !== currentProjectId) {
        loadedScope.current = currentProjectId;
        protectedRecovery.current = null;
        const url = new URL(window.location.href);
        url.searchParams.set("project", currentProjectId);
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
      pendingStorage.current = false;
      if (protectedRecovery.current === currentProjectId) return;
      try {
        localStorage.setItem(storageKey(currentProjectId), JSON.stringify(state));
        setStorageError("");
      } catch {
        setStorageError(
          "Penyimpanan perangkat penuh atau tidak tersedia. Perubahan belum aman di perangkat; ekspor draf sebelum keluar.",
        );
      }
    }, 0);
    return () => {
      clearTimeout(timer);
      pendingStorage.current = false;
    };
  }, [ready, state]);

  useEffect(() => {
    if (
      !ready ||
      !state.dirty ||
      !state.environment.online ||
      !state.environment.canEdit ||
      state.environment.saveFailure ||
      state.document.draftStatus !== "editing" ||
      state.document.expectedVersion !== state.environment.serverVersion
    )
      return;
    const timer = setTimeout(() => dispatch({ type: "save" }), 900);
    return () => clearTimeout(timer);
  }, [ready, state.dirty, state.document, state.environment]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (state.dirty || storageError || pendingStorage.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    const offline = () => dispatch({ type: "environment", patch: { online: false } });
    const online = () => dispatch({ type: "environment", patch: { online: true } });
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, [state.dirty, storageError]);

  function edit(document: StudioDocument) {
    dispatch({ type: "edit", document });
  }
  function updateNode(id: string, patch: Partial<StudioNode>) {
    const node = state.document.nodes.find((item) => item.id === id);
    if (!node || (node.locked && !Object.hasOwn(patch, "locked"))) return;
    edit({
      ...state.document,
      nodes: state.document.nodes.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  }
  function content(patch: Partial<StudioDocument["content"]>) {
    edit({ ...state.document, content: { ...state.document.content, ...patch } });
  }
  function exportDraft() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(state.document, null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.document.projectId}-draf.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return { state, dispatch, edit, updateNode, content, ready, storageError, exportDraft };
}

export type StudioEditor = ReturnType<typeof useStudioEditor>;
