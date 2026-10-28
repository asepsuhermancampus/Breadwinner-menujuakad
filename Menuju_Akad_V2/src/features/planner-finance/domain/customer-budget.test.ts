import { describe, expect, it } from "vitest";
import type { CustomerBudget } from "../types/customer-budget";
import {
  buildCustomerBudget,
  createBudgetDraft,
  filterCustomerBudgets,
  jakartaToday,
  summarizeBudgets,
  type BudgetFilters,
} from "./customer-budget";

const items: CustomerBudget[] = [
  { id: "old", title: "Gedung", amount: 1000000, notes: "Dekat rumah" },
  {
    id: "due",
    title: "Katering",
    amount: 2000000,
    purpose: "DP katering",
    priority: "Tinggi",
    dueDate: "2026-10-25",
  },
  {
    id: "ready",
    title: "Busana",
    amount: 500000,
    completed: true,
    priority: "Rendah",
    dueDate: "2026-10-20",
  },
  { id: "future", title: "Dekorasi", amount: 750000, priority: "Tinggi", dueDate: "2026-10-26" },
];
const all: BudgetFilters = { status: "Semua", priority: "Semua", due: "Semua", query: "" };

describe("customer funding targets", () => {
  it("filters by category while classifying older budgets as Lainnya", () => {
    const categorized = [{ ...items[0]!, category: "Katering" }, items[1]!];
    expect(filterCustomerBudgets(categorized, { ...all, category: "Katering" })).toEqual([
      categorized[0],
    ]);
    expect(filterCustomerBudgets(categorized, { ...all, category: "Lainnya" })).toEqual([
      categorized[1],
    ]);
    expect(
      buildCustomerBudget({ ...createBudgetDraft(items[0]), category: "Dekorasi" }, items[0], {
        id: "ignored",
        createdAt: "2026-10-28T00:00:00Z",
      }),
    ).toMatchObject({ category: "Dekorasi" });
  });
  it("combines status, priority, due date and text search without treating collected funds as overdue", () => {
    expect(
      filterCustomerBudgets(
        items,
        { ...all, status: "Belum tercapai", priority: "Tinggi", due: "Lewat tenggat", query: "dp" },
        "2026-10-26",
      ).map((item) => item.id),
    ).toEqual(["due"]);
    expect(
      filterCustomerBudgets(
        items,
        { ...all, status: "Tercapai", due: "Lewat tenggat" },
        "2026-10-26",
      ),
    ).toEqual([]);
    expect(
      filterCustomerBudgets(items, { ...all, due: "Mendatang" }, "2026-10-26").map(
        (item) => item.id,
      ),
    ).toEqual(["future"]);
  });

  it("handles legacy rows as normal-priority pending targets with no fabricated dates", () => {
    expect(
      filterCustomerBudgets(
        items,
        { ...all, priority: "Normal", due: "Tanpa tenggat", query: "RUMAH" },
        "2026-10-26",
      ),
    ).toEqual([items[0]]);
    expect(summarizeBudgets(items)).toEqual({
      totalTarget: 4250000,
      pendingTarget: 3750000,
      total: 4,
      achieved: 1,
      pending: 3,
    });
  });

  it("uses the Jakarta day for due filters around the UTC day boundary", () => {
    expect(jakartaToday(new Date("2026-10-25T18:00:00Z"))).toBe("2026-10-26");
  });

  it("duplicates as a fresh unachieved draft without changing or copying the original identity", () => {
    const original: CustomerBudget = {
      ...items[2]!,
      createdAt: "2026-09-01T00:00:00Z",
      notes: "Detail dana",
      purpose: "Busana akad",
    };
    const snapshot = structuredClone(original);
    const draft = createBudgetDraft(original, true);
    expect(draft.title).toBe("Salinan Busana");
    expect(draft.completed).toBe(false);
    const copy = buildCustomerBudget(draft, undefined, {
      id: "new",
      createdAt: "2026-10-26T03:00:00Z",
    });
    expect(copy).toMatchObject({
      id: "new",
      createdAt: "2026-10-26T03:00:00Z",
      notes: "Detail dana",
      purpose: "Busana akad",
      amount: 500000,
      completed: false,
    });
    expect(original).toEqual(snapshot);
  });

  it("keeps original creation metadata on edit and can remove an optional due date", () => {
    const original: CustomerBudget = { ...items[1]!, createdAt: "2026-09-01T00:00:00Z" };
    const draft = { ...createBudgetDraft(original), dueDate: "", completed: true };
    const edited = buildCustomerBudget(draft, original, {
      id: "ignored",
      createdAt: "2026-10-26T03:00:00Z",
    });
    expect(edited.id).toBe(original.id);
    expect(edited.createdAt).toBe(original.createdAt);
    expect(edited).not.toHaveProperty("dueDate");
    expect(edited.completed).toBe(true);
    expect(
      buildCustomerBudget(createBudgetDraft(items[0]), items[0], {
        id: "ignored",
        createdAt: "2026-10-26T03:00:00Z",
      }),
    ).not.toHaveProperty("createdAt");
  });

  it.each(["", "-1", "1.5", "Infinity", "1000000000001"])(
    "rejects invalid target %j before a save",
    (amount) => {
      expect(() =>
        buildCustomerBudget({ ...createBudgetDraft(items[0]), amount }, undefined, {
          id: "new",
          createdAt: "2026-10-26T03:00:00Z",
        }),
      ).toThrow();
    },
  );

  it("rejects an impossible due date and an empty name", () => {
    const identity = { id: "new", createdAt: "2026-10-26T03:00:00Z" };
    expect(() =>
      buildCustomerBudget(
        { ...createBudgetDraft(items[0]), dueDate: "2026-02-30" },
        undefined,
        identity,
      ),
    ).toThrow();
    expect(() =>
      buildCustomerBudget({ ...createBudgetDraft(items[0]), title: " " }, undefined, identity),
    ).toThrow();
  });
});
