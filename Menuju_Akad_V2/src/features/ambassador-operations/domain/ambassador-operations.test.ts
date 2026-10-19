import { describe, expect, it } from "vitest";
import { createAmbassadorContext, createAmbassadorState } from "../content/ambassador-content";
import type { WithdrawalInput } from "../types/ambassador";
import { ambassadorBalances, updateVendorAttribution } from "./ambassador-commissions";
import {
  reconcileAmbassadorWithdrawal,
  requestAmbassadorWithdrawal,
} from "./ambassador-withdrawals";

function withdrawal(patch: Partial<WithdrawalInput> = {}): WithdrawalInput {
  return {
    amountIdr: 1_000_000,
    bankLast4: "4029",
    expectedVersion: 1,
    operationId: "ba-withdraw-one",
    acknowledged: true,
    outcome: "success",
    ...patch,
  };
}
describe("Ambassador commission and withdrawal adapters", () => {
  it("separates available6400000 from vendor commissions pending300000", () => {
    expect(ambassadorBalances(createAmbassadorState())).toEqual({
      availableIdr: 6_400_000,
      pendingIdr: 300_000,
      heldIdr: 0,
    });
  });
  it("calculates vendor commission on eligible platform fees and replaces refunded attribution once", () => {
    const state = createAmbassadorState();
    const context = createAmbassadorContext(state);
    context.permissions.attributionWrite = true;
    const input = {
      sourceId: "kalyana-fee-oct",
      eligibleFeeIdr: 500_000,
      sourceVersion: 2,
      status: "pending" as const,
      expectedVersion: 1,
    };
    const result = updateVendorAttribution(state, input, context);
    const next = result.state;
    expect(next.commissions.find((row) => row.sourceId === input.sourceId)?.amountIdr).toBe(75_000);
    expect(next.commissions).toHaveLength(5);
    expect(ambassadorBalances(next).pendingIdr).toBe(225_000);
    const latestContext = createAmbassadorContext(next);
    latestContext.permissions.attributionWrite = true;
    const duplicate = updateVendorAttribution(
      next,
      { ...input, expectedVersion: next.version },
      latestContext,
    );
    expect(duplicate.state).toBe(next);
    expect(next.audit).toHaveLength(1);
    const registration = updateVendorAttribution(
      next,
      {
        ...input,
        sourceId: "new-vendor",
        eligibleFeeIdr: 0,
        sourceVersion: 1,
        expectedVersion: next.version,
      },
      latestContext,
    );
    expect(registration.state.commissions.at(-1)?.amountIdr).toBe(0);
    expect(ambassadorBalances(registration.state).availableIdr).toBe(6_400_000);
  });
  it("does not let referral copy permission modify financial attribution or another program", () => {
    const state = createAmbassadorState();
    const context = createAmbassadorContext(state);
    const input = {
      sourceId: "opening-2026-10",
      eligibleFeeIdr: 0,
      sourceVersion: 2,
      status: "available" as const,
      expectedVersion: 1,
    };
    expect(updateVendorAttribution(state, input, context).errors?.access).toBeTruthy();
    context.permissions.attributionWrite = true;
    expect(updateVendorAttribution(state, input, context).ok).toBe(false);
  });
  it("holds one million once and preserves5400000 through accepted/scheduled/completed", () => {
    const state = createAmbassadorState();
    const accepted = requestAmbassadorWithdrawal(
      state,
      withdrawal(),
      createAmbassadorContext(state),
    ).state;
    expect(accepted.withdrawals[0]?.status).toBe("accepted");
    expect(ambassadorBalances(accepted).availableIdr).toBe(5_400_000);
    expect(
      requestAmbassadorWithdrawal(accepted, withdrawal(), createAmbassadorContext(accepted)).state,
    ).toBe(accepted);
    const scheduled = reconcileAmbassadorWithdrawal(
      accepted,
      "ba-withdraw-one",
      createAmbassadorContext(accepted),
      "scheduled",
    ).state;
    const completed = reconcileAmbassadorWithdrawal(
      scheduled,
      "ba-withdraw-one",
      createAmbassadorContext(scheduled),
      "completed",
    ).state;
    expect(ambassadorBalances(scheduled).availableIdr).toBe(5_400_000);
    expect(ambassadorBalances(completed).availableIdr).toBe(5_400_000);
  });
  it("requires checking an unknown operation before creating a new withdrawal", () => {
    const state = createAmbassadorState();
    const unknown = requestAmbassadorWithdrawal(
      state,
      withdrawal({ outcome: "unknown" }),
      createAmbassadorContext(state),
    ).state;
    expect(unknown.withdrawals[0]?.status).toBe("unknown");
    expect(
      requestAmbassadorWithdrawal(
        unknown,
        withdrawal({ operationId: "new", expectedVersion: unknown.version }),
        createAmbassadorContext(unknown),
      ).ok,
    ).toBe(false);
    const resolved = reconcileAmbassadorWithdrawal(
      unknown,
      "ba-withdraw-one",
      createAmbassadorContext(unknown),
    ).state;
    expect(resolved.withdrawals).toHaveLength(1);
    expect(ambassadorBalances(resolved).availableIdr).toBe(5_400_000);
  });
  it("checks fresh ownership, Hidden, permission, bank, dispute, amount, version and acknowledgment", () => {
    const state = createAmbassadorState();
    const context = createAmbassadorContext(state);
    const contexts = [
      { ...context, actorId: "someone-else" },
      { ...context, online: false },
      { ...context, sessionValid: false },
      { ...context, sandbox: false },
      { ...context, disputed: true },
      { ...context, permissions: { ...context.permissions, withdraw: false } },
    ];
    for (const denied of contexts)
      expect(requestAmbassadorWithdrawal(state, withdrawal(), denied).ok).toBe(false);
    for (const patch of [
      { bankLast4: "1188" },
      { amountIdr: 6_400_001 },
      { expectedVersion: 0 },
      { acknowledged: false },
      { amountIdr: 0.5 },
    ])
      expect(requestAmbassadorWithdrawal(state, withdrawal(patch), context).ok).toBe(false);
    expect(
      requestAmbassadorWithdrawal(state, withdrawal({ outcome: "failure" }), context).state,
    ).toBe(state);
  });
});
