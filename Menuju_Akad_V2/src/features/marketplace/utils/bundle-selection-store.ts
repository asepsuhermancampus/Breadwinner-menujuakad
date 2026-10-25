import { useSyncExternalStore } from "react";
import type { BundleItem, VendorPackageSelection } from "../types/marketplace";

export const BUNDLE_SELECTION_KEY = "menuju_akad_bundle_selection";

export const DEFAULT_BUNDLE_ITEMS: BundleItem[] = [
  {
    id: "b-1",
    vendorId: "v-aru",
    vendorName: "Aru MUA",
    serviceName: "Paket Akad",
    unitPriceIdr: 8000000,
    quantity: 1,
    status: "available",
  },
  {
    id: "b-2",
    vendorId: "v-lensa",
    vendorName: "Lensa Teduh Photo",
    serviceName: "Sehari Penuh",
    unitPriceIdr: 15000000,
    quantity: 1,
    status: "available",
    packageId: "p2",
  },
  {
    id: "b-3",
    vendorId: "v-luma",
    vendorName: "Luma Dekor",
    serviceName: "Cypress",
    unitPriceIdr: 12000000,
    quantity: 1,
    status: "available",
  },
];

function getSessionStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function isValidSelection(val: unknown): val is VendorPackageSelection {
  if (!val || typeof val !== "object") return false;
  const s = val as Record<string, unknown>;
  return (
    typeof s.packageId === "string" &&
    s.packageId.trim().length > 0 &&
    typeof s.vendorId === "string" &&
    s.vendorId.trim().length > 0 &&
    typeof s.vendorName === "string" &&
    typeof s.packageName === "string" &&
    typeof s.priceIdr === "number" &&
    Number.isFinite(s.priceIdr) &&
    s.priceIdr > 0
  );
}

export function getSavedBundleSelection(): VendorPackageSelection | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(BUNDLE_SELECTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidSelection(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveBundleSelection(selection: VendorPackageSelection): void {
  if (!isValidSelection(selection)) return;
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(BUNDLE_SELECTION_KEY, JSON.stringify(selection));
    notifyListeners();
  } catch {
    // Guard against quota/security errors
  }
}

export function clearSavedBundleSelection(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(BUNDLE_SELECTION_KEY);
    notifyListeners();
  } catch {
    // Guard against security errors
  }
}

let cachedRaw: string | null = null;
let cachedSnapshot: VendorPackageSelection | null = null;

export function getBundleSelectionSnapshot(): VendorPackageSelection | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(BUNDLE_SELECTION_KEY);
    if (raw === cachedRaw) {
      return cachedSnapshot;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = null;
      return null;
    }
    const parsed = JSON.parse(raw);
    cachedSnapshot = isValidSelection(parsed) ? parsed : null;
    return cachedSnapshot;
  } catch {
    cachedRaw = null;
    cachedSnapshot = null;
    return null;
  }
}

const SERVER_SNAPSHOT: VendorPackageSelection | null = null;

export function getServerBundleSelectionSnapshot(): VendorPackageSelection | null {
  return SERVER_SNAPSHOT;
}

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners(): void {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Guard listener errors
    }
  });
}

export function subscribeBundleSelection(listener: Listener): () => void {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === BUNDLE_SELECTION_KEY) {
      notifyListeners();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function useBundleSelection(): VendorPackageSelection | null {
  return useSyncExternalStore(
    subscribeBundleSelection,
    getBundleSelectionSnapshot,
    getServerBundleSelectionSnapshot,
  );
}

export function applySelectionToBundle(
  baseItems: BundleItem[],
  selection: VendorPackageSelection | null,
): BundleItem[] {
  if (!selection) return baseItems;
  const existingIndex = baseItems.findIndex((item) => item.vendorId === selection.vendorId);
  if (existingIndex >= 0) {
    return baseItems.map((item, idx) =>
      idx === existingIndex
        ? {
            ...item,
            packageId: selection.packageId,
            serviceName: selection.packageName,
            unitPriceIdr: selection.priceIdr,
          }
        : item,
    );
  }
  return [
    ...baseItems,
    {
      id: `b-${selection.vendorId}-${selection.packageId}`,
      vendorId: selection.vendorId,
      vendorName: selection.vendorName,
      serviceName: selection.packageName,
      unitPriceIdr: selection.priceIdr,
      quantity: 1,
      status: "available",
      packageId: selection.packageId,
    },
  ];
}
