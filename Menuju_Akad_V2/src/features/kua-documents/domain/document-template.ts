export type DocumentItem = { id: string; title: string; completed?: boolean; notes?: string };
export function createDocumentTemplate(): DocumentItem[] {
  return [
    "Identitas calon pasangan",
    "Kartu keluarga",
    "Akta kelahiran",
    "Pasfoto pasangan",
    "Surat pengantar administrasi nikah",
    "Dokumen wali dan saksi",
    "Dokumen tambahan sesuai kondisi pasangan",
    "Konfirmasi jadwal dan pemeriksaan berkas KUA",
  ].map((title, i) => ({
    id: `kua-template-${i + 1}`,
    title,
    completed: false,
    notes: "Sesuaikan kebutuhan dan format dengan KUA setempat.",
  }));
}
