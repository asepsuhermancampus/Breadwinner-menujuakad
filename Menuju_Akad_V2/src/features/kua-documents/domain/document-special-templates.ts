import type { DocumentTemplate } from "./document-catalog-types";

export const documentSpecialTemplates: DocumentTemplate[] = [
  {
    id: "foreign-national",
    name: "Calon pengantin WNA",
    group: "additional",
    description:
      "Dokumen bagi WNA yang menikah dengan WNI; apostille, status perkawinan dan izin poligami hanya bila relevan.",
    legalBasis: "PMA 30/2024 Pasal 4 ayat (3)–(6).",
    items: [
      "Certificate of no impediment / surat keterangan tidak ada halangan menikah dari kedutaan atau perwakilan negara WNA; instansi negara asal bila tidak ada perwakilan di Indonesia",
      "Fotokopi sertifikat apostille untuk surat status/tidak ada halangan menikah dari negara yang menerapkan apostille",
      "Fotokopi akta kelahiran calon pengantin WNA",
      "Fotokopi paspor calon pengantin WNA",
      "Data kedua orang tua calon pengantin WNA",
      "Akta cerai atau surat keterangan kematian pasangan sebelumnya bagi WNA duda / janda",
      "Izin poligami dari pengadilan atau instansi berwenang negara asal bagi WNA yang akan beristri lebih dari seorang; pengadilan Indonesia bila negara asal tidak mengatur",
      "Terjemahan resmi bahasa Indonesia dokumen WNA berbahasa asing, kecuali bahasa Melayu",
    ],
  },
  {
    id: "overseas-indonesian",
    name: "WNI di luar negeri tanpa dokumen kependudukan",
    group: "additional",
    description:
      "Jalur persyaratan khusus Pasal 4 ayat (2), sebagai pengganti berkas kependudukan dalam negeri; dokumen status dan izin disesuaikan kondisi.",
    legalBasis: "PMA 30/2024 Pasal 4 ayat (2).",
    items: [
      "Surat pengantar dari Perwakilan Republik Indonesia bagi WNI di luar negeri yang tidak memiliki dokumen kependudukan",
      "Persetujuan kedua calon pengantin untuk jalur WNI di luar negeri tanpa dokumen kependudukan",
      "Izin tertulis orang tua / wali bila WNI di luar negeri belum 21 tahun",
      "Penetapan izin poligami pengadilan bila WNI di luar negeri akan beristri lebih dari seorang",
      "Akta cerai atau surat keterangan cerai instansi berwenang bila WNI di luar negeri pernah bercerai",
      "Akta kematian pasangan sebelumnya bila WNI di luar negeri berstatus duda / janda ditinggal mati",
    ],
  },
  {
    id: "absent-guardian",
    name: "Wali nikah tidak hadir",
    group: "additional",
    description: "Wajib jika wali nikah mewakilkan dan tidak hadir saat akad.",
    legalBasis: "PMA 30/2024 Pasal 12 ayat (5).",
    items: [
      "Surat kuasa wakil wali / taukil wali di hadapan PPN sesuai domisili atau keberadaan wali, disaksikan dua orang",
    ],
  },
  {
    id: "absent-groom",
    name: "Calon suami diwakilkan saat akad",
    group: "additional",
    description: "Wajib jika calon suami tidak hadir dan diwakilkan saat akad.",
    legalBasis: "PMA 30/2024 Pasal 11 ayat (3).",
    items: [
      "Surat kuasa bermeterai calon suami yang diwakilkan, diketahui dua saksi dan Kepala KUA setempat",
    ],
  },
  {
    id: "judge-guardian",
    name: "Dokumen untuk wali hakim",
    group: "additional",
    description:
      "Pilih hanya bukti sesuai alasan penggunaan wali hakim; tidak semua kondisi wali hakim memerlukan dokumen berikut.",
    legalBasis: "PMA 30/2024 Pasal 13 ayat (6)–(8).",
    items: [
      "Penetapan pengadilan untuk wali adhal (menolak menikahkan)",
      "Surat pernyataan bermeterai calon pengantin dan dua saksi bila keberadaan wali tidak diketahui",
      "Surat pernyataan pertanggungjawaban mutlak anggota keluarga bila wali dalam tahanan tidak dapat dihadirkan / ditemui",
    ],
  },
  {
    id: "medical-clarification",
    name: "Keterangan dokter saat pemeriksaan khusus",
    group: "additional",
    description: "Hanya bila PPN meminta klarifikasi jenis kelamin dalam pemeriksaan nikah.",
    legalBasis: "PMA 30/2024 Pasal 6 ayat (3).",
    items: [
      "Surat keterangan dokter mengenai jenis kelamin bila diminta PPN dalam pemeriksaan khusus",
    ],
  },
  {
    id: "marriage-agreement",
    name: "Perjanjian perkawinan (opsional)",
    group: "additional",
    description:
      "Pilihan pasangan, bukan syarat wajib menikah. Bila membuat perjanjian, lakukan di hadapan notaris dan sampaikan untuk pencatatan KUA.",
    legalBasis: "PMA 30/2024 Pasal 39–40.",
    items: ["Akta perjanjian perkawinan di hadapan notaris, bila pasangan memilih membuatnya"],
  },
];
