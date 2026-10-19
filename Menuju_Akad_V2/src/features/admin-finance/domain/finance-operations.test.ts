import { describe, expect, it } from "vitest";
import { createFinanceContext, createFinanceState } from "../content/finance-content";
import { publishFinanceConfig, requestFinanceOtp, verifyFinanceOtp } from "./finance-settings";
import { reconcilePayment } from "./finance-reconciliation";
import { requestFinanceRefund, scheduleFinancePayout } from "./finance-money";
import { appendFinanceCorrection, exportFinanceAudit } from "./finance-audit";
import type { FinanceIntent, ReconcileInput, RefundInput } from "../types/admin-finance";

const intent: FinanceIntent = {
  operationId: "operation-1",
  expectedVersion: 17,
  reason: "Bukti telah ditinjau oleh petugas.",
  acknowledged: true,
};
const event: ReconcileInput = {
  ...intent,
  transactionId: "TX-8423",
  eventId: "evt-8423-settled",
  paymentId: "PAY8423",
  amount: 2_000_000,
  currency: "IDR",
  status: "SETTLED",
  signatureValid: true,
  key: "PAY:TX8423:SETTLED",
};
const refund: RefundInput = {
  ...intent,
  operationId: "RF:PAY8300:01",
  expectedVersion: 4,
  amount: 5_000_000,
  paymentId: "PAY8300",
  disputeId: "DS-019",
  expectedDisputeVersion: 3,
  originalMethod: true,
  response: "accepted",
};
const context = () => ({ ...createFinanceContext("superadmin"), now: () => 1_800_000_000_000 });

describe("financial state boundaries", () => {
  it("reconciles only the verified status difference and repeats safely", () => {
    const state = createFinanceState();
    const result = reconcilePayment(state, event, context());
    expect(result.ok).toBe(true);
    expect(result.state.reconciliations[2]?.internal).toBe("paid");
    expect(result.state.reconciliations[3]?.internal).toBe("expired");
    expect(state.reconciliations[2]?.internal).toBe("waiting");
    const repeated = reconcilePayment(result.state, event, context());
    expect(repeated.state).toBe(result.state);
    expect(repeated.state.audit).toHaveLength(1);
  });
  it.each([
    { signatureValid: false },
    { amount: 2_000_001 },
    { currency: "USD" },
    { status: "PENDING" },
    { paymentId: "unknown" },
    { expectedVersion: 16 },
    { key: "wrong" },
  ])("blocks unsafe webhook %j", (patch) => {
    const state = createFinanceState();
    const result = reconcilePayment(state, { ...event, ...patch }, context());
    expect(result.ok).toBe(false);
    expect(result.state).toBe(state);
  });
  it("blocks runtime support financial writes even with all permission booleans", () => {
    const state = createFinanceState();
    expect(reconcilePayment(state, event, { ...context(), role: "support" }).ok).toBe(false);
  });
  it("schedules eligible payout without placing a second hold", () => {
    const state = createFinanceState();
    const result = scheduleFinancePayout(
      state,
      "WD-105",
      { ...intent, expectedVersion: 1 },
      context(),
    );
    expect(result.ok).toBe(true);
    expect(result.state.payouts[0]).toMatchObject({
      holdAmount: 5_000_000,
      status: "scheduled",
      scheduledFor: "2026-10-26",
    });
    expect(
      scheduleFinancePayout(result.state, "WD-105", { ...intent, expectedVersion: 1 }, context())
        .state,
    ).toBe(result.state);
    for (const id of ["WD-106", "WD-107", "WD-108"])
      expect(
        scheduleFinancePayout(state, id, { ...intent, expectedVersion: 1 }, context()).ok,
      ).toBe(false);
  });
  it("reserves refund once; unknown response cannot create a new request", () => {
    const state = createFinanceState();
    const result = requestFinanceRefund(state, { ...refund, response: "unknown" }, context());
    expect(result.state.payment).toMatchObject({
      reservedRefund: 5_000_000,
      refunded: 0,
      status: "refund-unknown",
    });
    expect(
      requestFinanceRefund(result.state, { ...refund, response: "unknown" }, context()).state,
    ).toBe(result.state);
    const next = requestFinanceRefund(
      result.state,
      { ...refund, operationId: "new-refund", expectedVersion: 5 },
      context(),
    );
    expect(next.ok).toBe(false);
    expect(next.state).toBe(result.state);
  });
  it("blocks over-refund, stale dispute and changed method without mutating snapshots", () => {
    const state = createFinanceState();
    for (const patch of [
      { amount: 16_000_000 },
      { expectedDisputeVersion: 2 },
      { originalMethod: false },
      { acknowledged: false },
    ]) {
      expect(requestFinanceRefund(state, { ...refund, ...patch }, context()).state).toBe(state);
    }
  });
  it("OTP grants no permission and config requires review of a fresh version", () => {
    const state = createFinanceState();
    const verified = verifyFinanceOtp(
      requestFinanceOtp(state, context()).state,
      "882016",
      context(),
    );
    expect(verified.ok).toBe(true);
    expect(verified.state.config.version).toBe(17);
    const input = {
      ...intent,
      feeBps: 600,
      bankName: "Mandiri",
      bankLast4: "6610",
      bankValidated: true,
    };
    expect(
      publishFinanceConfig(verified.state, input, {
        ...context(),
        permissions: { ...context().permissions, settings: false },
      }).ok,
    ).toBe(false);
    expect(
      publishFinanceConfig(verified.state, { ...input, expectedVersion: 16 }, context()).ok,
    ).toBe(false);
    expect(
      publishFinanceConfig(verified.state, { ...input, acknowledged: false }, context()).ok,
    ).toBe(false);
    const published = publishFinanceConfig(verified.state, input, context());
    expect(published.state.config).toMatchObject({ version: 18, feeBps: 600, bankLast4: "6610" });
    expect(published.state.payment).toBe(state.payment);
    expect(published.state.payouts).toBe(state.payouts);
    expect(JSON.stringify(published.state)).not.toContain("882016");
  });
  it("rejects expired OTP and appends corrections instead of rewriting history", () => {
    const verified = verifyFinanceOtp(
      requestFinanceOtp(createFinanceState(), context()).state,
      "882016",
      context(),
    );
    const input = {
      ...intent,
      feeBps: 600,
      bankName: "Mandiri",
      bankLast4: "6610",
      bankValidated: true,
    };
    expect(
      publishFinanceConfig(verified.state, input, {
        ...context(),
        now: () => context().now() + 301_000,
      }).ok,
    ).toBe(false);
    const synced = reconcilePayment(createFinanceState(), event, context()).state;
    const original = synced.audit[0]!;
    const correction = appendFinanceCorrection(
      synced,
      original.id,
      "Klarifikasi pemeriksaan tanpa menghapus histori.",
      context(),
    );
    expect(correction.state.audit[0]).toBe(original);
    expect(correction.state.audit[1]?.linkedId).toBe(original.id);
    expect(exportFinanceAudit(correction.state, createFinanceContext("support")).ok).toBe(false);
  });
});
