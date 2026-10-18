import { describe, expect, it } from "vitest";
import { createEditorState, editorReducer, getPublishBlockers } from "./editor-reducer";
import type { EditorState, StudioDocument } from "../types/editor";

function savedChange(transform: (document: StudioDocument) => StudioDocument) {
  const state = createEditorState();
  return editorReducer(
    editorReducer(state, { type: "edit", document: transform(state.document) }),
    {
      type: "save",
    },
  );
}

function publish(state: EditorState, operationId = "publish-one", acknowledged = true) {
  return editorReducer(state, {
    type: "publish",
    operationId,
    acknowledged,
    expectedVersion: state.document.expectedVersion,
  });
}

describe("atomic studio publication", () => {
  it("captures saved draft v4 and opens draft v5 without mutating the published snapshot", () => {
    const state = createEditorState();
    const published = publish(state);
    expect(published.activeDocument?.revision).toBe(4);
    expect(published.document.revision).toBe(5);
    expect(published.document.activeVersion).toBe(4);
    expect(published.dirty).toBe(false);
    expect(published.operations["publish-one"]).toBe(4);
    const edited = editorReducer(published, {
      type: "rename",
      title: "Draf berikutnya",
    });
    expect(edited.activeDocument?.title).toBe(state.document.title);
  });

  it("returns the previous outcome for repeated operation IDs", () => {
    const once = publish(createEditorState());
    const twice = publish(once);
    expect(twice.document.revision).toBe(5);
    expect(twice.activeDocument?.revision).toBe(4);
    expect(twice.operations).toEqual({ "publish-one": 4 });
  });

  it("requires explicit acknowledgement and rechecks version on commit", () => {
    const state = createEditorState();
    expect(publish(state, "unchecked", false).activeDocument?.revision).toBe(3);
    const stale = editorReducer(state, {
      type: "publish",
      expectedVersion: 3,
      operationId: "stale",
      acknowledged: true,
    });
    expect(stale.saveStatus).toBe("conflict");
    expect(stale.activeDocument?.revision).toBe(3);
    expect(stale.operations).toEqual({});
  });

  it.each([
    [{ online: false }, "offline"],
    [{ canEdit: false }, "forbidden"],
    [{ entitled: false }, "saved"],
    [{ available: false }, "saved"],
    [{ upload: "pending" }, "saved"],
    [{ upload: "error" }, "saved"],
  ] as const)("revalidates the environment at commit: %j", (patch, status) => {
    const state = editorReducer(createEditorState(), { type: "environment", patch });
    const blocked = publish(state);
    expect(blocked.activeDocument?.revision).toBe(3);
    expect(blocked.saveStatus).toBe(status);
    expect(getPublishBlockers(blocked).length).toBeGreaterThan(0);
  });

  it("blocks missing pin, required content, gift privacy, and hidden gift section", () => {
    const missingPin = savedChange((document) => ({
      ...document,
      content: { ...document.content, pinSet: false },
    }));
    expect(getPublishBlockers(missingPin)).toContain("Tetapkan pin lokasi acara.");
    const missingContent = savedChange((document) => ({
      ...document,
      content: { ...document.content, groom: "" },
    }));
    expect(getPublishBlockers(missingContent).length).toBeGreaterThan(0);
    const gifts = savedChange((document) => ({
      ...document,
      privacy: { ...document.privacy, giftsEnabled: true },
    }));
    expect(getPublishBlockers(gifts)).toContain("Hadiah masih nonaktif pada rilis ini.");
  });

  it("unpublishes content without revoking tickets or discarding the active snapshot", () => {
    const published = publish(createEditorState());
    const unpublished = editorReducer(published, { type: "unpublish" });
    expect(unpublished.document.publication).toBe("unpublished");
    expect(unpublished.activeDocument?.revision).toBe(4);
    expect(unpublished.ticketsRevoked).toBe(false);
    expect(editorReducer(unpublished, { type: "revoke-tickets" }).ticketsRevoked).toBe(true);
  });

  it.each(["archive", "delete"] as const)("%s affects only the draft", (type) => {
    const published = publish(createEditorState());
    const changed = editorReducer(published, { type });
    expect(changed.activeDocument).toEqual(published.activeDocument);
    expect(changed.document.publication).toBe("published");
    expect(changed.ticketsRevoked).toBe(false);
    expect(getPublishBlockers(changed).length).toBeGreaterThan(0);
  });

  it("duplicates into a separate project with no active snapshot or publication operations", () => {
    const published = publish(createEditorState());
    const duplicate = editorReducer(published, { type: "duplicate" });
    expect(duplicate.document.projectId).not.toBe(published.document.projectId);
    expect(duplicate.document.eventId).toBe(published.document.eventId);
    expect(duplicate.document.revision).toBe(1);
    expect(duplicate.activeDocument).toBeNull();
    expect(duplicate.operations).toEqual({});
    expect(duplicate.document.publication).toBe("unpublished");
    expect(duplicate.ticketsRevoked).toBe(false);
  });

  it("creates a new independent draft and never carries an active publication across projects", () => {
    const original = publish(createEditorState());
    const created = editorReducer(original, { type: "new" });
    expect(created.document.title).toBe("Undangan baru");
    expect(created.document.projectId).not.toBe(original.document.projectId);
    expect(created.activeDocument).toBeNull();
    expect(created.document.revision).toBe(1);
  });
});
