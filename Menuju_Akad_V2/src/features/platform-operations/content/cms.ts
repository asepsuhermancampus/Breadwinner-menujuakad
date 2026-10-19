import type { ContentEntry } from "../types/operations";
export const contentEntries: ContentEntry[] = [
  {
    id: "TPL-012",
    title: "Editorial Light",
    category: "Template",
    active: 12,
    draft: 13,
    text: "Template Editorial Light · judul dan komposisi yang lebih lapang.",
  },
  {
    id: "PR-004",
    title: "Paket Premium",
    category: "Paket",
    active: 7,
    draft: null,
    text: "Paket Premium · entitlement pembeli mengikuti snapshot pembelian.",
  },
  {
    id: "LND-001",
    title: "Landing utama",
    category: "Landing",
    active: 8,
    draft: null,
    text: "Rencanakan pernikahan Anda, bersama.",
  },
  {
    id: "BLG-007",
    title: "RSVP per sesi",
    category: "Blog & SEO",
    active: 5,
    draft: 6,
    text: "Jawaban RSVP disimpan per sesi; bukan penjumlahan tamu unik.",
  },
  {
    id: "LGL-003",
    title: "Privasi",
    category: "Legal",
    active: 3,
    draft: 4,
    text: "Tinjauan kebijakan privasi global, terpisah dari proyek undangan.",
  },
];
export const contentCategories = ["Semua", "Template", "Paket", "Landing", "Blog & SEO", "Legal"];
