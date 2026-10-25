import { describe, it, expect } from "vitest";
import { validateTransactionSnapshot } from "./transaction-validator";
import { createDefaultSnapshot } from "./transaction-defaults";
import type { TransactionSnapshot } from "./transaction-types";

describe("validateTransactionSnapshot", () => {
  const validSnapshot: TransactionSnapshot = createDefaultSnapshot("ORD-SIM-204");

  it("validates correct DP snapshot successfully", () => {
    const result = validateTransactionSnapshot(validSnapshot, "ORD-SIM-204");
    expect(result).not.toBeNull();
    expect(result?.scheme).toBe("dp");
    expect(result?.paidAmountIdr).toBe(10500000);
    expect(result?.remainingAmountIdr).toBe(24500000);
  });

  it("validates correct full snapshot successfully", () => {
    const fullSnapshot: TransactionSnapshot = {
      ...validSnapshot,
      scheme: "full",
      paidAmountIdr: 35000000,
      remainingAmountIdr: 0,
      items: validSnapshot.items.map((it) => ({
        ...it,
        paidAmountIdr: it.totalPriceIdr,
      })),
    };
    const result = validateTransactionSnapshot(fullSnapshot, "ORD-SIM-204");
    expect(result).not.toBeNull();
    expect(result?.scheme).toBe("full");
    expect(result?.paidAmountIdr).toBe(35000000);
    expect(result?.remainingAmountIdr).toBe(0);
  });

  it("rejects corruption like empty object or primitives", () => {
    expect(validateTransactionSnapshot({}, "ORD-SIM-204")).toBeNull();
    expect(validateTransactionSnapshot(null, "ORD-SIM-204")).toBeNull();
    expect(validateTransactionSnapshot("corrupt", "ORD-SIM-204")).toBeNull();
    expect(validateTransactionSnapshot(12345, "ORD-SIM-204")).toBeNull();
  });

  it("rejects foreign orderId mismatch", () => {
    const result = validateTransactionSnapshot(validSnapshot, "ORD-OTHER-999");
    expect(result).toBeNull();
  });

  it("rejects inconsistent totals and scheme amounts", () => {
    const badMath = { ...validSnapshot, remainingAmountIdr: 10000000 };
    expect(validateTransactionSnapshot(badMath, "ORD-SIM-204")).toBeNull();

    const badFull = {
      ...validSnapshot,
      scheme: "full" as const,
      paidAmountIdr: 1000,
      remainingAmountIdr: 34999000,
    };
    expect(validateTransactionSnapshot(badFull, "ORD-SIM-204")).toBeNull();

    const badDp = {
      ...validSnapshot,
      paidAmountIdr: 20000000,
      remainingAmountIdr: 15000000,
    };
    expect(validateTransactionSnapshot(badDp, "ORD-SIM-204")).toBeNull();
  });

  it("rejects invalid money: negative, nonfinite, or non-safe integer", () => {
    const negativeTotal = { ...validSnapshot, totalAmountIdr: -35000000 };
    expect(validateTransactionSnapshot(negativeTotal, "ORD-SIM-204")).toBeNull();

    const nanPaid = { ...validSnapshot, paidAmountIdr: Number.NaN };
    expect(validateTransactionSnapshot(nanPaid, "ORD-SIM-204")).toBeNull();

    const infiniteTotal = { ...validSnapshot, totalAmountIdr: Number.POSITIVE_INFINITY };
    expect(validateTransactionSnapshot(infiniteTotal, "ORD-SIM-204")).toBeNull();
  });

  it("rejects inconsistent item totals or paid amounts not matching aggregate", () => {
    const badItemSums = {
      ...validSnapshot,
      items: [
        { id: "item-1", label: "Aru MUA · Akad", totalPriceIdr: 8000000, paidAmountIdr: 2400000 },
      ],
    };
    expect(validateTransactionSnapshot(badItemSums, "ORD-SIM-204")).toBeNull();
  });

  it("rejects unsupported gateway", () => {
    const badGateway = { ...validSnapshot, gateway: "unsupported_pay" };
    expect(validateTransactionSnapshot(badGateway, "ORD-SIM-204")).toBeNull();
  });
});
