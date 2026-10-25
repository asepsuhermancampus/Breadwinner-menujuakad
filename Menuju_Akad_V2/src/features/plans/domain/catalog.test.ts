import { describe, expect, it } from "vitest";
import { getPlan, pricePlan } from "./catalog";
import { capabilitiesFor } from "./capabilities";

describe("authoritative catalog", () => {
  it("prices both plans at five percent below the listed price", () => {
    expect(pricePlan("premium", true)).toEqual({
      originalAmount: 149000,
      discountAmount: 7450,
      amount: 141550,
    });
    expect(pricePlan("lifetime", true)).toEqual({
      originalAmount: 399000,
      discountAmount: 19950,
      amount: 379050,
    });
    expect(pricePlan("premium", false).amount).toBe(149000);
    expect(getPlan("free").originalAmount).toBe(0);
    expect(() => pricePlan("free" as "premium", true)).toThrow();
  });
  it("rejects unknown products and keeps capabilities cumulative", () => {
    expect(() => getPlan("evil" as "free")).toThrow();
    expect(capabilitiesFor("premium")).toContain("pdf");
    expect(capabilitiesFor("free")).not.toContain("studio");
    expect(capabilitiesFor("lifetime")).toEqual(
      expect.arrayContaining([...capabilitiesFor("premium")]),
    );
    expect(capabilitiesFor("lifetime")).toContain("custom-domain");
  });
});
