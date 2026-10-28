import { expect, it } from "vitest";
import { projectExpenseBudgets } from "./expense-budgets";
it("copies catering payment deadlines and keeps actual notes separate from generated source details", () => {
  const source = {
    id: "deadline",
    title: "Katering",
    portions: 20,
    unitCost: 10000,
    vendor: "Dapur",
    dueDate: "2026-12-01",
  };
  const row = projectExpenseBudgets([], { catering: [source] })[0]!;
  expect(row.dueDate).toBe("2026-12-01");
  expect(row.notes).toBe("");
  expect(row.sourceDetails).toContain("Dapur");
  expect(row.sourceDetails).toContain("Harga total: Rp 200.000");
  expect(
    projectExpenseBudgets([row], { catering: [{ ...source, dueDate: "" }] })[0]?.dueDate,
  ).toBeUndefined();
});
it("keeps manual/linked row ordering stable and preserves long source details and identifiers", () => {
  const item = {
    id: "a".repeat(160),
    title: "Paket lengkap",
    portions: 10,
    unitCost: 123456,
    mode: "package",
    pricing: "total",
    notes: "n".repeat(2000),
    includedMenus: "m".repeat(2000),
  };
  const sources = { catering: [item] };
  const linked = projectExpenseBudgets([], sources)[0]!;
  expect(linked.id.length).toBeLessThanOrEqual(200);
  expect(linked.amount).toBe(123456);
  expect(linked.notes).toContain(item.notes);
  expect(linked.sourceDetails).toContain(item.includedMenus);
  expect(linked.sourceDetails).toContain("Harga total: Rp 123.456");
  const mixed = [linked, { id: "manual", title: "Manual", amount: 500 }];
  expect(projectExpenseBudgets(mixed, sources)).toEqual(mixed);
});
it("calculates per-person packages separately and rejects impossible totals", () => {
  const pack = {
    id: "p",
    title: "Paket",
    portions: 20,
    unitCost: 50000,
    mode: "package",
    pricing: "per-person",
  };
  expect(projectExpenseBudgets([], { catering: [pack] })[0]?.amount).toBe(1000000);
  expect(() =>
    projectExpenseBudgets([], { catering: [{ ...pack, portions: 100000, unitCost: 1000000000 }] }),
  ).toThrow();
});
