import type { PlanningKind } from "./planning-resource";
export const planningLabels: Record<PlanningKind, string> = {
  calendar: "Kalender",
  rundown: "Rundown",
  seserahan: "Seserahan",
  emergency: "Emergency",
  catering: "Catering",
};
export type PlanningField = {
  key: string;
  label: string;
  type: "text" | "date" | "time" | "number";
};
export const planningFields: Record<PlanningKind, PlanningField[]> = {
  calendar: [
    { key: "date", label: "Tanggal", type: "date" },
    { key: "startTime", label: "Mulai", type: "time" },
    { key: "endTime", label: "Selesai", type: "time" },
  ],
  rundown: [
    { key: "order", label: "Urutan", type: "number" },
    { key: "startTime", label: "Waktu", type: "time" },
    { key: "pic", label: "Penanggung jawab", type: "text" },
  ],
  seserahan: [
    { key: "quantity", label: "Jumlah", type: "number" },
    { key: "unitCost", label: "Harga satuan (Rp)", type: "number" },
  ],
  emergency: [{ key: "phone", label: "Nomor kontak", type: "text" }],
  catering: [
    { key: "portions", label: "Porsi", type: "number" },
    { key: "unitCost", label: "Biaya per porsi (Rp)", type: "number" },
  ],
};
