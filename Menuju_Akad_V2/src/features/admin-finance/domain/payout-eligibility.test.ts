import { describe, expect, it } from "vitest";
import { createFinanceState } from "../content/finance-content";
import type { PayoutRow } from "../types/admin-finance";
import { isPayoutEligible } from "./finance-money";

describe("isPayoutEligible predicate", () => {
  const baseRow: PayoutRow = {
    id: "WD-105",
    vendor: "Mitra Vendor",
    amount: 5_000_000,
    holdAmount: 5_000_000,
    bankLast4: "5521",
    bankVerified: true,
    disputed: false,
    serviceComplete: true,
    version: 1,
    status: "accepted",
    scheduledFor: null,
  };

  it("qualifies a verified, completed, non-disputed payout with matched hold", () => {
    expect(isPayoutEligible(baseRow)).toBe(true);
  });

  it("disqualifies payout once it has been scheduled", () => {
    expect(isPayoutEligible({ ...baseRow, status: "scheduled", scheduledFor: "2026-10-26" })).toBe(
      false,
    );
  });

  it("disqualifies disputed, unverified bank, incomplete service, or mismatched hold", () => {
    expect(isPayoutEligible({ ...baseRow, disputed: true })).toBe(false);
    expect(isPayoutEligible({ ...baseRow, bankVerified: false })).toBe(false);
    expect(isPayoutEligible({ ...baseRow, serviceComplete: false })).toBe(false);
    expect(isPayoutEligible({ ...baseRow, holdAmount: 4_000_000 })).toBe(false);
  });

  it("partitions seed payouts into eligible, scheduled, and held without overlap", () => {
    const state = createFinanceState();
    const eligible = state.payouts.filter(isPayoutEligible);
    const scheduled = state.payouts.filter((row) => row.status === "scheduled");
    const held = state.payouts.filter(
      (row) => row.status !== "scheduled" && !isPayoutEligible(row),
    );

    expect(eligible.map((row) => row.id)).toEqual(["WD-105"]);
    expect(scheduled).toHaveLength(0);
    expect(held.map((row) => row.id)).toEqual(["WD-106", "WD-107", "WD-108"]);
    expect(eligible.length + scheduled.length + held.length).toBe(state.payouts.length);
  });
});
