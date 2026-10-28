import { expect, it } from "vitest";
import { planningSchemas, planningTotal } from "./planning-resource";
import { cateringCost, cateringGuestSummary } from "./catering-menu";

it("keeps legacy menus and calculates mixed package pricing correctly", () => {
  const legacy = { id: "old", title: "Sate", portions: 100, unitCost: 10000 };
  const fixed = {
    id: "fixed",
    title: "Paket lengkap",
    portions: 500,
    unitCost: 20000000,
    mode: "package",
    pricing: "total",
    vendor: "Vendor A",
    includedMenus: "Nasi, ayam, es krim",
  } as const;
  const perGuest = { ...fixed, id: "guest", unitCost: 50000, pricing: "per-person" } as const;
  expect(planningSchemas.catering.parse(fixed)).toMatchObject(fixed);
  expect(cateringCost(legacy)).toBe(1000000);
  expect(cateringCost(fixed)).toBe(20000000);
  expect(cateringCost(perGuest)).toBe(25000000);
  expect(planningTotal("catering", [legacy, fixed, perGuest])).toBe(46000000);
});

it("rejects invalid pricing and negative or fractional quantities", () => {
  const item = {
    id: "1",
    title: "Paket",
    portions: 10,
    unitCost: 100,
    mode: "package",
    pricing: "total",
  };
  for (const patch of [
    { pricing: "invalid" },
    { portions: -1 },
    { portions: 1.5 },
    { unitCost: -1 },
  ]) {
    expect(planningSchemas.catering.safeParse({ ...item, ...patch }).success).toBe(false);
  }
});

it("uses invitation quotas rather than RSVP attendance and handles empty data", () => {
  expect(cateringGuestSummary(null)).toEqual({ invitations: 0, guests: 0 });
  expect(cateringGuestSummary([])).toEqual({ invitations: 0, guests: 0 });
  expect(
    cateringGuestSummary([
      { quota: 3, attendingCount: 1 },
      { quota: 2, attendingCount: 0 },
    ]),
  ).toEqual({ invitations: 2, guests: 5 });
  expect(cateringGuestSummary([{ quota: NaN }, { quota: -2 }, null, {}])).toEqual({
    invitations: 0,
    guests: 0,
  });
});
