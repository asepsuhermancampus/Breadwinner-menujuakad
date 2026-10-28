import type { FinanceSnapshot, SavingsSide } from "../types/finance-ledger";

export function savingsName(snapshot: FinanceSnapshot, side: SavingsSide, lowerFallback = false) {
  const fallback = `Pasangan ${side === "groom" ? "pria" : "wanita"}`;
  const name = snapshot.sideNames?.[side]?.trim();
  return name && name !== fallback ? name : lowerFallback ? fallback.toLowerCase() : fallback;
}
