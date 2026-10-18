export type KuaDocStatus = "Lengkap" | "Perlu revisi" | "Menunggu unggah" | "Opsional";

export type KuaDocumentItem = {
  id: string;
  name: string;
  requirement: "Wajib" | "Opsional";
  statusAndi: KuaDocStatus;
  statusRisa: KuaDocStatus;
  updatedAt: string;
  notesAndi?: string | undefined;
  notesRisa?: string | undefined;
  fileAndi?: string | undefined;
  fileRisa?: string | undefined;
};

export type KuaOverview = {
  andiSummary: { completed: number; total: number };
  risaSummary: { completed: number; total: number };
  attentionCount: number;
  documents: KuaDocumentItem[];
};
