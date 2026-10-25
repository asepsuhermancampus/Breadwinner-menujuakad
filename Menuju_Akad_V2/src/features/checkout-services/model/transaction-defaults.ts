import type { TransactionSnapshot } from "./transaction-types";

export function createDefaultSnapshot(orderId: string = "ORD-SIM-204"): TransactionSnapshot {
  return {
    orderId,
    quoteId: "Q-204/v9",
    scheme: "dp",
    gateway: "klikqris",
    totalAmountIdr: 35000000,
    paidAmountIdr: 10500000,
    remainingAmountIdr: 24500000,
    status: "verified",
    invoiceNumber: "INV-SIM-204-01",
    receiptNumber: "RCPT-SIM-204-01",
    items: [
      { id: "item-1", label: "Aru MUA · Akad", totalPriceIdr: 8000000, paidAmountIdr: 2400000 },
      {
        id: "item-2",
        label: "Lensa Teduh · Foto",
        totalPriceIdr: 15000000,
        paidAmountIdr: 4500000,
      },
      {
        id: "item-3",
        label: "Rona Dekor · Cypress",
        totalPriceIdr: 12000000,
        paidAmountIdr: 3600000,
      },
    ],
    createdAt: "2026-10-25T10:50:00Z",
  };
}

const serverDefaultCache = new Map<string, TransactionSnapshot>();

export function getServerSnapshotForOrder(orderId: string): TransactionSnapshot {
  let snap = serverDefaultCache.get(orderId);
  if (!snap) {
    snap = Object.freeze(createDefaultSnapshot(orderId));
    serverDefaultCache.set(orderId, snap);
  }
  return snap;
}
