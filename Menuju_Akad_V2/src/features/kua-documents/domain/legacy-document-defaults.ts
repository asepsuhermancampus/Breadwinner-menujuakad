import type { DocumentItem } from "./document-schema";

const oldTitles = [
  "Identitas calon pasangan",
  "Kartu keluarga",
  "Akta kelahiran",
  "Pasfoto pasangan",
  "Surat pengantar administrasi nikah",
  "Dokumen wali dan saksi",
  "Dokumen tambahan sesuai kondisi pasangan",
  "Konfirmasi jadwal dan pemeriksaan berkas KUA",
];

/** Remove only known, unchanged rows once seeded automatically by the old initializer. */
export function removeLegacyDocumentDefaults(items: DocumentItem[]): DocumentItem[] {
  return items.filter((item) => {
    const index = oldTitles.findIndex((_, position) => item.id === `kua-template-${position + 1}`);
    return !(
      index >= 0 &&
      item.title === oldTitles[index] &&
      item.notes === "Sesuaikan kebutuhan dan format dengan KUA setempat." &&
      item.group === undefined &&
      item.templateId === undefined
    );
  });
}
