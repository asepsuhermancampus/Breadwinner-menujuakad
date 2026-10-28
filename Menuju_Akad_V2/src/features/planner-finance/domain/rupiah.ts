/** Whole rupiah only: ungrouped digits or Indonesian thousands groups. */
export function parseRupiahInput(value: string): number {
  if (!/^(?:\d+|\d{1,3}(?:\.\d{3})+)$/.test(value)) return Number.NaN;
  const amount = Number(value.replaceAll(".", ""));
  return Number.isSafeInteger(amount) ? amount : Number.NaN;
}

export function formatRupiahInput(value: string): string {
  const amount = parseRupiahInput(value);
  return Number.isNaN(amount) ? value : amount.toLocaleString("id-ID");
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}
