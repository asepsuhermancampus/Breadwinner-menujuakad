"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { createEditorState, editorReducer } from "../domain/editor-reducer";
import { isStoredEditorState } from "../domain/editor-storage";
import type { EditorAction, StudioDocument, StudioNode } from "../types/editor";
import { createCustomerEditor } from "../domain/customer-editor";
import { useTrialStudio } from "./use-trial-studio";
import { useRemoteStudio } from "./use-remote-studio";

const storageKey = (projectId: string) => `ma-studio-v1:${projectId}`;

export function useStudioEditor(
  projectId: string,
  remote = false,
  workspaceId = "",
  readOnly = false,
) {
  const trial = workspaceId === "guest-trial";
  const [state, reduce] = useReducer(
    editorReducer,
    projectId,
    remote ? createCustomerEditor : createEditorState,
  );
  const dispatch = useCallback(
    (action: EditorAction) => {
      if (readOnly) return;
      if (trial && action.type === "publish") return;
      reduce(action);
      if (remote && action.type === "new" && action.projectId)
        reduce({ type: "hydrate", state: createCustomerEditor(action.projectId) });
    },
    [remote, trial, readOnly],
  );
  const account = useRemoteStudio(remote && !trial && !readOnly, state, dispatch, workspaceId);
  const local = useTrialStudio(trial, state, dispatch);
  const server = trial ? local : account;
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const loadedScope = useRef<string | null>(null);
  const protectedRecovery = useRef<string | null>(null);
  const pendingOpen = useRef<string | null>(null);
  const pendingStorage = useRef(false);

  useEffect(() => {
    if (remote) return;
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
  }, [projectId, remote, dispatch]);

  useEffect(() => {
    if (!ready || remote) return;
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
  }, [ready, state, remote]);

  useEffect(() => {
    if (
      trial ||
      !(remote ? server.ready : ready) ||
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
  }, [
    trial,
    ready,
    remote,
    server.ready,
    state.dirty,
    state.document,
    state.environment,
    dispatch,
  ]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (
        state.dirty ||
        storageError ||
        pendingStorage.current ||
        (remote && (server.error || server.pending))
      ) {
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
  }, [state.dirty, storageError, remote, server.error, server.pending, dispatch]);

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
  return {
    trial,
    saveTrial: local.save,
    state,
    dispatch,
    edit,
    updateNode,
    content,
    ready: readOnly || (remote ? server.ready : ready),
    storageError: remote ? server.error : storageError,
    exportDraft,
    remote,
    workspaceId,
    persisting: remote && server.pending,
  };
}

export type StudioEditor = ReturnType<typeof useStudioEditor>;
