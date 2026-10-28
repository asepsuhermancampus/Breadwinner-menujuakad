import { expect, it } from "vitest";
import { filterCustomerBudgets, type BudgetFilters } from "./customer-budget";
const base: BudgetFilters = { status: "Semua", priority: "Semua", due: "Semua", query: "" };
it("uses non-overlapping target ranges with exact boundaries and no invented zero amounts", () => {
  const rows = [
    undefined,
    0,
    499999,
    500000,
    999999,
    1000000,
    1499999,
    1500000,
    4999999,
    5000000,
    1e12,
  ].map((amount, index) => ({
    id: String(index),
    title: String(index),
    ...(amount === undefined ? {} : { amount }),
  }));
  for (const [amountRange, expected] of [
    ["under500k", [0, 499999]],
    ["500kTo1m", [500000, 999999]],
    ["1mTo1_5m", [1000000, 1499999]],
    ["1_5mTo5m", [1500000, 4999999]],
    ["from5m", [5000000, 1e12]],
  ] as const) {
    expect(filterCustomerBudgets(rows, { ...base, amountRange }).map((row) => row.amount)).toEqual(
      expected,
    );
  }
  expect(filterCustomerBudgets(rows, { ...base, amountRange: "Semua" })).toHaveLength(rows.length);
});
it("selects an exact saved purpose and separately handles missing purposes", () => {
  const rows = [
    { id: "a", title: "A", purpose: "DP" },
    { id: "b", title: "B", purpose: "DP gedung" },
    { id: "c", title: "C", purpose: "   " },
  ];
  expect(
    filterCustomerBudgets(rows, { ...base, purposeChoice: "DP" }).map((row) => row.id),
  ).toEqual(["a"]);
  expect(
    filterCustomerBudgets(rows, { ...base, purposePresence: "Tanpa tujuan" }).map((row) => row.id),
  ).toEqual(["c"]);
});
it("filters quick deadlines using Jakarta calendar days across month and year boundaries", () => {
  const rows = [
    "2026-12-30",
    "2026-12-31",
    "2027-01-01",
    "2027-01-07",
    "2027-01-08",
    "2027-01-30",
    "2027-01-31",
    undefined,
  ].map((dueDate, index) => ({
    id: String(index),
    title: String(index),
    ...(dueDate ? { dueDate } : {}),
  }));
  expect(
    filterCustomerBudgets(rows, { ...base, due: "Hari ini" }, "2026-12-31").map((row) => row.id),
  ).toEqual(["1"]);
  expect(
    filterCustomerBudgets(rows, { ...base, due: "7 hari ke depan" }, "2026-12-31").map(
      (row) => row.id,
    ),
  ).toEqual(["2", "3"]);
  expect(
    filterCustomerBudgets(rows, { ...base, due: "30 hari ke depan" }, "2026-12-31").map(
      (row) => row.id,
    ),
  ).toEqual(["2", "3", "4", "5"]);
  expect(
    filterCustomerBudgets(rows, { ...base, due: "Tanpa tenggat" }, "2026-12-31").map(
      (row) => row.id,
    ),
  ).toEqual(["7"]);
  expect(
    filterCustomerBudgets(
      [...rows, { id: "paid", title: "Paid", dueDate: "2026-12-30", completed: true }],
      { ...base, due: "Lewat tenggat" },
      "2026-12-31",
    ).map((row) => row.id),
  ).toEqual(["0"]);
});
