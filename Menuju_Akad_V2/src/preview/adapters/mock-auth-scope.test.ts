import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthResult } from "@/features/auth/types/auth-contracts";
import { createMockAuth } from "./mock-auth";
import { DEMO_CODE } from "./mock-runtime";

const immediate = async () => {};
function value<T>(result: AuthResult<T>): T {
  if (!result.ok) throw new Error(`Unexpected preview failure: ${result.code}`);
  return result.data;
}
beforeEach(() => {
  vi.stubGlobal("navigator", { onLine: true });
  vi.stubGlobal("sessionStorage", { getItem: () => null });
});
afterEach(() => vi.unstubAllGlobals());

describe("mock auth scope", () => {
  it.each([
    { method: "email", identifier: "risa@example.com", allowed: "password", denied: "pin" },
    { method: "phone", identifier: "+6281234567890", allowed: "pin", denied: "password" },
  ] as const)(
    "binds a $method recovery grant to its credential kind",
    async ({ method, identifier, allowed, denied }) => {
      const adapter = createMockAuth({ now: () => 0 }, immediate);
      const current = value(await adapter.recover({ method, identifier }));
      expect(current.channel).toBe(method);
      const grant = value(await adapter.verify({ challengeId: current.id, code: DEMO_CODE }));
      if (grant.kind !== "recovery") throw new Error("Expected a recovery grant.");
      const secret = (kind: "password" | "pin") => (kind === "password" ? "Rahasia123" : "123456");
      expect(
        await adapter.reset({
          recoveryToken: grant.recoveryToken,
          kind: denied,
          secret: secret(denied),
        }),
      ).toEqual({ ok: false, code: "invalid" });
      expect(
        await adapter.reset({
          recoveryToken: grant.recoveryToken,
          kind: allowed,
          secret: secret(allowed),
        }),
      ).toEqual({ ok: true, data: { updated: true } });
    },
  );
  it("does not alter stored roles, membership, or plan when OTP authenticates", async () => {
    const original = JSON.stringify({
      memberships: [{ id: "couple", role: "pasangan" }],
      entitlement: { tier: "premium" },
    });
    const storage = new Map([["ma-v2-account", original]]);
    const setItem = vi.fn((key: string, content: string) => storage.set(key, content));
    vi.stubGlobal("localStorage", { getItem: (key: string) => storage.get(key) ?? null, setItem });
    const adapter = createMockAuth({ now: () => 0 }, immediate);
    const current = value(
      await adapter.login({
        method: "email",
        identifier: "risa@example.com",
        secret: "Rahasia123",
        remember: true,
      }),
    );
    const verified = value(await adapter.verify({ challengeId: current.id, code: DEMO_CODE }));
    expect(verified.kind).toBe("authenticated");
    expect(storage.get("ma-v2-account")).toBe(original);
    expect(setItem).not.toHaveBeenCalled();
    expect(verified).not.toHaveProperty("memberships");
    expect(verified).not.toHaveProperty("entitlement");
  });
  it("rejects invalid identifiers and registration without creating a challenge", async () => {
    const adapter = createMockAuth({ now: () => 0 }, immediate);
    expect(
      await adapter.login({ method: "email", identifier: "risa", secret: "", remember: false }),
    ).toEqual({ ok: false, code: "invalid" });
    expect(await adapter.recover({ method: "phone", identifier: "123" })).toEqual({
      ok: false,
      code: "invalid",
    });
    expect(
      await adapter.register({
        name: "",
        email: "risa@example.com",
        password: "short",
        acceptTerms: true,
      }),
    ).toEqual({ ok: false, code: "invalid" });
    expect(await adapter.verify({ challengeId: "mock-challenge-1", code: DEMO_CODE })).toEqual({
      ok: false,
      code: "revoked",
    });
  });
  it("does not allow resending to bypass a challenge attempt limit", async () => {
    let now = 0;
    const adapter = createMockAuth({ now: () => now }, immediate);
    const current = value(
      await adapter.recover({ method: "email", identifier: "risa@example.com" }),
    );
    for (let attempt = 0; attempt < 5; attempt++)
      await adapter.verify({ challengeId: current.id, code: "000000" });
    now = current.resendAt;
    expect(await adapter.resend(current.id)).toEqual({
      ok: false,
      code: "rate-limit",
      retryAt: current.expiresAt,
    });
  });
});
