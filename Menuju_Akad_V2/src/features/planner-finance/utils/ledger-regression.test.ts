import { describe, expect, it } from "vitest";
import type { DepositItem, ExpenseItem } from "../types/finance";
import { applyDeposit, applyExpense, type LedgerState } from "./ledger-engine";
import { applyCorrection, applyTransfer } from "./ledger-transfer-ops";

describe("ledger-engine regression invariants", () => {
  const createTestState = (): LedgerState => ({
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
    ],
    deposits: [],
    expenses: [
      {
        id: "EX-1001",
        title: "Item 1",
        category: "Venue",
        amount: 1_000_000,
        paidBy: "Andi",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "2026-09-25",
        status: "dp",
        recordedBy: "Andi",
        version: 1,
      },
    ],
    transfers: [
      {
        id: "MT-009",
        fromAccountId: "acc-1",
        toAccountId: "acc-2",
        fromAccountName: "BCA Andi",
        toAccountName: "Mandiri Risa",
        amount: 2_000_000,
        date: "2026-10-14",
        reason: "Mutasi",
        recordedBy: "Andi",
        idempotencyKey: "TEST:1",
      },
    ],
  });

  it("handles two sequential operations: allows first, rejects second on overspend, assigns unique sequential IDs", () => {
    const initial = createTestState();
    const firstPayload: Omit<ExpenseItem, "id"> = {
      title: "First Expense",
      category: "Katering",
      amount: 6_000_000,
      paidBy: "Andi",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "2026-10-20",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
    };
    const firstRes = applyExpense(initial, firstPayload);
    expect(firstRes.success).toBe(true);
    expect(firstRes.data?.id).toBe("EX-1002");
    expect(firstRes.state.accounts.find((a) => a.id === "acc-1")?.currentBalance).toBe(4_000_000);

    const secondPayloadOverspend: Omit<ExpenseItem, "id"> = {
      title: "Second Overdraft",
      category: "Dekorasi",
      amount: 5_000_000,
      paidBy: "Andi",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "2026-10-21",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
    };
    const secondRes = applyExpense(firstRes.state, secondPayloadOverspend);
    expect(secondRes.success).toBe(false);
    expect(secondRes.error).toContain("tidak mencukupi");
    expect(secondRes.state.accounts.find((a) => a.id === "acc-1")?.currentBalance).toBe(4_000_000);

    const secondPayloadValid: Omit<ExpenseItem, "id"> = {
      title: "Second Valid",
      category: "Dekorasi",
      amount: 3_000_000,
      paidBy: "Andi",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "2026-10-21",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
    };
    const thirdRes = applyExpense(firstRes.state, secondPayloadValid);
    expect(thirdRes.success).toBe(true);
    expect(thirdRes.data?.id).toBe("EX-1003");
    expect(thirdRes.state.accounts.find((a) => a.id === "acc-1")?.currentBalance).toBe(1_000_000);
    expect(new Set([firstRes.data?.id, thirdRes.data?.id]).size).toBe(2);
  });

  it("rejects NaN, fractional amounts, and missing destination accounts", () => {
    const initial = createTestState();
    const expenseNaN = applyExpense(initial, {
      title: "Invalid NaN",
      category: "Venue",
      amount: Number.NaN,
      paidBy: "Andi",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "2026-10-20",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
    });
    expect(expenseNaN.success).toBe(false);

    const expenseFraction = applyExpense(initial, {
      title: "Invalid Fraction",
      category: "Venue",
      amount: 500_000.75,
      paidBy: "Andi",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "2026-10-20",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
    });
    expect(expenseFraction.success).toBe(false);

    const depositNaN = applyDeposit(initial, {
      contributor: "Andi",
      amount: Number.NaN,
      accountId: "acc-1",
      accountName: "BCA",
      date: "2026-10-20",
    } as Omit<DepositItem, "id">);
    expect(depositNaN.success).toBe(false);

    const depositMissingAcc = applyDeposit(initial, {
      contributor: "Andi",
      amount: 1_000_000,
      accountId: "non-existent",
      accountName: "Unknown",
      date: "2026-10-20",
    });
    expect(depositMissingAcc.success).toBe(false);
    expect(depositMissingAcc.error).toContain("tidak ditemukan");

    const transferMissingDest = applyTransfer(initial, "acc-1", "non-existent", 1_000_000);
    expect(transferMissingDest.success).toBe(false);
    expect(transferMissingDest.error).toContain("tidak valid");

    const correctionNaN = applyCorrection(initial, Number.NaN, "MT-009");
    expect(correctionNaN.success).toBe(false);
  });

  it("guarantees computed balance remains safe integer across all ledger mutations", () => {
    const initial = createTestState();
    const depositRes = applyDeposit(initial, {
      contributor: "Risa",
      amount: 15_000_000,
      accountId: "acc-2",
      accountName: "Mandiri",
      date: "2026-10-22",
    });
    expect(depositRes.success).toBe(true);
    const acc2AfterDep = depositRes.state.accounts.find((a) => a.id === "acc-2")!;
    expect(Number.isSafeInteger(acc2AfterDep.currentBalance)).toBe(true);
    expect(acc2AfterDep.currentBalance).toBe(45_500_000);

    const transferRes = applyTransfer(depositRes.state, "acc-2", "acc-1", 5_000_000);
    expect(transferRes.success).toBe(true);
    transferRes.state.accounts.forEach((acc) => {
      expect(Number.isSafeInteger(acc.currentBalance)).toBe(true);
    });
  });
});
