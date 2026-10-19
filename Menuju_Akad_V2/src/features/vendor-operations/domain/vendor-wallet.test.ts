import { describe, expect, it } from "vitest";
import { createVendorContext, createVendorWorkspace } from "./vendor-operations";
import { blockVendorDate, vendorCalendarDay } from "./vendor-calendar";
import {
  createVendorWallet,
  reconcileVendorPayout,
  requestVendorPayout,
  vendorAvailable,
  type VendorPayoutInput,
  type WalletWorkspace,
} from "./vendor-wallet";

function payout(patch: Partial<VendorPayoutInput> = {}): VendorPayoutInput {
  return {
    amountIdr: 5_000_000,
    bankLast4: "1188",
    expectedVersion: 1,
    operationId: "withdraw-once",
    acknowledged: true,
    ...patch,
  };
}
describe("Vendor calendar and wallet adapters", () => {
  it("keeps confirmed, temporary hold and internal block separate", () => {
    const state = createVendorWorkspace();
    const context = createVendorContext(state);
    const input = {
      date: "2027-02-18",
      reason: "Hari produksi internal",
      operationId: "block-once",
      expectedVersion: state.version,
      acknowledged: true,
    };
    const blocked = blockVendorDate(state, input, context);
    expect(blocked.ok).toBe(true);
    expect(vendorCalendarDay(blocked.state, input.date)).toBe("blocked");
    expect(vendorCalendarDay(blocked.state, "2027-02-14")).toBe("hold");
    expect(vendorCalendarDay(blocked.state, "2027-02-20")).toBe("confirmed");
    for (const date of ["2027-02-14", "2027-02-20"])
      expect(blockVendorDate(state, { ...input, date }, context).ok).toBe(false);
    expect(blocked.state.orders).toEqual(state.orders);
  });
  it("rejects calendar stale writes and revoked permission", () => {
    const state = createVendorWorkspace();
    const context = createVendorContext(state);
    const input = {
      date: "2027-02-18",
      reason: "Internal",
      operationId: "block",
      expectedVersion: 0,
      acknowledged: true,
    };
    expect(blockVendorDate(state, input, context).errors?.version).toBeTruthy();
    expect(
      blockVendorDate(
        state,
        { ...input, expectedVersion: 1 },
        { ...context, permissions: { ...context.permissions, calendarWrite: false } },
      ).errors?.access,
    ).toBeTruthy();
  });
  it("holds WD105 once, keeps escrow separate and never deducts on scheduling or settlement", () => {
    const state = createVendorWorkspace();
    const context = createVendorContext(state);
    const result = requestVendorPayout(state, payout(), context);
    const next = result.state as WalletWorkspace;
    expect(result.ok).toBe(true);
    expect(vendorAvailable(createVendorWallet())).toBe(18_500_000);
    expect(next.wallet?.escrowIdr).toBe(45_000_000);
    expect(vendorAvailable(next.wallet!)).toBe(13_500_000);
    expect(next.wallet?.requests[0]).toMatchObject({
      id: "WD-105",
      status: "accepted",
      bankLast4: "1188",
    });
    const duplicate = requestVendorPayout(next, payout(), createVendorContext(next));
    expect(duplicate.state).toBe(next);
    const scheduled = reconcileVendorPayout(
      next,
      "withdraw-once",
      createVendorContext(next),
      "scheduled",
    ).state as WalletWorkspace;
    const completed = reconcileVendorPayout(
      scheduled,
      "withdraw-once",
      createVendorContext(scheduled),
      "completed",
    ).state as WalletWorkspace;
    expect(vendorAvailable(scheduled.wallet!)).toBe(13_500_000);
    expect(vendorAvailable(completed.wallet!)).toBe(13_500_000);
  });
  it("locks an unknown request to its existing operation and amount", () => {
    const state = createVendorWorkspace();
    const context = createVendorContext(state);
    const unknown = requestVendorPayout(state, payout({ outcome: "unknown" }), context)
      .state as WalletWorkspace;
    expect(unknown.wallet?.requests[0]?.status).toBe("unknown");
    expect(
      requestVendorPayout(
        unknown,
        payout({ operationId: "another", expectedVersion: unknown.version }),
        createVendorContext(unknown),
      ).ok,
    ).toBe(false);
    expect(
      requestVendorPayout(unknown, payout({ amountIdr: 6_000_000 }), createVendorContext(unknown))
        .ok,
    ).toBe(false);
    const checked = reconcileVendorPayout(unknown, "withdraw-once", createVendorContext(unknown))
      .state as WalletWorkspace;
    expect(checked.wallet?.requests).toHaveLength(1);
    expect(vendorAvailable(checked.wallet!)).toBe(13_500_000);
  });
  it("rechecks permission, active bank, dispute, available funds and version", () => {
    const state = createVendorWorkspace();
    const context = createVendorContext(state);
    expect(requestVendorPayout(state, payout({ bankLast4: "6402" }), context).ok).toBe(false);
    expect(requestVendorPayout(state, payout({ amountIdr: 19_000_000 }), context).ok).toBe(false);
    expect(
      requestVendorPayout(state, payout({ expectedVersion: 0 }), context).errors?.version,
    ).toBeTruthy();
    expect(
      requestVendorPayout(
        { ...state, wallet: { ...createVendorWallet(), disputed: true } },
        payout(),
        context,
      ).ok,
    ).toBe(false);
    expect(
      requestVendorPayout(state, payout(), {
        ...context,
        permissions: { ...context.permissions, payoutRequest: false },
      }).errors?.access,
    ).toBeTruthy();
    expect(requestVendorPayout(state, payout({ outcome: "failure" }), context).state).toBe(state);
  });
});
