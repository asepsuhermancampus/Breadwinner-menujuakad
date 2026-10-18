import { describe, expect, it } from "vitest";
import { createEditorState, editorReducer, getPublishBlockers } from "./editor-reducer";
import type { EditorState } from "../types/editor";

function changeVenue(state: EditorState, venue: string) {
  return editorReducer(state, {
    type: "edit",
    document: { ...state.document, content: { ...state.document.content, venue } },
  });
}

describe("studio document history", () => {
  it("starts with a separate saved draft v4 and active snapshot v3", () => {
    const state = createEditorState();
    expect(state.document).toMatchObject({ projectId: "inv-wedding-main", revision: 4 });
    expect(state.activeDocument?.revision).toBe(3);
    expect(state.document.nodes.find((node) => node.id === "couple-title")).toMatchObject({
      x: 24,
      y: 389,
      width: 327,
      height: 54,
      fontSize: 54,
    });
    expect(state.document.sections).toHaveLength(10);
    expect(state.document.sections.find((section) => section.id === "gifts")?.visible).toBe(false);
  });

  it("keeps immutable undo and redo snapshots shared by visual and form edits", () => {
    const initial = createEditorState();
    const edited = changeVenue(initial, "Hall");
    expect(initial.document.content.venue).toBe("Bumi Samami, Bandung");
    expect(edited.document.content.venue).toBe("Hall");
    const undone = editorReducer(edited, { type: "undo" });
    expect(undone.document).toEqual(initial.document);
    expect(undone.dirty).toBe(false);
    expect(editorReducer(undone, { type: "redo" }).document.content.venue).toBe("Hall");
  });

  it("synchronizes the visual couple title and form title in both directions", () => {
    const state = createEditorState();
    const form = editorReducer(state, {
      type: "edit",
      document: { ...state.document, content: { ...state.document.content, coupleTitle: "A & R" } },
    });
    expect(form.document.nodes.find((node) => node.id === "couple-title")?.text).toBe("A & R");
    const visual = editorReducer(form, {
      type: "edit",
      document: {
        ...form.document,
        nodes: form.document.nodes.map((node) =>
          node.id === "couple-title" ? { ...node, text: "Andi & Risa" } : node,
        ),
      },
    });
    expect(visual.document.content.coupleTitle).toBe("Andi & Risa");
  });

  it("requires unlocking before cover movement and preserves editing ownership", () => {
    const state = createEditorState();
    const changed = editorReducer(state, {
      type: "edit",
      document: {
        ...state.document,
        projectId: "foreign",
        nodes: state.document.nodes.map((node) =>
          node.id === "cover" ? { ...node, x: 80 } : node,
        ),
      },
    });
    expect(changed.document.projectId).toBe(state.document.projectId);
    expect(changed.document.nodes.find((node) => node.id === "cover")?.x).toBe(0);
  });

  it("restores v2 as draft v5 without changing active snapshot or tickets", () => {
    const state = createEditorState();
    const restored = editorReducer(state, { type: "restore" });
    expect(restored.document.revision).toBe(5);
    expect(restored.document.activeVersion).toBe(3);
    expect(restored.activeDocument).toEqual(state.activeDocument);
    expect(restored.ticketsRevoked).toBe(false);
    expect(restored.dirty).toBe(true);
  });
});

describe("studio save and concurrency", () => {
  it.each([
    [{ online: false }, "offline"],
    [{ canEdit: false }, "forbidden"],
    [{ serverVersion: 5 }, "conflict"],
    [{ saveFailure: true }, "error"],
  ] as const)("retains all local changes when saving is blocked by %j", (patch, status) => {
    const edited = changeVenue(createEditorState(), "Hall");
    const environment = editorReducer(edited, { type: "environment", patch });
    const saved = editorReducer(environment, { type: "save" });
    expect(saved.saveStatus).toBe(status);
    expect(saved.dirty).toBe(true);
    expect(saved.document.content.venue).toBe("Hall");
    expect(saved.savedDocument.content.venue).toBe("Bumi Samami, Bandung");
  });

  it("requires an explicit conflict resolution before saving against the new server version", () => {
    const edited = changeVenue(createEditorState(), "Hall");
    const stale = editorReducer(edited, { type: "environment", patch: { serverVersion: 5 } });
    expect(stale.saveStatus).toBe("conflict");
    const local = editorReducer(stale, { type: "resolve", source: "local" });
    expect(local.document.content.venue).toBe("Hall");
    expect(local.document.expectedVersion).toBe(5);
    const server = editorReducer(stale, { type: "resolve", source: "server" });
    expect(server.document.content.venue).toBe("Garden");
    expect(server.dirty).toBe(true);
    const saved = editorReducer(local, { type: "save" });
    expect(saved.dirty).toBe(false);
    expect(saved.document.expectedVersion).toBe(6);
    expect(saved.activeDocument?.revision).toBe(3);
  });

  it("rejects changed or dirty documents from publishing even with acknowledgement", () => {
    const edited = changeVenue(createEditorState(), "Hall");
    expect(getPublishBlockers(edited)).toContain("Simpan perubahan terbaru sebelum menerbitkan.");
    const published = editorReducer(edited, {
      type: "publish",
      expectedVersion: 4,
      operationId: "dirty-attempt",
      acknowledged: true,
    });
    expect(published.activeDocument?.revision).toBe(3);
    expect(published.operations).toEqual({});
  });

  it("hydrates only the current project and revalidates saved status", () => {
    const current = createEditorState();
    const dirty = changeVenue(current, "Hall");
    const restored = editorReducer(current, { type: "hydrate", state: dirty });
    expect(restored.dirty).toBe(true);
    expect(restored.document.content.venue).toBe("Hall");
    const foreign = createEditorState("inv-engagement");
    expect(editorReducer(current, { type: "hydrate", state: foreign })).toEqual(current);
  });
});
