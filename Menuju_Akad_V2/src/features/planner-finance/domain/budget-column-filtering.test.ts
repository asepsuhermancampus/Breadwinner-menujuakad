import { expect, it } from "vitest";
import {
  countCustomerBudgetStatuses,
  filterCustomerBudgets,
  type BudgetFilters,
} from "./customer-budget";
const base: BudgetFilters = {
  status: "Semua",
  priority: "Semua",
  due: "Semua",
  category: "Semua",
  query: "",
};
const rows = [
  {
    id: "a",
    title: "A",
    amount: 500,
    category: "Katering",
    purpose: "DP 10",
    priority: "Rendah" as const,
    dueDate: "2026-12-02",
    notes: "Tanpa pedas",
  },
  {
    id: "b",
    title: "B",
    amount: 100,
    category: "Dekorasi",
    purpose: "DP 2",
    priority: "Tinggi" as const,
    dueDate: "2026-11-01",
    completed: true,
  },
  {
    id: "c",
    title: "C",
    amount: 300,
    category: "Katering",
    purpose: "Pelunasan",
    priority: "Normal" as const,
    notes: "",
  },
];
it("counts each status within the active category and column filters independently of selected status", () => {
  for (const status of ["Semua", "Belum tercapai", "Tercapai"] as const) {
    const filters = { ...base, category: "Katering", status };
    expect(countCustomerBudgetStatuses(rows, filters)).toMatchObject({
      total: 2,
      pending: 2,
      achieved: 0,
    });
    expect(countCustomerBudgetStatuses(rows, { ...filters, minAmount: "400" })).toMatchObject({
      total: 1,
      pending: 1,
      achieved: 0,
    });
    expect(countCustomerBudgetStatuses(rows, { ...filters, query: "missing" })).toMatchObject({
      total: 0,
      pending: 0,
      achieved: 0,
    });
  }
  expect(countCustomerBudgetStatuses(rows, base)).toMatchObject({
    total: 3,
    pending: 2,
    achieved: 1,
  });
});
it("combines column amount, purpose, notes and date-range filters", () => {
  expect(
    filterCustomerBudgets(rows, {
      ...base,
      minAmount: "200",
      maxAmount: "600",
      purpose: "dp",
      description: "pedas",
      dueFrom: "2026-12-01",
      dueTo: "2026-12-31",
    }).map((row) => row.id),
  ).toEqual(["a"]);
  expect(
    filterCustomerBudgets(rows, { ...base, notesPresence: "Tanpa catatan" }).map((row) => row.id),
  ).toEqual(["b", "c"]);
});
it("sorts column values in both directions without changing input or placing missing dates first", () => {
  expect(
    filterCustomerBudgets(rows, { ...base, sort: { key: "amount", direction: "asc" } }).map(
      (row) => row.id,
    ),
  ).toEqual(["b", "c", "a"]);
  expect(
    filterCustomerBudgets(rows, { ...base, sort: { key: "priority", direction: "desc" } }).map(
      (row) => row.id,
    ),
  ).toEqual(["b", "c", "a"]);
  expect(
    filterCustomerBudgets(rows, { ...base, sort: { key: "purpose", direction: "asc" } }).map(
      (row) => row.id,
    ),
  ).toEqual(["b", "a", "c"]);
  expect(
    filterCustomerBudgets(rows, { ...base, sort: { key: "dueDate", direction: "desc" } }).map(
      (row) => row.id,
    ),
  ).toEqual(["a", "b", "c"]);
  expect(rows.map((row) => row.id)).toEqual(["a", "b", "c"]);
});
