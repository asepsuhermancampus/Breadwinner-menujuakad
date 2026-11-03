import { describe, it, expect } from "vitest";
import { buildCateringDonutSlices } from "./overview-catering-slices";

describe("buildCateringDonutSlices", () => {
  it("calculates catering ratio and portions slices accurately", () => {
    const { ratioSlices, portionsSlices, result } = buildCateringDonutSlices({
      invitations: 200,
      multiplier: 2,
      bufferPercent: 10,
      buffetPercent: 60,
      stallDishesCount: 4,
    });

    // 200 * 2 = 400 guests + 10% buffer = 440 guests total
    expect(result.totalWithBuffer).toBe(440);
    // 60% buffet = 264 pax
    expect(result.buffetPax).toBe(264);
    // 40% stall = 176 pax * 4 stalls = 704 portions
    expect(result.stallPax).toBe(176);
    expect(result.stallPortionsTotal).toBe(704);
    // total portions = 264 + 704 = 968
    expect(result.totalPortions).toBe(968);

    expect(ratioSlices).toHaveLength(2);
    expect(portionsSlices).toHaveLength(2);
  });
});

