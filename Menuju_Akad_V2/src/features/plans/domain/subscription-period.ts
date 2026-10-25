export function addCalendarMonths(iso: string, months: number): string {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime()) || !Number.isSafeInteger(months) || months < 0)
    throw new Error("Periode tidak valid");
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return date.toISOString();
}
