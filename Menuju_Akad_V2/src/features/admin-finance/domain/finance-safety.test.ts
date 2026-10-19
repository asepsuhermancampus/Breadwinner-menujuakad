import { describe, expect, it } from "vitest";
import { createFinanceContext, createFinanceState } from "../content/finance-content";
import { refundImpact, requestFinanceRefund } from "./finance-money";
import { requestFinanceOtp } from "./finance-settings";
import { appendFinanceCorrection, exportFinanceAudit } from "./finance-audit";
import { reconcilePayment } from "./finance-reconciliation";

describe("finance arithmetic and sensitive data", () => {
  it("keeps captured, expired, refund fee, and vendor rights distinct", () => {
    const state = createFinanceState();
    const provider = state.reconciliations
      .filter((row) => row.provider === "settled")
      .reduce((sum, row) => sum + row.amount, 0);
    const internal = state.reconciliations
      .filter((row) => row.internal === "paid")
      .reduce((sum, row) => sum + row.amount, 0);
    expect([provider, internal, provider - internal]).toEqual([12_500_000, 10_500_000, 2_000_000]);
    expect(state.payouts.reduce((sum, row) => sum + row.amount, 0)).toBe(13_000_000);
    expect(refundImpact(5_000_000)).toEqual({
      remaining: 10_000_000,
      feeBefore: 750_000,
      feeAfter: 500_000,
      feeReversal: 250_000,
      vendorBefore: 14_250_000,
      vendorAfter: 9_500_000,
      vendorReduction: 4_750_000,
    });
  });
  it("blocks offline writes and preserves all captured funds on provider failure", () => {
    const state = createFinanceState();
    const context = createFinanceContext("superadmin");
    const input = {
      operationId: "RF:PAY8300:01",
      expectedVersion: 4,
      reason: "Penyelesaian sesuai kontrak.",
      acknowledged: true,
      amount: 5_000_000,
      paymentId: "PAY8300",
      disputeId: "DS-019",
      expectedDisputeVersion: 3,
      originalMethod: true,
      response: "failed" as const,
    };
    expect(requestFinanceRefund(state, input, context).state).toBe(state);
    expect(
      requestFinanceRefund(state, { ...input, response: "accepted" }, { ...context, online: false })
        .state,
    ).toBe(state);
    expect(
      requestFinanceRefund(
        state,
        { ...input, response: "accepted" },
        { ...context, sessionValid: false },
      ).ok,
    ).toBe(false);
  });
  it("enforces OTP resend cooldown without changing active configuration", () => {
    const context = { ...createFinanceContext("superadmin"), now: () => 100_000 };
    const state = createFinanceState();
    const requested = requestFinanceOtp(state, context);
    expect(requested.state.config).toBe(state.config);
    expect(requestFinanceOtp(requested.state, context).ok).toBe(false);
    expect(requestFinanceOtp(requested.state, { ...context, now: () => 145_001 }).ok).toBe(true);
  });
  it("redacts audit comments and masks export without mutating the original event", () => {
    const state = createFinanceState();
    const context = createFinanceContext("superadmin");
    const synced = reconcilePayment(
      state,
      {
        operationId: "PAY:TX8423:SETTLED",
        transactionId: "TX-8423",
        expectedVersion: 17,
        eventId: "evt-8423-settled",
        paymentId: "PAY8423",
        amount: 2_000_000,
        currency: "IDR",
        status: "SETTLED",
        signatureValid: true,
        key: "PAY:TX8423:SETTLED",
        reason: "OTP=882016 account 123456789012 a@private.id secret=private-key",
        acknowledged: true,
      },
      context,
    ).state;
    const corrected = appendFinanceCorrection(
      synced,
      synced.audit[0]!.id,
      "Koreksi dengan OTP=882016",
      context,
    ).state;
    const csv = exportFinanceAudit(corrected, context).csv;
    for (const sensitive of ["882016", "123456789012", "a@private.id", "private-key"]) {
      expect(JSON.stringify(corrected.audit)).not.toContain(sensitive);
      expect(csv).not.toContain(sensitive);
    }
    expect(corrected.audit[0]).toBe(synced.audit[0]);
    expect(corrected.audit).toHaveLength(2);
  });
});
