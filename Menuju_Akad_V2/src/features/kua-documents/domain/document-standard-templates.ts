import type { DocumentTemplate } from "./document-catalog-types";

// Preserve scenario IDs and item positions for saved checklist references.
export const documentStandardTemplates: DocumentTemplate[] = [
  {
    id: "outside",
    name: "Di luar kecamatan domisili",
    group: "additional",
    description: "Wajib bila pernikahan berlangsung di luar kecamatan tempat tinggal.",
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf e dan Pasal 17 ayat (2)–(3).",
    items: ["Surat rekomendasi nikah dari KUA asal, sesuai ketentuan KUA tujuan"],
  },
  {
    id: "under21",
    name: "Usia belum 21 tahun",
    group: "additional",
    description: "Pilih jika salah satu calon pengantin belum berusia 21 tahun.",
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf h.",
    items: ["Surat izin tertulis orang tua atau wali sesuai ketentuan"],
  },
  {
    id: "under19",
    name: "Usia belum 19 tahun",
    group: "additional",
    description:
      "Pilih jika salah satu calon pengantin belum berusia 19 tahun. Periksa juga template izin orang tua.",
    items: ["Penetapan dispensasi kawin dari pengadilan"],
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf k; usia pada tanggal akad nikah.",
  },
  {
    id: "divorced",
    name: "Pernah bercerai",
    group: "additional",
    description: "Pilih jika calon pengantin berstatus duda atau janda karena perceraian.",
    items: [
      "Akta cerai yang sah atau kutipan buku pendaftaran talak/cerai untuk perceraian sebelum UU 7/1989",
    ],
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf n.",
  },
  {
    id: "widowed",
    name: "Pasangan sebelumnya meninggal",
    group: "additional",
    description: "Pilih jika calon pengantin berstatus duda atau janda karena pasangan meninggal.",
    items: ["Akta kematian pasangan sebelumnya"],
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf o.",
  },
  {
    id: "service",
    name: "Anggota TNI / Polri",
    group: "additional",
    description: "Wajib jika salah satu calon pengantin berstatus anggota TNI atau Polri.",
    items: ["Surat izin dari atasan atau kesatuan bagi anggota TNI / Polri"],
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf l.",
  },
  {
    id: "court",
    name: "Izin pengadilan untuk poligami",
    group: "additional",
    description:
      "Hanya bila calon suami akan beristri lebih dari seorang dan ketentuan ini relevan.",
    items: ["Penetapan izin poligami dari pengadilan sesuai ketentuan"],
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf m.",
  },
  {
    id: "substitute-parent-consent",
    name: "Izin pengganti orang tua / wali",
    group: "additional",
    description:
      "Untuk calon pengantin yang memerlukan izin ketika orang tua/wali meninggal atau tidak mampu menyatakan kehendak; pilih dokumen sesuai keadaan.",
    legalBasis: "PMA 30/2024 Pasal 4 ayat (1) huruf i–j.",
    items: [
      "Izin wali pengasuh, keluarga sedarah atau pengampu bila orang tua/wali meninggal atau tidak mampu menyatakan kehendak",
      "Izin pengadilan bila orang tua, wali dan pengampu tidak ada",
    ],
  },
  {
    id: "short-notice",
    name: "Pendaftaran kurang dari 10 hari kerja",
    group: "additional",
    description:
      "Wajib bila mendaftar kurang dari 10 hari kerja sebelum akad; gunakan salah satu dokumen alternatif.",
    legalBasis: "PMA 30/2024 Pasal 3 ayat (3).",
    items: [
      "Surat dispensasi camat atau surat pernyataan pertanggungjawaban bermeterai beserta alasan pendaftaran kurang dari 10 hari kerja",
    ],
  },
];
