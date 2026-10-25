import { expect, it } from "vitest";
import { planningSchemas, planningTotal } from "./planning-resource";
it("validates dates, times and quantity and computes real totals", () => {
  expect(
    planningSchemas.calendar.safeParse({
      id: "1",
      title: "Acara",
      date: "2026-02-30",
      startTime: "09:00",
      endTime: "10:00",
    }).success,
  ).toBe(false);
  expect(
    planningSchemas.calendar.safeParse({
      id: "1",
      title: "Acara",
      date: "2026-12-01",
      startTime: "11:00",
      endTime: "10:00",
    }).success,
  ).toBe(false);
  expect(
    planningSchemas.catering.safeParse({ id: "1", title: "Menu", portions: -1, unitCost: 5000 })
      .success,
  ).toBe(false);
  expect(
    planningSchemas.seserahan.safeParse({ id: "1", title: "Barang", quantity: 1.5, unitCost: 5000 })
      .success,
  ).toBe(false);
  expect(
    planningTotal("catering", [{ id: "1", title: "Menu", portions: 20, unitCost: 5000 }]),
  ).toBe(100000);
});
