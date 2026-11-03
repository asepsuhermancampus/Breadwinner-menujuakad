import { describe, it, expect } from "vitest";
import type { SeserahanItem } from "@/features/wedding-preparation/types/seserahan";
import {
  categorizeSeserahan,
  buildOverviewSeserahanSlices,
  buildOverviewSeserahanCategorySlices,
} from "./overview-seserahan-slices";

const sampleSeserahan: SeserahanItem[] = [
  { id: "s1", name: "Mukena & Sajadah", category: "Ibadah", estimatedCost: 500000, actualCost: 450000, isBought: true, pic: "Andi" },
  { id: "s2", name: "Set Skincare", category: "Perawatan", estimatedCost: 1000000, actualCost: 0, isBought: false, pic: "Risa" },
  { id: "s3", name: "Sepatu Hak Tinggi", category: "Busana", estimatedCost: 800000, actualCost: 750000, isBought: true, pic: "Bersama" },
];

describe("categorizeSeserahan", () => {
  it("calculates totals and bought rate properly", () => {
    const c = categorizeSeserahan(sampleSeserahan);
    expect(c.totalItems).toBe(3);
    expect(c.boughtCount).toBe(2);
    expect(c.pendingCount).toBe(1);
    expect(c.totalEstimated).toBe(2300000);
    expect(c.totalActual).toBe(1200000);
    expect(c.readyRate).toBe(67);
  });
});

describe("buildOverviewSeserahanSlices", () => {
  it("generates bought status slices", () => {
    const c = categorizeSeserahan(sampleSeserahan);
    const { slices, centerValue } = buildOverviewSeserahanSlices(c);
    expect(slices).toHaveLength(2);
    expect(centerValue).toBe("67%");
  });
});

describe("buildOverviewSeserahanCategorySlices", () => {
  it("groups items into category slices", () => {
    const { slices, centerValue } = buildOverviewSeserahanCategorySlices(sampleSeserahan);
    expect(slices).toHaveLength(3);
    expect(centerValue).toBe(3);
  });
});
