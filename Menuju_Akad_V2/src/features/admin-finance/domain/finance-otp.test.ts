import { describe, expect, it } from "vitest";
import { createFinanceContext, createFinanceState } from "../content/finance-content";
import { requestFinanceOtp, verifyFinanceOtp } from "./finance-settings";

const context = { ...createFinanceContext("superadmin"), now: () => 100_000 };
describe("scoped financial OTP challenge", () => {
  it("rejects static mock code without a requested challenge", () => {
    const state = createFinanceState();
    expect(verifyFinanceOtp(state, "882016", context)).toMatchObject({ ok: false, state });
  });
  it("checks challenge actor, expiry, permissions, and consumes the challenge once", () => {
    const requested = requestFinanceOtp(createFinanceState(), context).state;
    expect(verifyFinanceOtp(requested, "882016", { ...context, actorId: "other-actor" }).ok).toBe(
      false,
    );
    expect(verifyFinanceOtp(requested, "882016", { ...context, now: () => 400_001 }).ok).toBe(
      false,
    );
    expect(
      verifyFinanceOtp(requested, "882016", {
        ...context,
        permissions: { ...context.permissions, settings: false },
      }).ok,
    ).toBe(false);
    expect(verifyFinanceOtp(requested, "111111", context).state).toBe(requested);
    const verified = verifyFinanceOtp(requested, "882016", context);
    expect(verified.ok).toBe(true);
    expect(verified.state.config.version).toBe(17);
    expect(verifyFinanceOtp(verified.state, "882016", context).ok).toBe(false);
  });
  it("attributes runtime scope to the actual shell operator", () => {
    expect(createFinanceContext("superadmin").actorId).toBe("nadia-permata");
    expect(createFinanceContext("finance").actorId).toBe("raka-finance");
    expect(createFinanceContext("support").actorId).toBe("farah-support");
  });
});
