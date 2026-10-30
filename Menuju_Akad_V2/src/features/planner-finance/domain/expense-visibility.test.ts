import { expect, it } from "vitest";
import { restrictFinanceSnapshot, mergeVisibleBudgets } from "./expense-visibility";

it("hides restricted source budgets and their history without changing real balances", () => {
  const hidden = "expense:seserahan:gift";
  const visible = "expense:catering:menu";
  const snapshot = {
    revision: 2,
    actorSide: null,
    members: [],
    budgets: [
      {
        id: hidden,
        title: "Sepatu rahasia",
        amount: 100,
        source: { kind: "seserahan", id: "gift" },
      },
      { id: visible, title: "Nasi", amount: 50, source: { kind: "catering", id: "menu" } },
    ],
    entries: [
      {
        id: "entry",
        side: "groom",
        amount: -100,
        kind: "allocation",
        source: "Anggaran",
        notes: "Sepatu rahasia",
        createdAt: "2026-01-01",
        actorId: "owner",
        actorName: "Owner",
        budgetId: hidden,
        reverses: null,
      },
    ],
    allocations: [{ budgetId: hidden, entryId: "entry", side: "groom", amount: 100 }],
    balances: { groom: 50, bride: 0, total: 50 },
  } as const;
  const result = restrictFinanceSnapshot(snapshot as never, ["seserahan"]);
  expect(result.budgets.map((row) => row.id)).toEqual([visible]);
  expect(result.entries).toEqual([]);
  expect(result.allocations).toEqual([]);
  expect(result.balances).toEqual(snapshot.balances);
  expect(result.hiddenActivity).toBe(true);
  expect(snapshot.budgets).toHaveLength(2);
});

it("retains hidden budgets while editing visible budgets and rejects changes to hidden ones", () => {
  const hidden = {
    id: "expense:seserahan:gift",
    title: "Sepatu",
    amount: 100,
    source: { kind: "seserahan", id: "gift" },
  } as const;
  const old = { id: "manual", title: "Gedung", amount: 200 };
  const changed = { ...old, title: "Gedung baru" };
  expect(mergeVisibleBudgets([hidden, old] as never, [changed], ["seserahan"])).toEqual([
    hidden,
    changed,
  ]);
  expect(() =>
    mergeVisibleBudgets([hidden, old] as never, [{ ...hidden, title: "Diubah" }] as never, [
      "seserahan",
    ]),
  ).toThrow(/tersedia/i);
});
it("rejects a visible row that collides with a legacy hidden budget id", () => {
  const hidden = {
    id: "legacy",
    title: "Rahasia",
    amount: 100,
    source: { kind: "seserahan", id: "gift" },
  };
  expect(() =>
    mergeVisibleBudgets(
      [hidden] as never,
      [{ id: "legacy", title: "Palsu", amount: 1 }],
      ["seserahan"],
    ),
  ).toThrow(/tersedia/i);
});
it("hides orphaned linked history when its original source cannot be determined", () => {
  const snapshot = {
    revision: 0,
    actorSide: null,
    members: [],
    budgets: [],
    allocations: [],
    balances: { groom: 0, bride: 0, total: 0 },
    entries: [
      {
        id: "old",
        side: "groom",
        amount: 100,
        kind: "reversal",
        source: "Anggaran",
        notes: "Nama lama",
        createdAt: "2026-01-01",
        actorId: "a",
        actorName: "A",
        budgetId: "legacy-id",
        reverses: "original",
      },
    ],
  };
  expect(restrictFinanceSnapshot(snapshot as never, ["seserahan"]).entries).toEqual([]);
  expect(restrictFinanceSnapshot(snapshot as never, []).entries).toHaveLength(1);
});
