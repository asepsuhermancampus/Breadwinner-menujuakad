import { describe, expect, it } from "vitest";
import { createHistoryDocument } from "../content/editor-content";
import { createEditorState, editorReducer, getPublishBlockers } from "./editor-reducer";
import { isSafeStudioImage, isStoredEditorState } from "./editor-storage";

describe("studio recovery boundaries", () => {
  it("validates stored snapshots including nested fields and project ownership", () => {
    const state = createEditorState();
    expect(isStoredEditorState(state, state.document.projectId)).toBe(true);
    expect(isStoredEditorState(state, "inv-engagement")).toBe(false);
    expect(
      isStoredEditorState(
        { ...state, savedDocument: { ...state.savedDocument, content: {} } },
        state.document.projectId,
      ),
    ).toBe(false);
    expect(
      isStoredEditorState(
        { ...state, environment: { ...state.environment, canEdit: "yes" } },
        state.document.projectId,
      ),
    ).toBe(false);
  });

  it.each([
    "javascript:alert(1)",
    "https://tracking.example/photo.png",
    "/assets/bad.svg",
    "data:image/svg+xml;base64,PHN2Zz4=",
    "/assets/../secret.png",
  ])("rejects unsafe media %s", (src) => {
    expect(isSafeStudioImage(src)).toBe(false);
    const state = createEditorState();
    state.document.cover.src = src;
    expect(isStoredEditorState(state, state.document.projectId)).toBe(false);
  });

  it("accepts local raster assets and uploaded raster data", () => {
    expect(isSafeStudioImage("/assets/images/editorial-1.png")).toBe(true);
    expect(isSafeStudioImage("data:image/png;base64,aGVsbG8=")).toBe(true);
  });

  it("hydrates dirty local changes and revoked permission without reporting saved", () => {
    const initial = createEditorState();
    const draft = editorReducer(initial, { type: "rename", title: "Draf lokal" });
    const revoked = editorReducer(draft, { type: "environment", patch: { canEdit: false } });
    const restored = editorReducer(initial, { type: "hydrate", state: revoked });
    expect(restored.document.title).toBe("Draf lokal");
    expect(restored.dirty).toBe(true);
    expect(restored.saveStatus).toBe("forbidden");
    expect(restored.environment.canEdit).toBe(false);
  });
});

describe("historical and conflict snapshots", () => {
  it("constructs history from the baseline rather than current mutable appearance", () => {
    const state = createEditorState();
    const document = structuredClone(state.document);
    document.cover.crop.scale = 2;
    document.theme = "cypress";
    document.nodes[2]!.x = 90;
    document.content.groom = "Perubahan terbaru";
    const history = createHistoryDocument(document);
    expect(history.revision).toBe(2);
    expect(history.cover.crop.scale).toBe(1);
    expect(history.theme).toBe("editorial");
    expect(history.nodes[2]?.x).toBe(24);
    expect(history.content.groom).toBe("Andi Ramadhan");
    expect(history.activeVersion).toBe(3);
  });

  it("resolves only the conflicting venue while retaining unrelated local edits", () => {
    const initial = createEditorState();
    const changed = editorReducer(initial, {
      type: "edit",
      document: {
        ...initial.document,
        content: { ...initial.document.content, groom: "Andi R.", venue: "Hall" },
      },
    });
    const stale = editorReducer(changed, { type: "environment", patch: { serverVersion: 5 } });
    const resolved = editorReducer(stale, { type: "resolve", source: "server" });
    expect(resolved.document.content.venue).toBe("Garden");
    expect(resolved.document.content.groom).toBe("Andi R.");
    expect(resolved.document.expectedVersion).toBe(5);
  });

  it.each(["2027-02-30", "invalid"])("blocks invalid event date %s", (date) => {
    const initial = createEditorState();
    const state = {
      ...initial,
      document: { ...initial.document, content: { ...initial.document.content, date } },
    };
    expect(getPublishBlockers(state)).toContain(
      "Masukkan tanggal acara dan batas RSVP yang valid.",
    );
  });

  it("blocks RSVP deadlines after the event date", () => {
    const initial = createEditorState();
    const state = {
      ...initial,
      document: {
        ...initial.document,
        content: { ...initial.document.content, rsvpDeadline: "2027-02-15" },
      },
    };
    expect(getPublishBlockers(state)).toContain("Batas RSVP tidak boleh melewati tanggal acara.");
  });

  it("keeps engagement event and dates when creating another project in that event", () => {
    const created = editorReducer(createEditorState("inv-engagement"), { type: "new" });
    expect(created.document.eventId).toBe("event-engagement");
    expect(created.document.content.date).toBe("2026-11-22");
    expect(created.document.content.rsvpDeadline).toBe("2026-11-15");
  });

  it.each(["duplicate", "new"] as const)(
    "uses distinct caller project IDs for repeated %s",
    (type) => {
      const source = createEditorState();
      const first = editorReducer(source, { type, projectId: "studio-project-first" });
      const second = editorReducer(source, { type, projectId: "studio-project-second" });
      expect(first.document.projectId).toBe("studio-project-first");
      expect(second.document.projectId).toBe("studio-project-second");
      expect(first.document.eventId).toBe(source.document.eventId);
      expect(first.activeDocument).toBeNull();
    },
  );

  it.each(["inv-engagement", "inv-wedding-vip", "new"])(
    "does not invent historical v2 for %s",
    (projectId) => {
      const source = createEditorState(projectId);
      const restored = editorReducer(source, { type: "restore" });
      expect(restored.document).toEqual(source.document);
      expect(restored.activeDocument).toEqual(source.activeDocument);
      expect(restored.dirty).toBe(false);
      expect(restored.notice).toContain("Riwayat v2 tidak tersedia");
    },
  );
});
