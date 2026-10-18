import { describe, expect, it } from "vitest";
import { calculateBundleTotal, formatIdr } from "./marketplace-calc";
import type { BundleItem } from "../types/marketplace";

describe("marketplace-calc utils", () => {
  it("formats IDR currency accurately", () => {
    const formatted = formatIdr(15000000);
    expect(formatted).toContain("15.000.000");
  });

  it("calculates subtotal and 30% DP matching prompt contracts", () => {
    const items: BundleItem[] = [
      {
        id: "1",
        vendorId: "v-aru",
        vendorName: "Aru MUA",
        serviceName: "Paket Akad",
        unitPriceIdr: 8000000,
        quantity: 1,
        status: "available",
      },
      {
        id: "2",
        vendorId: "v-lensa",
        vendorName: "Lensa Teduh Photo",
        serviceName: "Sehari Penuh",
        unitPriceIdr: 15000000,
        quantity: 1,
        status: "available",
      },
      {
        id: "3",
        vendorId: "v-luma",
        vendorName: "Luma Dekor",
        serviceName: "Cypress",
        unitPriceIdr: 12000000,
        quantity: 1,
        status: "available",
      },
    ];

    const result = calculateBundleTotal(items);
    // 8jt + 15jt + 12jt = 35jt
    expect(result.subtotalIdr).toBe(35000000);
    // DP 30% = 10.5jt
    expect(result.dp30PercentIdr).toBe(10500000);
    // Remaining = 24.5jt
    expect(result.remainingIdr).toBe(24500000);
    expect(result.itemCount).toBe(3);
  });

  it("updates totals when quantity changes", () => {
    const items: BundleItem[] = [
      {
        id: "1",
        vendorId: "v-aru",
        vendorName: "Aru MUA",
        serviceName: "Paket Akad",
        unitPriceIdr: 8000000,
        quantity: 2,
        status: "available",
      },
    ];

    const result = calculateBundleTotal(items);
    expect(result.subtotalIdr).toBe(16000000);
    expect(result.dp30PercentIdr).toBe(4800000);
  });
});
