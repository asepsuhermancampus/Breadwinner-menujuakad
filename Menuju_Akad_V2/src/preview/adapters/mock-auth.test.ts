import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthAdapter, AuthResult, OtpChallenge } from "@/features/auth/types/auth-contracts";
import { createMockAuth } from "./mock-auth";
import { DEMO_CODE } from "./mock-runtime";

const login = {
  method: "email",
  identifier: "risa@example.com",
  secret: "Rahasia123",
  remember: false,
} as const;
const immediate = async () => {};
function value<T>(result: AuthResult<T>): T {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error("Expected a successful preview operation.");
  return result.data;
}
async function challenge(adapter: AuthAdapter): Promise<OtpChallenge> {
  return value(await adapter.login(login));
}

beforeEach(() => {
  vi.stubGlobal("navigator", { onLine: true });
  vi.stubGlobal("sessionStorage", { getItem: () => null });
});
afterEach(() => vi.unstubAllGlobals());

describe("mock authentication capability lifecycle", () => {
  it("enforces injected-clock cooldown and invalidates the old challenge on resend", async () => {
    let now = 1_000;
    const adapter = createMockAuth({ now: () => now }, immediate);
    const first = await challenge(adapter);
    expect(await adapter.resend(first.id)).toEqual({
      ok: false,
      code: "rate-limit",
      retryAt: 46_000,
    });
    now = first.resendAt;
    const replacement = value(await adapter.resend(first.id));
    expect(replacement.id).not.toBe(first.id);
    expect(replacement.expiresAt).toBe(now + 300_000);
    expect(await adapter.verify({ challengeId: first.id, code: DEMO_CODE })).toEqual({
      ok: false,
      code: "revoked",
    });
    expect(value(await adapter.verify({ challengeId: replacement.id, code: DEMO_CODE })).kind).toBe(
      "authenticated",
    );
  });
  it("rejects expired and already consumed challenges", async () => {
    let now = 0;
    const adapter = createMockAuth({ now: () => now }, immediate);
    const expired = await challenge(adapter);
    now = expired.expiresAt;
    expect(await adapter.verify({ challengeId: expired.id, code: DEMO_CODE })).toEqual({
      ok: false,
      code: "expired",
    });
    const active = await challenge(adapter);
    value(await adapter.verify({ challengeId: active.id, code: DEMO_CODE }));
    expect(await adapter.verify({ challengeId: active.id, code: DEMO_CODE })).toEqual({
      ok: false,
      code: "revoked",
    });
  });
  it("returns wrong-code then a rate limit without authenticating", async () => {
    const adapter = createMockAuth({ now: () => 1_000 }, immediate);
    const current = await challenge(adapter);
    for (let attempt = 0; attempt < 5; attempt++) {
      expect(await adapter.verify({ challengeId: current.id, code: "000000" })).toEqual({
        ok: false,
        code: "wrong-code",
      });
    }
    expect(await adapter.verify({ challengeId: current.id, code: DEMO_CODE })).toEqual({
      ok: false,
      code: "rate-limit",
      retryAt: current.expiresAt,
    });
  });
  it("keeps recovery responses generic for different identifiers and requires a grant", async () => {
    const adapter = createMockAuth({ now: () => 0 }, immediate);
    const known = value(await adapter.recover({ method: "email", identifier: "risa@example.com" }));
    const unknown = value(
      await adapter.recover({ method: "email", identifier: "unknown@example.com" }),
    );
    expect(known.destination).toBe(unknown.destination);
    expect(known.purpose).toBe("recovery");
    expect(known.destination).not.toContain("risa");
    expect(
      await adapter.reset({ recoveryToken: "unverified", kind: "password", secret: "Rahasia123" }),
    ).toEqual({ ok: false, code: "expired" });
    const verified = value(await adapter.verify({ challengeId: known.id, code: DEMO_CODE }));
    expect(verified.kind).toBe("recovery");
  });
  it("validates resets and consumes verified recovery grants exactly once", async () => {
    const adapter = createMockAuth({ now: () => 0 }, immediate);
    const current = value(
      await adapter.recover({ method: "email", identifier: "risa@example.com" }),
    );
    const grant = value(await adapter.verify({ challengeId: current.id, code: DEMO_CODE }));
    if (grant.kind !== "recovery") throw new Error("Expected a recovery grant.");
    expect(
      await adapter.reset({
        recoveryToken: grant.recoveryToken,
        kind: "password",
        secret: "short",
      }),
    ).toEqual({ ok: false, code: "invalid" });
    expect(
      value(
        await adapter.reset({
          recoveryToken: grant.recoveryToken,
          kind: "password",
          secret: "Rahasia123",
        }),
      ),
    ).toEqual({ updated: true });
    expect(
      await adapter.reset({
        recoveryToken: grant.recoveryToken,
        kind: "password",
        secret: "Rahasia456",
      }),
    ).toEqual({ ok: false, code: "expired" });
  });
  it("expires verified grants using the adapter clock", async () => {
    let now = 0;
    const adapter = createMockAuth({ now: () => now }, immediate);
    const current = value(await adapter.recover({ method: "phone", identifier: "+6281234567890" }));
    const grant = value(await adapter.verify({ challengeId: current.id, code: DEMO_CODE }));
    if (grant.kind !== "recovery") throw new Error("Expected a recovery grant.");
    now += 300_000;
    expect(
      await adapter.reset({ recoveryToken: grant.recoveryToken, kind: "pin", secret: "123456" }),
    ).toEqual({ ok: false, code: "expired" });
  });
  it("keeps an unavailable operation from creating a usable challenge", async () => {
    vi.stubGlobal("navigator", { onLine: false });
    const adapter = createMockAuth({ now: () => 0 }, immediate);
    expect(await adapter.login(login)).toEqual({ ok: false, code: "offline" });
    vi.stubGlobal("navigator", { onLine: true });
    expect(await adapter.verify({ challengeId: "mock-challenge-1", code: DEMO_CODE })).toEqual({
      ok: false,
      code: "revoked",
    });
  });
});
