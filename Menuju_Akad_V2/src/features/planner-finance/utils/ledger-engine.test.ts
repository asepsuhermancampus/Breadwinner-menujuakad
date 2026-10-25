import { describe, expect, it } from "vitest";
import type { ExpenseItem } from "../types/finance";
import { applyExpense, applyExpenseBatch, type LedgerState } from "./ledger-engine";

describe("ledger-engine domain & financial invariants", () => {
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
    expenses: [
      {
        id: "EX-1001",
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
        id: "EX-1002",
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
    ],
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

  it("rejects expense exceeding account balance without clamping and keeps ledger unchanged", () => {
    const initial = createInitialState();
    const res = applyExpense(initial, {
      title: "Vendor Overdraft",
      category: "Dekorasi",
      amount: 20_000_000,
      paidBy: "Andi",
      fundingScope: "event_fund",
      accountId: "acc-1",
      date: "25 Okt 2026",
      status: "dp",
      recordedBy: "Risa",
      version: 1,
    });
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
    const bca = res.state.accounts.find((a) => a.id === "acc-1")!;
    expect(bca.currentBalance).toBe(10_000_000);
    expect(res.state.expenses).toHaveLength(2);
  });

  it("debits mapped account and generates distinct IDs on CSV 3-row batch import", () => {
    const initial = createInitialState();
    const batchItems: Omit<ExpenseItem, "id">[] = [
      {
        title: "Transport survei",
        category: "Transportasi",
        amount: 500_000,
        paidBy: "Andi",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "24 Okt 2026",
        status: "lunas",
        recordedBy: "CSV",
        version: 1,
      },
      {
        title: "Cetak undangan",
        category: "Undangan",
        amount: 750_000,
        paidBy: "Risa",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "24 Okt 2026",
        status: "lunas",
        recordedBy: "CSV",
        version: 1,
      },
      {
        title: "Sampel souvenir",
        category: "Souvenir",
        amount: 250_000,
        paidBy: "Andi",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "25 Okt 2026",
        status: "lunas",
        recordedBy: "CSV",
        version: 1,
      },
    ];
    const res = applyExpenseBatch(initial, batchItems);
    expect(res.success).toBe(true);
    const bca = res.state.accounts.find((a) => a.id === "acc-1")!;
    expect(bca.currentBalance).toBe(8_500_000);
    const ids = res.data!.map((e) => e.id);
    expect(ids).toEqual(["EX-1003", "EX-1004", "EX-1005"]);
    expect(new Set(ids).size).toBe(3);
  });

  it("rejects batch all-or-nothing when total required exceeds account balance", () => {
    const initial = createInitialState();
    const batchItems: Omit<ExpenseItem, "id">[] = [
      {
        title: "Row 1",
        category: "A",
        amount: 6_000_000,
        paidBy: "Andi",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "24 Okt 2026",
        status: "lunas",
        recordedBy: "CSV",
        version: 1,
      },
      {
        title: "Row 2 Overdraft",
        category: "B",
        amount: 5_000_000,
        paidBy: "Andi",
        fundingScope: "event_fund",
        accountId: "acc-1",
        date: "24 Okt 2026",
        status: "lunas",
        recordedBy: "CSV",
        version: 1,
      },
    ];
    const res = applyExpenseBatch(initial, batchItems);
    expect(res.success).toBe(false);
    const bca = res.state.accounts.find((a) => a.id === "acc-1")!;
    expect(bca.currentBalance).toBe(10_000_000);
    expect(res.state.expenses).toHaveLength(2);
  });
});
