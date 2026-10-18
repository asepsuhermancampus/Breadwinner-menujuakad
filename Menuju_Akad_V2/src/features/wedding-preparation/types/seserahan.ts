export type SeserahanItem = {
  id: string;
  name: string;
  category: string;
  estimatedCost: number;
  actualCost: number;
  isBought: boolean;
  pic: "Andi" | "Risa" | "Bersama";
  imageSrc?: string;
  notes?: string;
};

export type SeserahanSummary = {
  totalItems: number;
  boughtCount: number;
  pendingCount: number;
  totalEstimated: number;
  totalActual: number;
};
