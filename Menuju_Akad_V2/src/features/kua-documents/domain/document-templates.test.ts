import { describe, expect, it } from "vitest";
import { documentTemplates } from "./template-catalog";
import {
  applyDocumentTemplate,
  activeDocuments,
  removeDocument,
  copyDocumentList,
  preservesMainDocuments,
  addSelectedDocuments,
  documentOptions,
  releaseDocumentTemplates,
  resetDocumentChecks,
} from "./document-template";
import { documentSchema } from "./document-schema";

describe("confirmed document templates", () => {
  it("resets only checkmarks in the selected card and preserves the other card", () => {
    const rows = applyDocumentTemplate(applyDocumentTemplate([], "main"), "outside").map(
      (item) => ({ ...item, completed: true }),
    );
    const reset = resetDocumentChecks(rows, "main");
    expect(reset.filter((item) => item.group === "main").every((item) => !item.completed)).toBe(
      true,
    );
    expect(reset.find((item) => item.group === "additional")?.completed).toBe(true);
    expect(reset.map((item) => item.title)).toEqual(rows.map((item) => item.title));
    expect(resetDocumentChecks(reset, "additional").every((item) => !item.completed)).toBe(true);
  });
  it("releases template groups and enables applying them again while retaining custom documents", () => {
    const own = { id: "own", title: "Berkas tambahan saya", group: "additional" as const };
    const main = applyDocumentTemplate([], "main");
    const all = [...applyDocumentTemplate(main, "optional"), own];
    const releasedMain = releaseDocumentTemplates(all, "main");
    expect(releasedMain.some((item) => item.group === "main")).toBe(false);
    expect(preservesMainDocuments(all, releasedMain)).toBe(true);
    expect(releaseDocumentTemplates(releasedMain, "additional")).toEqual([own]);
    expect(
      applyDocumentTemplate(releasedMain, "main").filter((item) => item.group === "main"),
    ).toHaveLength(11);
    expect(releaseDocumentTemplates(all, "all")).toEqual([]);
  });
  it("adds only selected documents, then completes the main template without duplicates", () => {
    const options = documentOptions().filter((item) => item.group === "main");
    const selected = addSelectedDocuments([], [options[0]!.id, options[2]!.id]);
    expect(selected).toHaveLength(2);
    expect(addSelectedDocuments(selected, [options[0]!.id])).toEqual(selected);
    const full = applyDocumentTemplate(selected, "main");
    expect(full).toHaveLength(options.length);
    expect(new Set(full.map((item) => item.id)).size).toBe(full.length);
    expect(full.slice(0, 2)).toEqual(selected);
  });
  it("applies only the requested template and preserves custom/legacy documents", () => {
    const old = { id: "old", title: "Berkas saya", completed: true };
    const result = applyDocumentTemplate([old], "main");
    expect(result).toHaveLength(12);
    expect(result[0]).toEqual(old);
    expect(result.slice(1).every((item) => item.group === "main" && !item.completed)).toBe(true);
    expect(result.some((item) => item.templateId === "under19")).toBe(false);
  });
  it("never applies a template twice, even after editing or deleting all its documents", () => {
    const first = applyDocumentTemplate([], "outside");
    const edited = first.map((item) => ({ ...item, title: "Nama baru" }));
    expect(applyDocumentTemplate(edited, "outside")).toEqual(edited);
    const removed = removeDocument(edited, edited[0]!.id);
    expect(activeDocuments(removed)).toEqual([]);
    expect(applyDocumentTemplate(removed, "outside")).toEqual(removed);
    expect(activeDocuments(applyDocumentTemplate(removed, "main"))).toHaveLength(11);
  });
  it("separates conditional documents and copy output and excludes removed items", () => {
    const items = applyDocumentTemplate(applyDocumentTemplate([], "main"), "under19");
    expect(items.filter((item) => item.group === "additional")).toHaveLength(1);
    const removed = removeDocument(items, items.at(-1)!.id);
    const text = copyDocumentList(removed);
    expect(text).toContain("Berkas Utama");
    expect(text).toContain("Berkas Tambahan Berdasarkan Kondisi");
    expect(text).toContain(items[0]!.title);
    expect(text).not.toContain("dispensasi");
    expect(documentTemplates.every((template) => template.items.length > 0)).toBe(true);
  });
  it("allows checking/resetting main documents but rejects edits, removal and regrouping", () => {
    const items = applyDocumentTemplate([], "main");
    expect(
      preservesMainDocuments(
        items,
        items.map((item) => ({ ...item, completed: true })),
      ),
    ).toBe(true);
    expect(preservesMainDocuments(items, [])).toBe(true);
    expect(preservesMainDocuments(items, items.slice(1))).toBe(false);
    expect(
      preservesMainDocuments(
        items,
        items.map((item) => ({ ...item, title: "Diubah" })),
      ),
    ).toBe(false);
    expect(
      preservesMainDocuments(
        items,
        items.map((item) => ({ ...item, group: "additional" })),
      ),
    ).toBe(false);
    expect(removeDocument(items, items[0]!.id)).toEqual(items);
  });
  it("keeps template metadata through validation and accepts legacy rows", () => {
    const item = { ...applyDocumentTemplate([], "main")[0]!, archived: true };
    expect(documentSchema.parse(item)).toEqual(item);
    expect(documentSchema.parse({ id: "legacy", title: "Dokumen lama" })).toEqual({
      id: "legacy",
      title: "Dokumen lama",
    });
  });
});
