import type { PlanId } from "../types/plans";
import { capabilitiesFor, type Capability } from "./capabilities";
import { calculatePaymentPrice } from "@/features/payments/domain/payment-pricing";

export type PaidPlanId = Exclude<PlanId, "free">;
export interface PlanDefinition {
  id: PlanId;
  label: string;
  originalAmount: number;
  durationMonths: number | null;
  revision: string;
  features: readonly string[];
  capabilities: readonly Capability[];
}

const definitions = {
  free: {
    label: "Free",
    originalAmount: 0,
    durationMonths: null,
    features: [
      "Workspace untuk berdua",
      "Checklist & dokumen dasar",
      "Hingga 100 data tamu",
      "1 template undangan dasar",
      "Catatan anggaran sederhana",
    ],
  },
  premium: {
    label: "Premium",
    originalAmount: 149000,
    durationMonths: 6,
    features: [
      "Semua fitur Free",
      "Tamu & tugas tanpa batas",
      "Template undangan premium",
      "Studio visual & moodboard",
      "Ekspor rencana ke PDF",
    ],
  },
  lifetime: {
    label: "Lifetime",
    originalAmount: 399000,
    durationMonths: null,
    features: [
      "Semua fitur Premium",
      "Akses tanpa kedaluwarsa",
      "Multi-undangan",
      "Custom domain",
      "Prioritas bantuan pasangan",
    ],
  },
} as const;

export function getPlan(id: PlanId): PlanDefinition {
  if (!Object.hasOwn(definitions, id)) throw new Error("Paket tidak dikenal");
  return { id, ...definitions[id], revision: "2026-10-21", capabilities: capabilitiesFor(id) };
}

export function pricePlan(id: PaidPlanId, claimDiscount: boolean) {
  if (id !== "premium" && id !== "lifetime") throw new Error("Paket tidak dapat dibayar");
  return calculatePaymentPrice(getPlan(id).originalAmount, claimDiscount);
}
