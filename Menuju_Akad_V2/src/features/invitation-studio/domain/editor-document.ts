import type { EditorState, StudioDocument } from "../types/editor";
import { sameDocument, statusFor } from "./editor-guards";

export function preserveScope(current: StudioDocument, next: StudioDocument): StudioDocument {
  return {
    ...structuredClone(next),
    projectId: current.projectId,
    eventId: current.eventId,
    revision: current.revision,
    expectedVersion: current.expectedVersion,
    activeVersion: current.activeVersion,
    publication: current.publication,
    draftStatus: current.draftStatus,
  };
}

function synchronizeContent(current: StudioDocument, next: StudioDocument) {
  const fields = [
    ["couple-title", "coupleTitle"],
    ["venue", "venue"],
  ] as const;
  for (const [id, field] of fields) {
    const node = next.nodes.find((item) => item.id === id);
    const previous = current.nodes.find((item) => item.id === id);
    if (next.content[field] !== current.content[field]) {
      if (node) node.text = next.content[field];
    } else if (node && node.text !== previous?.text) next.content[field] = node.text;
  }
  if (next.content.date !== current.content.date) {
    const node = next.nodes.find((item) => item.id === "event-date");
    const date = new Date(`${next.content.date}T00:00:00Z`);
    if (node)
      node.text = Number.isNaN(date.getTime())
        ? next.content.date
        : new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          }).format(date);
  }
}

export function editDocument(state: EditorState, input: StudioDocument): EditorState {
  if (state.document.draftStatus !== "editing")
    return { ...state, notice: "Draf ini sudah diarsipkan atau dihapus. Pulihkan untuk mengedit." };
  if (!state.environment.canEdit)
    return {
      ...state,
      saveStatus: "forbidden",
      notice: "Akses edit dicabut; draf lokal dipertahankan.",
    };
  const next = preserveScope(state.document, input);
  next.nodes = next.nodes.map((node) => {
    const before = state.document.nodes.find((item) => item.id === node.id);
    return before?.locked && node.locked
      ? { ...structuredClone(before), name: node.name, visible: node.visible }
      : node;
  });
  for (const node of state.document.nodes.filter((item) => item.locked)) {
    if (!next.nodes.some((item) => item.id === node.id)) next.nodes.unshift(structuredClone(node));
  }
  synchronizeContent(state.document, next);
  return recordDocument(state, next);
}

export function recordDocument(state: EditorState, document: StudioDocument): EditorState {
  if (sameDocument(state.document, document)) return state;
  const next = {
    ...state,
    document: structuredClone(document),
    past: [...state.past.slice(-49), structuredClone(state.document)],
    future: [],
    dirty: !sameDocument(document, state.savedDocument),
    notice: "",
  };
  return { ...next, saveStatus: statusFor(next) };
}

export function travelHistory(state: EditorState, direction: "undo" | "redo"): EditorState {
  if (state.document.draftStatus !== "editing" || !state.environment.canEdit) return state;
  const source = direction === "undo" ? state.past : state.future;
  const entry = source.at(-1);
  if (!entry) return state;
  const document = preserveScope(state.document, entry);
  const next: EditorState = {
    ...state,
    document,
    past: direction === "undo" ? state.past.slice(0, -1) : [...state.past, state.document],
    future: direction === "undo" ? [...state.future, state.document] : state.future.slice(0, -1),
    dirty: !sameDocument(document, state.savedDocument),
    notice: "",
  };
  return { ...next, saveStatus: statusFor(next) };
}
