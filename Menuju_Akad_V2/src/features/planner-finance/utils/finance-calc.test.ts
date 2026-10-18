import { describe, expect, it } from "vitest";
import {
  calculateFinanceSummary,
  calculateTargetSimulation,
  formatRupiah,
  simulateCorrection,
  simulateTransfer,
} from "./finance-calc";
import type {
  AllocationAccount,
  DepositItem,
  ExpenseItem,
  InternalTransfer,
} from "../types/finance";

describe("finance-calc selectors & arithmetic invariants", () => {
  const mockAccounts: AllocationAccount[] = [
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
  ];

  const mockDeposits: DepositItem[] = [
    {
      id: "d-1",
      contributor: "Andi",
      amount: 55_000_000,
      accountId: "acc-1",
      accountName: "BCA",
      date: "2026-09-20",
    },
    {
      id: "d-2",
      contributor: "Risa",
      amount: 42_500_000,
      accountId: "acc-2",
      accountName: "Mandiri",
      date: "2026-10-01",
    },
    {
      id: "d-3",
      contributor: "Keluarga",
      amount: 15_000_000,
      accountId: "acc-3",
      accountName: "Jago",
      date: "2026-10-10",
    },
  ];

  const mockExpenses: ExpenseItem[] = [
    {
      id: "e-1",
      title: "Venue DP",
      category: "Venue",
      amount: 15_000_000,
      paidBy: "Bersama",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "2026-09-25",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
    },
    {
      id: "e-2",
      title: "Katering DP",
      category: "Katering",
      amount: 42_500_000,
      paidBy: "Andi",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "2026-10-02",
      status: "dp",
      recordedBy: "Andi",
      version: 1,
    },
  ];

  it("calculates accurate financial summary with 75% funded ratio", () => {
    const summary = calculateFinanceSummary(150_000_000, mockDeposits, mockExpenses, mockAccounts);
    expect(summary.targetAmount).toBe(150_000_000);
    expect(summary.totalContributed).toBe(112_500_000);
    expect(summary.totalExpenses).toBe(57_500_000);
    expect(summary.cashRemaining).toBe(55_000_000);
    expect(summary.planRemaining).toBe(92_500_000);
    expect(summary.gapAmount).toBe(37_500_000);
    expect(summary.fundedPercent).toBe(75);
  });

  it("formats rupiah amounts into Indonesian standard formatting", () => {
    expect(formatRupiah(150_000_000)).toBe("Rp 150.000.000");
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiah(4_687_500)).toBe("Rp 4.687.500");
  });

  it("calculates 4-period contribution gap simulation", () => {
    const sim = calculateTargetSimulation(37_500_000, 4, 50, 50);
    expect(sim.perPeriod).toBe(9_375_000);
    expect(sim.andiPerPeriod).toBe(4_687_500);
    expect(sim.risaPerPeriod).toBe(4_687_500);
  });

  it("conserves total cash during internal transfers", () => {
    const res = simulateTransfer(mockAccounts, "acc-1", "acc-3", 1_000_000);
    expect(res.valid).toBe(true);
    const bca = res.accounts.find((a) => a.id === "acc-1")!;
    const jago = res.accounts.find((a) => a.id === "acc-3")!;
    expect(bca.currentBalance).toBe(9_000_000);
    expect(jago.currentBalance).toBe(15_500_000);
    const totalBefore = mockAccounts.reduce((s, a) => s + a.currentBalance, 0);
    const totalAfter = res.accounts.reduce((s, a) => s + a.currentBalance, 0);
    expect(totalAfter).toBe(totalBefore);
  });

  it("blocks transfer to same account or with overdrawn balance", () => {
    const same = simulateTransfer(mockAccounts, "acc-1", "acc-1", 1_000_000);
    expect(same.valid).toBe(false);
    const overdraw = simulateTransfer(mockAccounts, "acc-1", "acc-2", 20_000_000);
    expect(overdraw.valid).toBe(false);
  });

  it("corrects MT-009 from 9 jt to 8 jt conserving total cash", () => {
    const originalTransfer: InternalTransfer = {
      id: "mt-009",
      fromAccountId: "acc-1",
      toAccountId: "acc-3",
      fromAccountName: "BCA Andi",
      toAccountName: "Jago Bersama",
      amount: 9_000_000,
      date: "2026-10-14",
      reason: "Alokasi vendor bersama",
      recordedBy: "Risa",
      idempotencyKey: "MUT:AR:20261014:01",
    };

    const res = simulateCorrection(mockAccounts, originalTransfer, 8_000_000);
    expect(res.valid).toBe(true);
    const bca = res.accounts.find((a) => a.id === "acc-1")!;
    const jago = res.accounts.find((a) => a.id === "acc-3")!;
    expect(bca.currentBalance).toBe(11_000_000);
    expect(jago.currentBalance).toBe(13_500_000);
    const totalAfter = res.accounts.reduce((s, a) => s + a.currentBalance, 0);
    expect(totalAfter).toBe(55_000_000);
  });
});
