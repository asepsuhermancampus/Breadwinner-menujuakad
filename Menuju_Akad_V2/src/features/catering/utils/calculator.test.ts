import { describe, expect, it } from "vitest";
import { calculateCatering, defaultCateringInput } from "./calculator";

describe("Catering calculator formula", () => {
  it("matches the exact canonical formula from Batch 02 specification", () => {
    // 500 undangan × 2 = 1.000 orang; buffer 10% = 1.100
    // Buffet 60% = 660 orang; 440 orang gubukan × 4 = 1.760 porsi
    // Total = 2.420 porsi
    const result = calculateCatering(defaultCateringInput);

    expect(result.totalBaseGuests).toBe(1000);
    expect(result.bufferPax).toBe(100);
    expect(result.totalWithBuffer).toBe(1100);
    expect(result.buffetPax).toBe(660);
    expect(result.stallPax).toBe(440);
    expect(result.stallPortionsTotal).toBe(1760);
    expect(result.totalPortions).toBe(2420);

    // Orang tidak sama dengan porsi
    expect(result.totalPortions).not.toBe(result.totalWithBuffer);
  });

  it("handles custom guest counts and buffer adjustments", () => {
    const custom = calculateCatering({
      invitations: 300,
      multiplier: 2,
      bufferPercent: 15,
      buffetPercent: 70,
      stallDishesCount: 3,
    });

    expect(custom.totalBaseGuests).toBe(600);
    expect(custom.bufferPax).toBe(90);
    expect(custom.totalWithBuffer).toBe(690);
    expect(custom.buffetPax).toBe(483);
    expect(custom.stallPax).toBe(207);
    expect(custom.stallPortionsTotal).toBe(621);
    expect(custom.totalPortions).toBe(1104);
  });
});
