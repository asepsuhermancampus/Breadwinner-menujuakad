import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { accountFixture } from "../fixtures/account";
import { createMockAccount } from "./mock-account";
import { DEMO_CODE } from "./mock-runtime";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

const noWait = async () => {};
const key = "ma-v2-account";
const profileInput = () => ({
  fullName: "Risa Pratiwi",
  email: "risa.pratiwi@gmail.com",
  phone: "+6281234567890",
  culture: "Jawa modern",
  expectedVersion: 1,
});

async function verify(adapter: ReturnType<typeof createMockAccount>) {
  const result = await adapter.verifyDeletion({ code: DEMO_CODE });
  if (!result.ok) throw new Error(result.message);
  return result.data.proof;
}

beforeEach(() => {
  vi.stubGlobal("localStorage", new MemoryStorage());
  vi.stubGlobal("sessionStorage", new MemoryStorage());
  vi.stubGlobal("navigator", { onLine: true });
});
afterEach(() => vi.unstubAllGlobals());

describe("mock account version and failure contracts", () => {
  it("rejects a stale tab without overwriting the latest stored profile", async () => {
    const first = createMockAccount(accountFixture, undefined, noWait);
    const stale = createMockAccount(accountFixture, undefined, noWait);
    expect((await first.saveProfile({ ...profileInput(), culture: "Sunda modern" })).ok).toBe(true);
    const stored = localStorage.getItem(key);
    const draft = { ...profileInput(), culture: "Draf lain" };
    expect(await stale.saveProfile(draft)).toMatchObject({ ok: false, code: "conflict" });
    expect(localStorage.getItem(key)).toBe(stored);
    expect(draft.culture).toBe("Draf lain");
  });

  it.each(["offline", "revoked", "conflict"] as const)("preserves drafts when %s", async (mode) => {
    sessionStorage.setItem("ma-v2-scenario", mode);
    const draft = { ...profileInput(), fullName: "Draf Risa" };
    const adapter = createMockAccount(accountFixture, undefined, noWait);
    expect(await adapter.saveProfile(draft)).toMatchObject({ ok: false, code: mode });
    expect(draft.fullName).toBe("Draf Risa");
    expect(localStorage.getItem(key)).toBeNull();
  });

  it("refuses corrupt persisted data instead of replacing it with a fixture", async () => {
    localStorage.setItem(key, "{");
    const adapter = createMockAccount(accountFixture, undefined, noWait);
    expect(await adapter.saveProfile(profileInput())).toMatchObject({
      ok: false,
      code: "unavailable",
    });
    expect(localStorage.getItem(key)).toBe("{");
  });

  it("validates profiles and rejects unknown or current device revocation", async () => {
    const adapter = createMockAccount(accountFixture, undefined, noWait);
    expect(await adapter.saveProfile({ ...profileInput(), email: "invalid" })).toMatchObject({
      ok: false,
      code: "invalid",
    });
    expect(await adapter.revokeSessions({ ids: ["unknown"] })).toMatchObject({
      ok: false,
      code: "invalid",
    });
    expect(await adapter.revokeSessions({ ids: ["session-current"] })).toMatchObject({
      ok: false,
      code: "invalid",
    });
    expect(localStorage.getItem(key)).toBeNull();
  });

  it("never grants Lifetime from an upgrade preview", async () => {
    const adapter = createMockAccount(accountFixture, undefined, noWait);
    await adapter.saveProfile(profileInput());
    const before = localStorage.getItem(key);
    expect((await adapter.requestPlanChange({ plan: "lifetime" })).ok).toBe(true);
    expect(localStorage.getItem(key)).toBe(before);
    expect(JSON.parse(before ?? "{}") as unknown).toMatchObject({
      entitlement: { plan: "premium" },
    });
    expect(accountFixture.entitlement.plan).toBe("premium");
  });
});

describe("fresh mock account deletion proof", () => {
  it("requires correct OTP and explicit acknowledgment", async () => {
    const adapter = createMockAccount(accountFixture, { now: () => 1000 }, noWait);
    expect(await adapter.verifyDeletion({ code: "000000" })).toMatchObject({
      ok: false,
      code: "invalid",
    });
    const proof = await verify(adapter);
    expect(
      await adapter.deleteAccount({ proof, confirmation: "HAPUS AKUN", acknowledged: false }),
    ).toMatchObject({ ok: false, code: "invalid" });
    expect(
      await adapter.deleteAccount({ proof, confirmation: "hapus", acknowledged: true }),
    ).toMatchObject({ ok: false, code: "invalid" });
  });

  it("expires exactly at the boundary and replaces older proofs", async () => {
    let time = 1000;
    const adapter = createMockAccount(accountFixture, { now: () => time }, noWait);
    const old = await verify(adapter);
    const current = await verify(adapter);
    expect(current).not.toBe(old);
    expect(
      await adapter.deleteAccount({ proof: old, confirmation: "HAPUS AKUN", acknowledged: true }),
    ).toMatchObject({ ok: false, code: "invalid" });
    time += 60_000;
    expect(
      await adapter.deleteAccount({
        proof: current,
        confirmation: "HAPUS AKUN",
        acknowledged: true,
      }),
    ).toMatchObject({ ok: false, code: "invalid" });
  });

  it("rechecks revocation after verification and before deletion", async () => {
    const adapter = createMockAccount(accountFixture, undefined, noWait);
    const proof = await verify(adapter);
    sessionStorage.setItem("ma-v2-scenario", "revoked");
    expect(
      await adapter.deleteAccount({ proof, confirmation: "HAPUS AKUN", acknowledged: true }),
    ).toMatchObject({ ok: false, code: "revoked" });
    expect(localStorage.getItem("ma-v2-account-deleted")).toBeNull();
  });

  it("uses proof once and cannot revive the mock account after refresh", async () => {
    const adapter = createMockAccount(accountFixture, undefined, noWait);
    const proof = await verify(adapter);
    const input = { proof, confirmation: "HAPUS AKUN", acknowledged: true };
    expect(await adapter.deleteAccount(input)).toMatchObject({ ok: true, data: { deleted: true } });
    expect((await adapter.deleteAccount(input)).ok).toBe(false);
    const refreshed = createMockAccount(accountFixture, undefined, noWait);
    expect(await refreshed.saveProfile(profileInput())).toMatchObject({
      ok: false,
      code: "revoked",
    });
    expect(localStorage.getItem("ma-v2-account-deleted")).toBe("true");
  });
});
