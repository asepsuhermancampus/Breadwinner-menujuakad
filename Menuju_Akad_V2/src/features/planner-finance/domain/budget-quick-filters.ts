export const amountRanges = [
  { value: "Semua", label: "Semua target", min: 0, max: Infinity },
  { value: "under500k", label: "Di bawah Rp500 ribu", min: 0, max: 500000 },
  { value: "500kTo1m", label: "Rp500 ribu – <Rp1 juta", min: 500000, max: 1000000 },
  { value: "1mTo1_5m", label: "Rp1 juta – <Rp1,5 juta", min: 1000000, max: 1500000 },
  { value: "1_5mTo5m", label: "Rp1,5 juta – <Rp5 juta", min: 1500000, max: 5000000 },
  { value: "from5m", label: "Rp5 juta ke atas", min: 5000000, max: Infinity },
] as const;
export type BudgetAmountRange = (typeof amountRanges)[number]["value"];
export function withinBudgetRange(amount: number | undefined, range: BudgetAmountRange) {
  if (range === "Semua") return true;
  const bounds = amountRanges.find((option) => option.value === range);
  return amount !== undefined && !!bounds && amount >= bounds.min && amount < bounds.max;
}
export function dayAfter(today: string, days: number) {
  const date = new Date(`${today}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
