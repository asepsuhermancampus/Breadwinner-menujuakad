import { DatabaseSync } from "node:sqlite";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getEffectivePlanPrice,
  initializePlanPricing,
  readPlanPricing,
  readPlanPricingAudit,
  updatePlanPrice,
} from "./plan-pricing-settings";

describe("plan-pricing-settings", () => {
  it("initializes tables and returns default catalog prices", () => {
    const db = new DatabaseSync(":memory:");
    initializePlanPricing(db);

    const prices = readPlanPricing(db);
    expect(prices).toHaveLength(3);

    const free = prices.find((p) => p.planId === "free");
    expect(free?.amount).toBe(0);
    expect(free?.isCustom).toBe(false);

    const premium = prices.find((p) => p.planId === "premium");
    expect(premium?.amount).toBe(149000);
    expect(premium?.defaultAmount).toBe(149000);
    expect(premium?.isCustom).toBe(false);

    const lifetime = prices.find((p) => p.planId === "lifetime");
    expect(lifetime?.amount).toBe(399000);
    expect(lifetime?.defaultAmount).toBe(399000);
    expect(lifetime?.isCustom).toBe(false);

    expect(getEffectivePlanPrice(db, "premium")).toBe(149000);
    expect(getEffectivePlanPrice(db, "lifetime")).toBe(399000);
    expect(getEffectivePlanPrice(db, "free")).toBe(0);
  });

  it("updates plan price and logs to audit with concurrency check", () => {
    const db = new DatabaseSync(":memory:");
    initializePlanPricing(db);

    // Initial version is 0
    const result = updatePlanPrice(
      db,
      "admin@menujuakad.id",
      "premium",
      179000,
      "Promo kuartal baru",
      0,
    );
    expect(result.planId).toBe("premium");
    expect(result.amount).toBe(179000);
    expect(result.version).toBe(1);

    expect(getEffectivePlanPrice(db, "premium")).toBe(179000);
    expect(getEffectivePlanPrice(db, "lifetime")).toBe(399000);

    const updatedList = readPlanPricing(db);
    const updatedPrem = updatedList.find((p) => p.planId === "premium");
    expect(updatedPrem?.amount).toBe(179000);
    expect(updatedPrem?.isCustom).toBe(true);
    expect(updatedPrem?.version).toBe(1);

    const audit = readPlanPricingAudit(db);
    expect(audit).toHaveLength(1);
    expect(audit[0]?.planId).toBe("premium");
    expect(audit[0]?.actor).toBe("admin@menujuakad.id");
    expect(audit[0]?.oldAmount).toBe(149000);
    expect(audit[0]?.newAmount).toBe(179000);
    expect(audit[0]?.reason).toBe("Promo kuartal baru");

    // Concurrency conflict test: passing old version 0 should throw
    expect(() =>
      updatePlanPrice(db, "admin@menujuakad.id", "premium", 199000, "Conflict test", 0),
    ).toThrow(/telah berubah/);

    // Same price validation
    expect(() =>
      updatePlanPrice(db, "admin@menujuakad.id", "premium", 179000, "Sama saja", 1),
    ).toThrow(/sama dengan harga/);
  });

  it("rejects invalid amounts or invalid reasons", () => {
    const db = new DatabaseSync(":memory:");
    initializePlanPricing(db);

    expect(() =>
      updatePlanPrice(db, "admin@test.com", "premium", 500, "Too low", 0),
    ).toThrow();
    expect(() =>
      updatePlanPrice(db, "admin@test.com", "free" as "premium", 100000, "Cannot change free", 0),
    ).toThrow();
    expect(() =>
      updatePlanPrice(db, "admin@test.com", "premium", 200000, "no", 0),
    ).toThrow();
  });
});
