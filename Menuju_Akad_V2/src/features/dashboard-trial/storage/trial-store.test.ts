import { describe, expect, it } from "vitest";
import { createTrialStore, TRIAL_KEY } from "./trial-store";

function environment() {
  const values = new Map<string, string>();
  let queue = Promise.resolve();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
  const lock = <T>(run: () => Promise<T>): Promise<T> => {
    const result = queue.then(run);
    queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  };
  return { values, storage, lock };
}
const note = (id: string) => ({ id, title: id });
describe("guest trial storage", () => {
  it("allows editing legacy checked documents without adding new checks", async () => {
    const env = environment();
    const documents = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      title: "Old",
      completed: true,
    }));
    env.values.set(
      "menuju-akad:guest-trial:v1",
      JSON.stringify({ version: 1, revision: 0, used: 0, resources: { documents } }),
    );
    const store = createTrialStore(env);
    expect(
      (
        await store.commit(
          "documents",
          documents.map((d) => ({ ...d, title: "Edited" })),
          0,
        )
      ).ok,
    ).toBe(true);
  });
  it("counts five exports separately from resource saves", async () => {
    const store = createTrialStore(environment());
    for (let i = 0; i < 5; i++) expect((await store.consumeExport(i)).ok).toBe(true);
    expect(await store.consumeExport(5)).toMatchObject({ ok: false, reason: "limit" });
    expect((await store.commit("finance", [note("x")], 5)).ok).toBe(true);
  });
  it("limits each feature independently and preserves fifth on rejection", async () => {
    const env = environment(),
      store = createTrialStore(env);
    for (let n = 0; n < 5; n++)
      expect((await store.commit("finance", [note(String(n))], n)).ok).toBe(true);
    expect(await store.commit("finance", [note("six")], 5)).toMatchObject({
      ok: false,
      reason: "limit",
    });
    expect(
      (await store.commit("invitations", [{ id: "i", title: "a", template: "premium" }], 5)).ok,
    ).toBe(true);
    expect(store.read().used).toMatchObject({ finance: 5, invitations: 1 });
  });
  it("limits KUA active checks and permits unchecking and editing", async () => {
    const store = createTrialStore(environment());
    const notes = Array.from({ length: 6 }, (_, i) => ({ ...note(String(i)), completed: i < 5 }));
    expect((await store.commit("documents", notes, 0)).ok).toBe(true);
    expect(
      await store.commit(
        "documents",
        notes.map((n) => ({ ...n, completed: true })),
        1,
      ),
    ).toMatchObject({ ok: false, reason: "limit" });
    notes[0]!.completed = false;
    notes[5]!.completed = true;
    expect((await store.commit("documents", notes, 1)).ok).toBe(true);
  });
  it("migrates v1 without guessing per-feature usage or losing documents", async () => {
    const env = environment();
    env.values.set(
      "menuju-akad:guest-trial:v1",
      JSON.stringify({ version: 1, revision: 8, used: 8, resources: { documents: [note("old")] } }),
    );
    const store = createTrialStore(env);
    expect(store.read()).toMatchObject({
      version: 2,
      used: {},
      resources: { documents: [note("old")] },
    });
    expect((await store.commit("finance", [note("new")], 8)).ok).toBe(true);
    expect(env.values.get("menuju-akad:guest-trial:v1")).toContain('"version":1');
  });
  it("serializes tabs and rejects stale writes without spending quota", async () => {
    const env = environment(),
      a = createTrialStore(env),
      b = createTrialStore(env);
    for (let i = 0; i < 4; i++) await a.commit("finance", [note(String(i))], i);
    const results = await Promise.all([
      a.commit("finance", [note("a")], 4),
      b.commit("finance", [note("b")], 4),
    ]);
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect(a.read().used).toMatchObject({ finance: 5 });
  });
  it("does not count identical, invalid, publication or storage failures", async () => {
    const env = environment(),
      store = createTrialStore(env);
    expect(await store.commit("finance", [], 0)).toMatchObject({ ok: true, changed: false });
    expect(await store.commit("finance", [{}], 0)).toMatchObject({ ok: false, reason: "invalid" });
    expect(
      await store.commit(
        "invitations",
        [{ id: "a", title: "a", template: "basic", published: true }],
        0,
      ),
    ).toMatchObject({ ok: false, reason: "invalid" });
    const full = createTrialStore({
      ...env,
      storage: {
        ...env.storage,
        setItem() {
          throw Error("full");
        },
      },
    });
    expect(await full.commit("finance", [note("x")], 0)).toMatchObject({
      ok: false,
      reason: "storage",
    });
    expect(
      await createTrialStore({ ...env, lock: undefined }).commit("finance", [note("x")], 0),
    ).toMatchObject({ ok: false, reason: "storage" });
    expect(store.read().used).toEqual({});
  });
  it("does not silently reset malformed snapshots", async () => {
    const env = environment();
    env.values.set(TRIAL_KEY, '{"version":1,"used":-1}');
    const store = createTrialStore(env);
    expect(() => store.read()).toThrow();
    expect(await store.commit("documents", [note("x")], 0)).toMatchObject({
      ok: false,
      reason: "storage",
    });
    expect(env.storage.getItem(TRIAL_KEY)).toContain('"used":-1');
  });
});
