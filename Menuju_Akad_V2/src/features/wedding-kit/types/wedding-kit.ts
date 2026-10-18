export type WeddingKitSection = {
  id: string;
  name: string;
  detail: string;
  selected: boolean;
};

export type WeddingKitExportConfig = {
  paperSize: "A4" | "Letter";
  language: "id" | "en";
  includeSections: string[];
};
