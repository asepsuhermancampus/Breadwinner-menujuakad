import type { BundleItem } from "../types/marketplace";

export function formatIdr(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateBundleTotal(items: BundleItem[]) {
  const activeItems = items.filter((item) => item.status !== "unavailable");
  const subtotalIdr = activeItems.reduce((sum, item) => sum + item.unitPriceIdr * item.quantity, 0);
  const dp30PercentIdr = Math.round(subtotalIdr * 0.3);
  const remainingIdr = subtotalIdr - dp30PercentIdr;

  return {
    itemCount: activeItems.length,
    subtotalIdr,
    dp30PercentIdr,
    remainingIdr,
  };
}
