import type { PlanId } from "../types/plans";

export type PlanOption = {
  id: PlanId;
  label: string;
  priceIdr: number;
  period: string;
  description: string;
  features: string[];
  action: string;
};

export const planOptions: PlanOption[] = [
  {
    id: "free",
    label: "Free",
    priceIdr: 0,
    period: "gratis, tanpa batas waktu",
    description: "Mulai merapikan niat baik.",
    features: [
      "1 workspace pasangan",
      "Checklist & dokumen dasar",
      "Hingga 100 data tamu",
      "1 template undangan dasar",
      "Catatan anggaran sederhana",
    ],
    action: "Lihat opsi Free",
  },
  {
    id: "premium",
    label: "Premium",
    priceIdr: 149000,
    period: "per 6 bulan",
    description: "Untuk rencana yang lebih lengkap.",
    features: [
      "Semua fitur Free",
      "Tamu & tugas tanpa batas",
      "Seluruh template premium",
      "Studio visual & moodboard",
      "Ekspor PDF & sinkronisasi vendor",
    ],
    action: "Perpanjang Premium",
  },
  {
    id: "lifetime",
    label: "Lifetime",
    priceIdr: 399000,
    period: "sekali bayar · tanpa kedaluwarsa",
    description: "Satu investasi, seluruh perjalanan.",
    features: [
      "Semua fitur Premium",
      "Akses premium selamanya",
      "Multi-undangan & custom domain",
      "Wedding Kit eksklusif",
      "Prioritas bantuan pasangan",
    ],
    action: "Aktifkan Lifetime",
  },
];
