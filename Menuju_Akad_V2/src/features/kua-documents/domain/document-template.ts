import { documentTemplates, type DocumentGroup } from "./template-catalog";
import type { DocumentItem } from "./document-schema";
export type { DocumentItem } from "./document-schema";
export function createDocumentTemplate(): DocumentItem[] {
  return [];
}
export function activeDocuments(items: DocumentItem[]) {
  return items.filter((item) => !item.archived);
}
export function applyDocumentTemplate(items: DocumentItem[], templateId: string): DocumentItem[] {
  return addSelectedDocuments(
    items,
    documentOptions()
      .filter((item) =>
        templateId === "optional" ? item.group === "additional" : item.templateId === templateId,
      )
      .map((item) => item.id),
  );
}
export function documentOptions(): DocumentItem[] {
  return documentTemplates
    .filter((template) => template.id !== "optional")
    .flatMap((template) =>
      template.items.map((title, index) => ({
        id: `kua-v2-${template.id}-${index + 1}`,
        title,
        group: template.group,
        templateId: template.id,
        completed: false,
        notes:
          template.itemNotes?.[index] ??
          (template.group === "additional"
            ? template.description
            : "Sesuaikan kebutuhan dan format dengan KUA setempat."),
      })),
    );
}
export function addSelectedDocuments(items: DocumentItem[], ids: string[]): DocumentItem[] {
  const chosen = new Set(ids),
    existing = new Set(items.map((item) => item.id));
  return [
    ...items,
    ...documentOptions().filter((item) => chosen.has(item.id) && !existing.has(item.id)),
  ];
}
export function removeDocument(items: DocumentItem[], id: string) {
  return items.flatMap((item) =>
    item.id !== id || item.group === "main"
      ? [item]
      : item.templateId
        ? [{ ...item, archived: true, completed: false }]
        : [],
  );
}
export function preservesMainDocuments(previous: DocumentItem[], next: DocumentItem[]) {
  const main = previous.filter((item) => item.group === "main");
  return [...new Set(main.map((item) => item.templateId))].every((templateId) => {
    const cohort = main.filter((item) => item.templateId === templateId);
    const removed = cohort.every((item) => !next.some((row) => row.id === item.id));
    if (removed && !next.some((row) => row.group === "main" && row.templateId === templateId))
      return true;
    return cohort.every((item) => {
      const changed = next.find((row) => row.id === item.id);
      return (
        changed &&
        changed.title === item.title &&
        changed.notes === item.notes &&
        changed.group === "main" &&
        changed.templateId === item.templateId &&
        !changed.archived
      );
    });
  });
}
export type DocumentReleaseScope = "main" | "additional" | "all";
export function resetDocumentChecks(items: DocumentItem[], group: DocumentGroup) {
  return items.map((item) =>
    (item.group ?? "additional") === group ? { ...item, completed: false } : item,
  );
}
export function releaseDocumentTemplates(items: DocumentItem[], scope: DocumentReleaseScope) {
  return scope === "all"
    ? []
    : items.filter((item) => !((item.group ?? "additional") === scope && item.templateId));
}
export function copyDocumentList(items: DocumentItem[]): string {
  const active = activeDocuments(items);
  return (
    (
      [
        ["main", "Berkas Utama"],
        ["additional", "Berkas Tambahan Berdasarkan Kondisi"],
      ] as const
    )
      .map(
        ([group, label]) =>
          `${label}\n${
            active
              .filter((item) => (item.group ?? "additional") === group)
              .map(
                (item) =>
                  `${item.completed ? "[x]" : "[ ]"} ${item.title}${item.notes ? ` — ${item.notes}` : ""}`,
              )
              .join("\n") || "Belum ada berkas."
          }`,
      )
      .join("\n\n") +
    "\n\nChecklist mandiri, bukan verifikasi kelengkapan oleh KUA. Konfirmasi persyaratan ke KUA setempat."
  );
}
