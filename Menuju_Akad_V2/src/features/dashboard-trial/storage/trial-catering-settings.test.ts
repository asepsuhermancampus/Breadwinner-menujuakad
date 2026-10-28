import { expect, it } from "vitest";
import { createTrialStore } from "./trial-store";
it("restores saved calculation settings from a fresh trial store", async () => {
  const records = new Map<string, string>();
  const environment = {
    storage: {
      getItem: (key: string) => records.get(key) ?? null,
      setItem: (key: string, value: string) => {
        records.set(key, value);
      },
    },
    lock: async <T>(run: () => Promise<T>) => run(),
  };
  const store = createTrialStore(environment);
  const settings = {
    id: "catering-settings",
    invitations: 40,
    multiplier: 2,
    bufferPercent: 10,
    buffetPercent: 60,
    stallDishesCount: 4,
    useGuests: false,
  };
  expect((await store.commit("catering-settings", [settings], 0)).ok).toBe(true);
  expect(createTrialStore(environment).read().resources["catering-settings"]).toEqual([settings]);
});
