import type { DocumentTemplate } from "./document-catalog-types";
import { mainTemplate } from "./document-main-template";
import { documentStandardTemplates } from "./document-standard-templates";
import { documentSpecialTemplates } from "./document-special-templates";

export type { DocumentGroup, DocumentTemplate } from "./document-catalog-types";
export {
  documentSource,
  documentSourceCheckedAt,
  documentSources,
} from "./document-catalog-sources";

export const documentConditionalTemplates: DocumentTemplate[] = [
  ...documentStandardTemplates,
  ...documentSpecialTemplates,
];

export const documentTemplates: DocumentTemplate[] = [
  mainTemplate,
  ...documentConditionalTemplates,
  {
    id: "optional",
    name: "Berkas Opsional / Sesuai Kondisi",
    group: "additional",
    description:
      "Kumpulan berkas bersyarat yang wajib saat kondisinya berlaku, serta perjanjian perkawinan opsional. Hapus yang tidak relevan setelah ditambahkan.",
    legalBasis: "PMA 30/2024; rincian pasal mengikuti masing-masing kondisi.",
    items: documentConditionalTemplates.flatMap((template) => template.items),
    itemNotes: documentConditionalTemplates.flatMap((template) =>
      template.items.map((_, index) =>
        [template.name, template.description, template.itemNotes?.[index] ?? template.legalBasis]
          .filter(Boolean)
          .join(". "),
      ),
    ),
  },
];
