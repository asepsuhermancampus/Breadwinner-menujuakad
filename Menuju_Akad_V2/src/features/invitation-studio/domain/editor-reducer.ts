import { createHistoryDocument, createStudioDocument } from "../content/editor-content";
import type { EditorAction, EditorState, StudioDocument } from "../types/editor";
import { editDocument, recordDocument, travelHistory } from "./editor-document";
import { failureNotice, sameDocument, statusFor } from "./editor-guards";
import { lifecycleEditor, publishEditor, saveEditor } from "./editor-publishing";
import { isStoredEditorState } from "./editor-storage";

export { getPublishBlockers } from "./editor-guards";

export function createEditorState(projectId = "inv-wedding-main"): EditorState {
  const document = createStudioDocument(projectId);
  return {
    document,
    past: [],
    future: [],
    savedDocument: structuredClone(document),
    activeDocument:
      document.activeVersion === null
        ? null
        : {
            ...structuredClone(document),
            revision: document.activeVersion,
          },
    environment: {
      online: true,
      canEdit: true,
      entitled: true,
      available: true,
      serverVersion: document.expectedVersion,
      upload: "idle",
      saveFailure: false,
    },
    dirty: false,
    saveStatus: "saved",
    notice: "",
    operations: {},
    ticketsRevoked: false,
  };
}

function hydrateEditor(current: EditorState, payload: EditorState): EditorState {
  if (!isStoredEditorState(payload, current.document.projectId)) return current;
  const next = structuredClone(payload);
  next.past = next.past.slice(-50);
  next.future = next.future.slice(-50);
  next.dirty = !sameDocument(next.document, next.savedDocument);
  next.saveStatus = statusFor(next);
  return next;
}

function resolveConflict(state: EditorState, source: "local" | "server"): EditorState {
  if (!state.environment.canEdit || !state.environment.online)
    return { ...state, notice: "Pulihkan akses dan koneksi sebelum menyelesaikan konflik." };
  if (state.document.expectedVersion === state.environment.serverVersion) return state;
  const base = state.document;
  const document = {
    ...base,
    revision: state.document.revision,
    expectedVersion: state.environment.serverVersion,
    content: { ...base.content, venue: source === "server" ? "Garden" : base.content.venue },
    nodes: base.nodes.map((node) =>
      source === "server" && node.id === "venue"
        ? { ...node, text: "Garden" }
        : structuredClone(node),
    ),
  };
  const next = recordDocument(state, document);
  return {
    ...next,
    notice: `Versi ${source === "local" ? "lokal" : "server"} dipilih. Simpan kembali draf.`,
  };
}

function restoreEditor(state: EditorState): EditorState {
  if (state.document.projectId !== "inv-wedding-main")
    return {
      ...state,
      notice: "Riwayat v2 tidak tersedia untuk proyek ini. Duplikat draf untuk melanjutkan.",
    };
  if (!state.environment.canEdit)
    return {
      ...state,
      saveStatus: "forbidden",
      notice: "Izin edit diperlukan untuk memulihkan versi.",
    };
  const restored = createHistoryDocument(state.document);
  const revision =
    Math.max(
      state.document.revision,
      state.savedDocument.revision,
      state.document.activeVersion ?? 0,
    ) + 1;
  const document: StudioDocument = {
    ...restored,
    revision,
    expectedVersion: state.document.expectedVersion,
    draftStatus: "editing",
  };
  const next = recordDocument(state, document);
  return {
    ...next,
    notice: `Versi 2 dipulihkan sebagai draf v${revision}. Versi aktif tidak berubah.`,
  };
}

function createScopedProject(
  state: EditorState,
  kind: "duplicate" | "new",
  requestedId?: string,
): EditorState {
  if (!state.environment.canEdit)
    return { ...state, notice: "Izin edit diperlukan untuk membuat proyek." };
  const projectId =
    requestedId?.trim() || `${state.document.projectId}-${kind}-${state.document.revision}`;
  if (projectId === state.document.projectId)
    return { ...state, notice: "Proyek baru harus memiliki ID yang berbeda." };
  const next = createEditorState(projectId);
  const source =
    kind === "duplicate"
      ? structuredClone(state.document)
      : {
          ...next.document,
          content: {
            ...next.document.content,
            date: state.document.content.date,
            rsvpDeadline: state.document.content.rsvpDeadline,
          },
          nodes: next.document.nodes.map((node) =>
            node.id === "event-date"
              ? {
                  ...node,
                  text:
                    state.document.nodes.find((item) => item.id === "event-date")?.text ??
                    node.text,
                }
              : node,
          ),
        };
  const document: StudioDocument = {
    ...source,
    projectId,
    eventId: state.document.eventId,
    title: kind === "duplicate" ? `${state.document.title} · Salinan` : "Undangan baru",
    revision: 1,
    expectedVersion: 1,
    activeVersion: null,
    publication: "unpublished",
    draftStatus: "editing",
  };
  return {
    ...next,
    document,
    savedDocument: structuredClone(document),
    environment: { ...state.environment, serverVersion: 1, upload: "idle", saveFailure: false },
    notice:
      kind === "duplicate"
        ? "Salinan dibuat sebagai proyek terpisah tanpa publikasi atau penyalinan tamu."
        : "Proyek undangan baru dibuat sebagai draf terpisah.",
  };
}

export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "open":
      return createEditorState(action.projectId);
    case "hydrate":
      return hydrateEditor(state, action.state);
    case "edit":
      return editDocument(state, action.document);
    case "rename":
      return editDocument(state, { ...state.document, title: action.title });
    case "undo":
    case "redo":
      return travelHistory(state, action.type);
    case "save":
      return saveEditor(state);
    case "publish":
      return publishEditor(state, action);
    case "environment": {
      const next = { ...state, environment: { ...state.environment, ...action.patch } };
      const saveStatus = statusFor(next);
      return { ...next, saveStatus, notice: failureNotice(saveStatus) };
    }
    case "resolve":
      return resolveConflict(state, action.source);
    case "restore":
      return restoreEditor(state);
    case "duplicate":
    case "new":
      return createScopedProject(state, action.type, action.projectId);
    case "unpublish":
    case "archive":
    case "delete":
    case "revoke-tickets":
      return lifecycleEditor(state, action.type);
  }
}
