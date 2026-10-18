import type { EditorAction, EditorState } from "../types/editor";
import { failureNotice, getPublishBlockers, saveProblem } from "./editor-guards";

export function saveEditor(state: EditorState): EditorState {
  const problem = saveProblem(state);
  if (problem) return { ...state, saveStatus: problem, notice: failureNotice(problem) };
  if (state.document.draftStatus !== "editing")
    return { ...state, notice: "Draf yang diarsipkan atau dihapus tidak dapat disimpan." };
  if (!state.dirty) return { ...state, saveStatus: "saved" };
  const version = state.environment.serverVersion + 1;
  const document = { ...structuredClone(state.document), expectedVersion: version };
  return {
    ...state,
    document,
    savedDocument: structuredClone(document),
    dirty: false,
    environment: { ...state.environment, serverVersion: version },
    saveStatus: "saved",
    notice: "Draf tersimpan di simulasi lokal. Versi aktif tetap terpisah.",
  };
}

export function publishEditor(
  state: EditorState,
  action: Extract<EditorAction, { type: "publish" }>,
): EditorState {
  if (!action.operationId.trim())
    return { ...state, notice: "Kunci operasi publikasi diperlukan." };
  if (Object.hasOwn(state.operations, action.operationId))
    return {
      ...state,
      notice: `Operasi ini sudah selesai untuk v${state.operations[action.operationId]}.`,
    };
  if (action.expectedVersion !== state.document.expectedVersion)
    return {
      ...state,
      saveStatus: "conflict",
      notice: "Versi pada review sudah berubah. Buka ulang review.",
    };
  const blockers = getPublishBlockers(state);
  if (!action.acknowledged) blockers.push("Centang persetujuan setelah memeriksa snapshot.");
  if (blockers.length) {
    const problem = saveProblem(state);
    return { ...state, saveStatus: problem ?? state.saveStatus, notice: blockers.join(" ") };
  }
  const revision = state.document.revision;
  const version = state.environment.serverVersion + 1;
  const activeDocument = {
    ...structuredClone(state.savedDocument),
    activeVersion: revision,
    publication: "published" as const,
    expectedVersion: version,
  };
  const document = { ...structuredClone(activeDocument), revision: revision + 1 };
  return {
    ...state,
    document,
    activeDocument,
    savedDocument: structuredClone(document),
    past: [],
    future: [],
    dirty: false,
    saveStatus: "saved",
    environment: { ...state.environment, serverVersion: version },
    operations: { ...state.operations, [action.operationId]: revision },
    notice: `Simulasi v${revision} diterbitkan. Draf v${revision + 1} siap diedit.`,
  };
}

export function lifecycleEditor(
  state: EditorState,
  type: "unpublish" | "archive" | "delete" | "revoke-tickets",
): EditorState {
  const problem = saveProblem(state);
  if (problem) return { ...state, saveStatus: problem, notice: failureNotice(problem) };
  if (type === "revoke-tickets")
    return {
      ...state,
      ticketsRevoked: true,
      notice: "Tiket acara dicabut dalam simulasi terpisah.",
    };
  const unpublish = type === "unpublish";
  const patch = unpublish
    ? { publication: "unpublished" as const }
    : { draftStatus: type === "archive" ? ("archived" as const) : ("deleted" as const) };
  return {
    ...state,
    document: { ...state.document, ...patch },
    savedDocument: { ...state.savedDocument, ...patch },
    notice: unpublish
      ? "Konten dan RSVP ditarik dari simulasi publik. Tiket tidak dicabut."
      : `Draf ${type === "archive" ? "diarsipkan" : "dihapus"}. Snapshot aktif dan tiket dipertahankan.`,
  };
}
