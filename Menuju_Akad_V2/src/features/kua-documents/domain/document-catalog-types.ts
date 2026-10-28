export type DocumentGroup = "main" | "additional";
export type DocumentTemplate = {
  id: string;
  name: string;
  description: string;
  group: DocumentGroup;
  items: string[];
  legalBasis?: string;
  itemNotes?: string[];
};
