import { expect, it } from "vitest";
import { removeLegacyDocumentDefaults } from "./legacy-document-defaults";
const seeded = {
  id: "kua-template-1",
  title: "Identitas calon pasangan",
  completed: false,
  notes: "Sesuaikan kebutuhan dan format dengan KUA setempat.",
};
it("removes only the recognized automatic legacy defaults, including old checked samples", () => {
  expect(
    removeLegacyDocumentDefaults([
      seeded,
      { id: "kua-template-2", title: "Kartu keluarga", completed: true, notes: seeded.notes },
    ]),
  ).toEqual([]);
});
it("preserves custom edits, modern selections, and user-created documents", () => {
  const own = [
    { ...seeded, title: "Berkas saya" },
    { ...seeded, id: "own" },
    { ...seeded, notes: "Catatan keluarga" },
    { ...seeded, group: "main" as const, templateId: "main" },
  ];
  expect(removeLegacyDocumentDefaults(own)).toEqual(own);
  expect(removeLegacyDocumentDefaults([...own, seeded])).toEqual(own);
});
