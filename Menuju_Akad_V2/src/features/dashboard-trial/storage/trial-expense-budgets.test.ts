import { expect, it } from "vitest";
import { createTrialStore, TRIAL_KEY } from "./trial-store";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { FinanceBook, FinanceCommand } from "@/features/planner-finance/types/finance-ledger";
function setup() {
  const data = new Map<string, string>();
  const store = createTrialStore({
    storage: {
      getItem: (key) => data.get(key) ?? null,
      setItem: (key, value) => {
        data.set(key, value);
      },
    },
    lock: async (run) => run(),
  });
  let counter = 0;
  const run = (command: FinanceCommand) =>
    store.finance({
      revision: (store.read().resources.savings?.[0] as FinanceBook | undefined)?.revision ?? 0,
      requestId: `t-${++counter}`,
      command,
    });
  return { store, data, run };
}
const menu = {
  id: "menu",
  title: "Paket",
  portions: 20,
  unitCost: 10000,
  mode: "package",
  pricing: "total",
};
it("atomically links trial catering and uses only the catering trial quota", async () => {
  const { store, run } = setup();
  expect((await store.commit("catering", [menu], 0)).ok).toBe(true);
  const budget = store.read().resources.finance?.[0] as CustomerBudget;
  expect(budget).toMatchObject({
    amount: 10000,
    category: "Katering",
    source: { kind: "catering", id: "menu" },
  });
  expect(store.read().used).toEqual({ catering: 1 });
  await run({ type: "claim", side: "groom" });
  await run({
    type: "entry",
    side: "groom",
    direction: "add",
    amount: 10000,
    source: "Gaji",
    notes: "",
  });
  expect((await run({ type: "allocate", budgetId: budget.id, side: "groom" })).ok).toBe(true);
  const before = store.read();
  expect((await store.commit("catering", [{ ...menu, unitCost: 20000 }], before.revision)).ok).toBe(
    false,
  );
  expect(store.read()).toEqual(before);
  await run({ type: "release", budgetId: budget.id });
  expect((await store.commit("catering", [], store.read().revision)).ok).toBe(true);
  expect(store.read().resources.finance).toEqual([]);
});
it("backfills older trial expenses without duplicating them or using an extra action", () => {
  const { store, data } = setup();
  data.set(
    TRIAL_KEY,
    JSON.stringify({
      version: 2,
      revision: 1,
      used: { catering: 1 },
      resources: { catering: [menu] },
    }),
  );
  expect(store.read().resources.finance).toHaveLength(1);
  expect(store.read().resources.finance).toEqual(store.read().resources.finance);
  expect(store.read().used).toEqual({ catering: 1 });
});
it("removes legacy linked items without a savings side and does not recreate them on read", async () => {
  const { store, data, run } = setup();
  data.set(
    TRIAL_KEY,
    JSON.stringify({ version: 2, revision: 1, used: {}, resources: { catering: [menu] } }),
  );
  const budget = (store.read().resources.finance as CustomerBudget[])[0]!;
  expect((await run({ type: "delete-budget", budgetId: budget.id })).ok).toBe(true);
  expect(store.read().resources.finance).toEqual([]);
  expect(store.read().resources.catering).toEqual([]);
});
it("refunds funded linked trial items once when deleting", async () => {
  const { store, run } = setup();
  await store.commit("catering", [menu], store.read().revision);
  const budget = (store.read().resources.finance as CustomerBudget[])[0]!;
  await run({ type: "claim", side: "groom" });
  await run({
    type: "entry",
    side: "groom",
    direction: "add",
    amount: 50000,
    source: "Gaji",
    notes: "",
  });
  await run({ type: "allocate", budgetId: budget.id, side: "groom" });
  expect((await run({ type: "delete-budget", budgetId: budget.id })).ok).toBe(true);
  const book = store.read().resources.savings![0] as FinanceBook;
  expect(book.entries.reduce((total, item) => total + item.amount, 0)).toBe(50000);
  expect(book.allocations).toEqual([]);
  expect(book.entries.filter((item) => item.kind === "reversal")).toHaveLength(1);
  expect(store.read().resources.catering).toEqual([]);
});
