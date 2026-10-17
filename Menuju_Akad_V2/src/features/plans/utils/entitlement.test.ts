import { describe, expect, it } from "vitest";
import { daysUntilPlanExpiry, entitlementLabel } from "./entitlement";

describe("plan entitlement", () => {
  it("uses the injected clock and Jakarta calendar days", () => {
    expect(daysUntilPlanExpiry("2026-11-30T23:59:59+07:00", "2026-10-25T09:00:00+07:00")).toBe(36);
    expect(daysUntilPlanExpiry("2026-10-24T23:59:59+07:00", "2026-10-25T09:00:00+07:00")).toBe(0);
  });

  it("keeps Premium as the actual entitlement while Lifetime is only offered", () => {
    expect(entitlementLabel({ plan: "premium", expiresAt: "2026-11-30" })).toBe("Premium");
    expect(daysUntilPlanExpiry(null, "2026-10-25")).toBeNull();
  });
});
