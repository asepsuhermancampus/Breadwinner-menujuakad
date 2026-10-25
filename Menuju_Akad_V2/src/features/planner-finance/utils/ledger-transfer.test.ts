import { describe, expect, it } from "vitest";
import type { LedgerState } from "./ledger-engine";
import { applyCorrection, applyTransfer } from "./ledger-transfer-ops";

describe("ledger-transfer-ops domain invariants", () => {
  const createInitialState = (): LedgerState => ({
    accounts: [
      {
        id: "acc-1",
        name: "BCA Andi",
        bank: "BCA",
        maskedNumber: "••4821",
        owner: "Andi",
        openingBalance: 0,
        currentBalance: 10_000_000,
        cutOffDate: "2026-09-19",
      },
      {
        id: "acc-2",
        name: "Mandiri Risa",
        bank: "Mandiri",
        maskedNumber: "••9012",
        owner: "Risa",
        openingBalance: 0,
        currentBalance: 30_500_000,
        cutOffDate: "2026-09-19",
      },
      {
        id: "acc-3",
        name: "Jago Bersama",
        bank: "Jago",
        maskedNumber: "••7734",
        owner: "Bersama",
        openingBalance: 0,
        currentBalance: 14_500_000,
        cutOffDate: "2026-09-19",
      },
    ],
    deposits: [],
    expenses: [],
    transfers: [
      {
        id: "MT-009",
        fromAccountId: "acc-1",
        toAccountId: "acc-3",
        fromAccountName: "BCA Andi",
        toAccountName: "Jago Bersama",
        amount: 9_000_000,
        date: "2026-10-14",
        reason: "Alokasi vendor",
        recordedBy: "Risa",
        idempotencyKey: "MUT:AR:20261014:01",
      },
    ],
  });

  it("is idempotent when MT-009 correction is applied twice with identical amount", () => {
    const initial = createInitialState();
    const first = applyCorrection(initial, 8_000_000, "MT-009");
    expect(first.success).toBe(true);
    const bcaFirst = first.state.accounts.find((a) => a.id === "acc-1")!;
    const jagoFirst = first.state.accounts.find((a) => a.id === "acc-3")!;
    expect(bcaFirst.currentBalance).toBe(11_000_000);
    expect(jagoFirst.currentBalance).toBe(13_500_000);

    const second = applyCorrection(first.state, 8_000_000, "MT-009");
    expect(second.success).toBe(true);
    const bcaSecond = second.state.accounts.find((a) => a.id === "acc-1")!;
    const jagoSecond = second.state.accounts.find((a) => a.id === "acc-3")!;
    expect(bcaSecond.currentBalance).toBe(11_000_000);
    expect(jagoSecond.currentBalance).toBe(13_500_000);
  });

  it("calculates subsequent corrections from current effective amount and preserves provenance", () => {
    const initial = createInitialState();
    const first = applyCorrection(initial, 8_000_000, "MT-009");
    const second = applyCorrection(first.state, 7_000_000, "MT-009");
    expect(second.success).toBe(true);
    const bca = second.state.accounts.find((a) => a.id === "acc-1")!;
    const jago = second.state.accounts.find((a) => a.id === "acc-3")!;
    expect(bca.currentBalance).toBe(12_000_000);
    expect(jago.currentBalance).toBe(12_500_000);
    const updatedTransfer = second.state.transfers.find((t) => t.id === "MT-009")!;
    expect(updatedTransfer.amount).toBe(7_000_000);
    expect(updatedTransfer.originalAmount).toBe(9_000_000);
    expect(updatedTransfer.correctionHistory).toHaveLength(2);
  });

  it("rejects negative delta when destination account cannot afford clawback", () => {
    const initial = createInitialState();
    initial.accounts = initial.accounts.map((a) =>
      a.id === "acc-3" ? { ...a, currentBalance: 500_000 } : a,
    );
    const res = applyCorrection(initial, 7_000_000, "MT-009");
    expect(res.success).toBe(false);
    expect(res.error).toContain("tujuan tidak mencukupi");
    const jago = res.state.accounts.find((a) => a.id === "acc-3")!;
    expect(jago.currentBalance).toBe(500_000);
  });

  it("conserves total cash during valid transfers and rejects invalid parameters", () => {
    const initial = createInitialState();
    const totalBefore = initial.accounts.reduce((s, a) => s + a.currentBalance, 0);
    const validTransfer = applyTransfer(initial, "acc-1", "acc-2", 2_000_000);
    expect(validTransfer.success).toBe(true);
    const totalAfter = validTransfer.state.accounts.reduce((s, a) => s + a.currentBalance, 0);
    expect(totalAfter).toBe(totalBefore);

    const sameAcc = applyTransfer(initial, "acc-1", "acc-1", 1_000_000);
    expect(sameAcc.success).toBe(false);
    const invalidAmount = applyTransfer(initial, "acc-1", "acc-2", -500_000);
    expect(invalidAmount.success).toBe(false);
  });
});
