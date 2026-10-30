import { expect, it } from "vitest";
import { createTrialStore } from "./trial-store";
import type { FinanceBook } from "@/features/planner-finance/types/finance-ledger";

it("retains hidden linked expenses while changing other trial budgets", async () => {
  const data = new Map<string, string>();
  const store = createTrialStore({
    storage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        data.set(key, value);
      },
    },
    lock: async (run: () => Promise<unknown>) => run(),
    restrictedExpenseSources: async () => ["seserahan"],
  } as never);
  expect(
    (
      await store.commit(
        "seserahan",
        [{ id: "gift", title: "Hadiah pribadi", quantity: 1, unitCost: 100 }],
        0,
      )
    ).ok,
  ).toBe(true);
  const revision = (store.read().resources.savings?.[0] as FinanceBook | undefined)?.revision ?? 0;
  const request = {
    revision,
    requestId: "edit-visible",
    command: {
      type: "save-budgets" as const,
      budgets: [{ id: "manual", title: "Gedung", amount: 200 }],
    },
  };
  expect((await store.finance(request)).ok).toBe(true);
  expect((await store.finance(request)).ok).toBe(true);
  expect(store.read().resources.finance).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: "Hadiah pribadi" }),
      expect.objectContaining({ title: "Gedung" }),
    ]),
  );
  const current = store.read();
  const visible = [{ id: "manual", title: "Gedung baru", amount: 200 }];
  expect((await store.commit("finance", visible, current.revision)).ok).toBe(true);
  expect(store.read().resources.finance).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ title: "Hadiah pribadi" }),
      expect.objectContaining({ title: "Gedung baru" }),
    ]),
  );
});

it("accepts an already completed trial request after its source is restricted", async () => {
  const data = new Map<string, string>();
  let restricted = false;
  const store = createTrialStore({
    storage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        data.set(key, value);
      },
    },
    lock: async (run: () => Promise<unknown>) => run(),
    restrictedExpenseSources: async () => (restricted ? ["seserahan"] : []),
  } as never);
  expect(
    (
      await store.commit(
        "seserahan",
        [{ id: "gift", title: "Hadiah", quantity: 1, unitCost: 100 }],
        0,
      )
    ).ok,
  ).toBe(true);
  const request = {
    revision: 0,
    requestId: "retry-before-restrict",
    command: { type: "save-budgets" as const, budgets: store.read().resources.finance as never },
  };
  expect((await store.finance(request)).ok).toBe(true);
  restricted = true;
  const before = store.read();
  expect((await store.finance(request)).ok).toBe(true);
  expect(store.read()).toEqual(before);
});
