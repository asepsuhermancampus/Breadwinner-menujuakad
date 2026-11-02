import { describe, expect, it, vi } from "vitest";
import { resolveUserPlanTier } from "./tier";

vi.mock("server-only", () => ({}));

describe("resolveUserPlanTier", () => {
  it("defaults to free when user is null or undefined", () => {
    expect(resolveUserPlanTier(null)).toBe("free");
    expect(resolveUserPlanTier(undefined)).toBe("free");
  });

  it("handles user object safely and falls back to free on missing grants", () => {
    expect(resolveUserPlanTier({ id: "user-123" })).toBe("free");
    expect(resolveUserPlanTier({ id: "user-456", ownerKey: "owner-456" })).toBe("free");
  });
});

