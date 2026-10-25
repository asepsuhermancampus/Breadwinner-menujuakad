import { describe, expect, it } from "vitest";
import type { DepositItem, ExpenseItem } from "../types/finance";
import type { LedgerState } from "../types/ledger";
import { applyDeposit, applyExpenseBatch } from "./ledger-engine";
import { applyCorrection, applyTransfer } from "./ledger-transfer-ops";

describe("ledger safe-integer overflow protection at boundaries", () => {
  const createBoundaryState = (): LedgerState => ({
    accounts: [
      {
        id: "acc-1",
        name: "BCA Andi",
        bank: "BCA",
        maskedNumber: "••4821",
        owner: "Andi",
        openingBalance: 0,
        currentBalance: 1_000_000_000,
        cutOffDate: "2026-09-19",
      },
      {
        id: "acc-near-max",
        name: "Vault",
        bank: "Mandiri",
        maskedNumber: "••9999",
        owner: "Bersama",
        openingBalance: 0,
        currentBalance: Number.MAX_SAFE_INTEGER - 100,
        cutOffDate: "2026-09-19",
      },
    ],
    deposits: [],
    expenses: [],
    transfers: [
      {
        id: "MT-001",
        fromAccountId: "acc-1",
        toAccountId: "acc-near-max",
        fromAccountName: "BCA Andi",
        toAccountName: "Vault",
        amount: 50,
        date: "2026-10-14",
        reason: "Initial",
        recordedBy: "Andi",
        idempotencyKey: "INIT:1",
      },
    ],
  });

  it("rejects deposit that would exceed MAX_SAFE_INTEGER and keeps state unchanged", () => {
    const initial = createBoundaryState();
    const depositPayload: Omit<DepositItem, "id"> = {
      contributor: "Andi",
      amount: 150,
      accountId: "acc-near-max",
      accountName: "Vault",
      date: "2026-10-20",
    };
    const res = applyDeposit(initial, depositPayload);
    expect(res.success).toBe(false);
    expect(res.error).toContain("batas maksimum yang aman");
    const vault = res.state.accounts.find((a) => a.id === "acc-near-max")!;
    expect(vault.currentBalance).toBe(Number.MAX_SAFE_INTEGER - 100);
    expect(res.state.deposits).toHaveLength(0);
  });

  it("allows deposit exactly up to MAX_SAFE_INTEGER", () => {
    const initial = createBoundaryState();
    const depositPayload: Omit<DepositItem, "id"> = {
      contributor: "Andi",
      amount: 100,
      accountId: "acc-near-max",
      accountName: "Vault",
      date: "2026-10-20",
    };
    const res = applyDeposit(initial, depositPayload);
    expect(res.success).toBe(true);
    const vault = res.state.accounts.find((a) => a.id === "acc-near-max")!;
    expect(vault.currentBalance).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("rejects transfer that would exceed MAX_SAFE_INTEGER in destination account", () => {
    const initial = createBoundaryState();
    const res = applyTransfer(initial, "acc-1", "acc-near-max", 150);
    expect(res.success).toBe(false);
    expect(res.error).toContain("batas maksimum yang aman");
    expect(res.state.accounts.find((a) => a.id === "acc-near-max")?.currentBalance).toBe(
      Number.MAX_SAFE_INTEGER - 100,
    );
    expect(res.state.accounts.find((a) => a.id === "acc-1")?.currentBalance).toBe(1_000_000_000);
  });

  it("rejects correction that would cause destination account to exceed MAX_SAFE_INTEGER", () => {
    const initial = createBoundaryState();
    const res = applyCorrection(initial, 200, "MT-001");
    expect(res.success).toBe(false);
    expect(res.error).toContain("batas maksimum yang aman");
    expect(res.state.accounts.find((a) => a.id === "acc-near-max")?.currentBalance).toBe(
      Number.MAX_SAFE_INTEGER - 100,
    );
  });

  it("rejects batch expenses whose cumulative sum overflows safe integer", () => {
    const initial = createBoundaryState();
    const items: Omit<ExpenseItem, "id">[] = [
      {
        title: "Large Item 1",
        category: "Venue",
        amount: Number.MAX_SAFE_INTEGER - 10,
        paidBy: "Bersama",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "2026-10-20",
        status: "dp",
        recordedBy: "Andi",
        version: 1,
      },
      {
        title: "Large Item 2",
        category: "Katering",
        amount: 20,
        paidBy: "Bersama",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "2026-10-20",
        status: "dp",
        recordedBy: "Andi",
        version: 1,
      },
    ];
    const res = applyExpenseBatch(initial, items);
    expect(res.success).toBe(false);
    expect(res.error).toContain("batas maksimum yang aman");
    expect(res.state.expenses).toHaveLength(0);
    expect(res.state.accounts.find((a) => a.id === "acc-1")?.currentBalance).toBe(1_000_000_000);
  });
});
