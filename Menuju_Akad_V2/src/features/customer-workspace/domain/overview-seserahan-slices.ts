import type { SeserahanItem } from "@/features/wedding-preparation/types/seserahan";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";

export type SeserahanCategorization = {
  totalItems: number;
  boughtCount: number;
  pendingCount: number;
  totalEstimated: number;
  totalActual: number;
  readyRate: number;
};

export function categorizeSeserahan(items: SeserahanItem[]): SeserahanCategorization {
  let boughtCount = 0;
  let totalEstimated = 0;
  let totalActual = 0;

  for (const item of items) {
    totalEstimated += item.estimatedCost || 0;
    totalActual += item.actualCost || 0;
    if (item.isBought) boughtCount += 1;
  }

  const readyRate = items.length > 0 ? Math.round((boughtCount / items.length) * 100) : 0;

  return {
    totalItems: items.length,
    boughtCount,
    pendingCount: items.length - boughtCount,
    totalEstimated,
    totalActual,
    readyRate,
  };
}

export function buildOverviewSeserahanSlices(c: SeserahanCategorization): {
  slices: DonutSlice[];
  centerValue: string;
  centerLabel: string;
} {
  const total = c.totalItems;
  if (total <= 0) {
    return { slices: [], centerValue: "0%", centerLabel: "Kotak Siap" };
  }

  const boughtPercent = Math.round((c.boughtCount / total) * 100);
  const pendingPercent = Math.max(0, 100 - boughtPercent);

  const slices: DonutSlice[] = [];
  if (boughtPercent > 0) {
    slices.push({
      id: "bought", label: "Sudah Dibeli", percent: boughtPercent,
      amount: c.boughtCount, color: "#059669",
    });
  }
  if (pendingPercent > 0) {
    slices.push({
      id: "pending", label: "Belum Dibeli", percent: pendingPercent,
      amount: c.pendingCount, color: "#f59e0b",
    });
  }

  return { slices, centerValue: `${c.readyRate}%`, centerLabel: "Kotak Siap" };
}

export function buildOverviewSeserahanCategorySlices(items: SeserahanItem[]): {
  slices: DonutSlice[];
  centerValue: string | number;
  centerLabel: string;
} {
  if (items.length === 0) {
    return { slices: [], centerValue: 0, centerLabel: "Total Item" };
  }

  const catMap = new Map<string, number>();
  for (const item of items) {
    const cat = item.category || "Lainnya";
    catMap.set(cat, (catMap.get(cat) ?? 0) + 1);
  }

  const colors = ["#059669", "#0284c7", "#ec4899", "#d97706", "#0d9488", "#64748b"];
  const slices: DonutSlice[] = [];
  let idx = 0;

  for (const [cat, count] of catMap.entries()) {
    slices.push({
      id: `cat-${idx}`,
      label: cat,
      percent: Math.round((count / items.length) * 100),
      amount: count,
      color: colors[idx % colors.length] ?? "#64748b",
    });
    idx += 1;
  }

  return { slices, centerValue: items.length, centerLabel: "Total Kotak" };
}

