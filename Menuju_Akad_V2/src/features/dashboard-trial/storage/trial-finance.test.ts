import { describe, expect, it } from "vitest";
import { createTrialStore, TRIAL_KEY } from "./trial-store";
import {
  emptyFinanceBook,
  financeSnapshot,
} from "@/features/planner-finance/domain/finance-ledger";
import type { FinanceBook, FinanceCommand } from "@/features/planner-finance/types/finance-ledger";

function setup() {
  const data = new Map<string, string>();
  let fail = false;
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      if (fail) throw Error("Storage penuh");
      data.set(key, value);
    },
  };
  const store = createTrialStore({ storage, lock: async (run) => run() });
  let count = 0;
  const run = (command: FinanceCommand, requestId = `req-${++count}`) => {
    const book =
      (store.read().resources.savings?.[0] as FinanceBook | undefined) ?? emptyFinanceBook();
    return store.finance({ revision: book.revision, requestId, command });
  };
  return {
    store,
    data,
    run,
    setFail: (value: boolean) => {
      fail = value;
    },
  };
}

describe("atomic trial savings", () => {
  it("denies completion before ledger initialization and preserves legacy completion", async () => {
    const { store, data } = setup();
    const budget = { id: "b", title: "Gedung", amount: 50 };
    expect(await store.commit("finance", [{ ...budget, completed: true }], 0)).toMatchObject({
      ok: false,
      reason: "invalid",
    });
    expect(store.read().resources.finance ?? []).toEqual([]);
    expect((await store.commit("finance", [budget], 0)).ok).toBe(true);
    expect(await store.commit("finance", [{ ...budget, completed: true }], 1)).toMatchObject({
      ok: false,
      reason: "invalid",
    });
    expect(store.read().resources.savings).toBeUndefined();
    const legacy = store.read();
    legacy.resources.finance = [{ ...budget, completed: true }];
    data.set(TRIAL_KEY, JSON.stringify(legacy));
    expect(
      (
        await store.commit(
          "finance",
          [{ ...budget, completed: true, notes: "Legacy" }],
          legacy.revision,
        )
      ).ok,
    ).toBe(true);
  });
  it("allocates and releases funds atomically with independent manual/budget quotas", async () => {
    const { store, run } = setup();
    expect((await run({ type: "claim", side: "groom" })).ok).toBe(true);
    await run({
      type: "entry",
      side: "groom",
      direction: "add",
      amount: 3000000,
      source: "Gaji",
      notes: "",
    });
    await run({ type: "save-budgets", budgets: [{ id: "b", title: "Gedung", amount: 1000000 }] });
    await run({ type: "allocate", budgetId: "b", side: "groom" });
    let state = store.read();
    expect(state.resources.finance).toMatchObject([{ id: "b", completed: true }]);
    expect(
      financeSnapshot(state.resources.savings![0] as FinanceBook, [], "trial-customer").balances
        .groom,
    ).toBe(2000000);
    expect(state.used).toMatchObject({ savings: 1, finance: 2 });
    await run({ type: "release", budgetId: "b" });
    state = store.read();
    expect(state.resources.finance).toMatchObject([{ id: "b", completed: false }]);
    expect(
      (state.resources.savings![0] as FinanceBook).entries.map((entry) => entry.amount),
    ).toEqual([3000000, -1000000, 1000000]);
  });
  it("preserves all saved data if the one atomic storage write fails", async () => {
    const { run, data, setFail } = setup();
    await run({ type: "claim", side: "groom" });
    await run({
      type: "entry",
      side: "groom",
      direction: "add",
      amount: 100,
      source: "Gaji",
      notes: "",
    });
    await run({ type: "save-budgets", budgets: [{ id: "b", title: "B", amount: 50 }] });
    const saved = data.get(TRIAL_KEY);
    setFail(true);
    expect((await run({ type: "allocate", budgetId: "b", side: "groom" })).ok).toBe(false);
    expect(data.get(TRIAL_KEY)).toBe(saved);
  });
  it("denies direct ledger replacement and legacy bypass of a funded budget", async () => {
    const { run, store } = setup();
    await run({ type: "claim", side: "groom" });
    await run({
      type: "entry",
      side: "groom",
      direction: "add",
      amount: 100,
      source: "Gaji",
      notes: "",
    });
    await run({ type: "save-budgets", budgets: [{ id: "b", title: "B", amount: 50 }] });
    await run({ type: "allocate", budgetId: "b", side: "groom" });
    expect((await store.commit("finance", [], store.read().revision)).ok).toBe(false);
    expect((await store.commit("savings", [emptyFinanceBook()], store.read().revision)).ok).toBe(
      false,
    );
    const revision = (store.read().resources.savings![0] as FinanceBook).revision;
    expect(
      (
        await store.finance({
          revision: revision - 1,
          requestId: "stale",
          command: { type: "release", budgetId: "b" },
        })
      ).ok,
    ).toBe(false);
    expect(store.read().resources.finance).toMatchObject([{ id: "b", completed: true }]);
  });
  it("does not consume another attempt or debit twice for a retried request", async () => {
    const { run, store } = setup();
    await run({ type: "claim", side: "groom" });
    const command = {
      type: "entry",
      side: "groom",
      direction: "add",
      amount: 100,
      source: "Gaji",
      notes: "",
    } as const;
    await run(command, "repeat");
    const before = store.read();
    await run(command, "repeat");
    expect(store.read()).toEqual(before);
  });
});
