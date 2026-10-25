import { useCallback, useSyncExternalStore } from "react";
import type { PaymentStatusType } from "../types/checkout";
import type { PaymentScheme, TransactionSnapshot } from "./transaction-types";
import { getServerSnapshotForOrder } from "./transaction-defaults";
import { validateTransactionSnapshot } from "./transaction-validator";

export * from "./transaction-types";
export * from "./transaction-defaults";
export * from "./transaction-validator";

function getSessionStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage ?? null;
  } catch {
    return null;
  }
}

const memoryCache = new Map<string, TransactionSnapshot>();
const listeners = new Set<() => void>();

function loadFromStorage(orderId: string): TransactionSnapshot | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(`menuju_akad_tx_${orderId}`);
    if (!raw) return null;
    return validateTransactionSnapshot(JSON.parse(raw), orderId);
  } catch {
    return null;
  }
}

export function getClientSnapshot(orderId: string): TransactionSnapshot {
  if (typeof window === "undefined") {
    return getServerSnapshotForOrder(orderId);
  }
  const cached = memoryCache.get(orderId);
  if (cached) return cached;

  const loaded = loadFromStorage(orderId);
  const snap = loaded ?? getServerSnapshotForOrder(orderId);
  memoryCache.set(orderId, snap);
  return snap;
}

export function commitTransaction(
  orderId: string,
  scheme: PaymentScheme,
  gateway: string,
  status: PaymentStatusType = "verified",
  quoteId: string = "Q-204/v9",
): TransactionSnapshot {
  if (typeof window === "undefined") {
    return getServerSnapshotForOrder(orderId);
  }
  const isFull = scheme === "full";
  const total = 35000000;
  const paid = isFull ? total : 10500000;
  const snapshot: TransactionSnapshot = {
    orderId,
    quoteId,
    scheme,
    gateway,
    totalAmountIdr: total,
    paidAmountIdr: paid,
    remainingAmountIdr: total - paid,
    status,
    invoiceNumber: `INV-${orderId.replace("ORD-", "")}-01`,
    receiptNumber: `RCPT-${orderId.replace("ORD-", "")}-01`,
    items: [
      {
        id: "item-1",
        label: "Aru MUA · Akad",
        totalPriceIdr: 8000000,
        paidAmountIdr: isFull ? 8000000 : 2400000,
      },
      {
        id: "item-2",
        label: "Lensa Teduh · Foto",
        totalPriceIdr: 15000000,
        paidAmountIdr: isFull ? 15000000 : 4500000,
      },
      {
        id: "item-3",
        label: "Rona Dekor · Cypress",
        totalPriceIdr: 12000000,
        paidAmountIdr: isFull ? 12000000 : 3600000,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  memoryCache.set(orderId, snapshot);
  const storage = getSessionStorage();
  if (storage) {
    try {
      storage.setItem(`menuju_akad_tx_${orderId}`, JSON.stringify(snapshot));
    } catch {
      // ignore quota / access errors
    }
  }
  listeners.forEach((l) => l());
  return snapshot;
}

export function updateTransactionStatus(orderId: string, status: PaymentStatusType): void {
  if (typeof window === "undefined") {
    return;
  }
  const current = getClientSnapshot(orderId);
  const updated: TransactionSnapshot = { ...current, status };
  memoryCache.set(orderId, updated);
  const storage = getSessionStorage();
  if (storage) {
    try {
      storage.setItem(`menuju_akad_tx_${orderId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useTransactionSnapshot(orderId: string = "ORD-SIM-204"): TransactionSnapshot {
  const getSnapshot = useCallback(() => getClientSnapshot(orderId), [orderId]);
  const getServerSnapshot = useCallback(() => getServerSnapshotForOrder(orderId), [orderId]);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
