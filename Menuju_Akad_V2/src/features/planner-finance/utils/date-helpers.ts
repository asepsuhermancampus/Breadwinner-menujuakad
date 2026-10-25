const MONTH_MAP: Record<string, number> = {
  jan: 0,
  januari: 0,
  feb: 1,
  februari: 1,
  mar: 2,
  maret: 2,
  apr: 3,
  april: 3,
  mei: 4,
  jun: 5,
  juni: 5,
  jul: 6,
  juli: 6,
  agu: 7,
  ags: 7,
  agustus: 7,
  sep: 8,
  sept: 8,
  september: 8,
  okt: 9,
  oktober: 9,
  nov: 10,
  nop: 10,
  november: 10,
  des: 11,
  desember: 11,
};

function isValidUtcDate(y: number, m: number, d: number): boolean {
  if (y < 1000 || y > 9999 || m < 0 || m > 11 || d < 1 || d > 31) {
    return false;
  }
  const dt = new Date(Date.UTC(y, m, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m && dt.getUTCDate() === d;
}

export function parseIndonesianDate(dateStr: string): number {
  if (!dateStr || typeof dateStr !== "string") return 0;
  const trimmed = dateStr.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1] ?? "", 10);
    const m = parseInt(isoMatch[2] ?? "", 10) - 1;
    const d = parseInt(isoMatch[3] ?? "", 10);
    if (!isValidUtcDate(y, m, d)) return 0;
    return Date.UTC(y, m, d);
  }
  const idMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (idMatch) {
    const d = parseInt(idMatch[1] ?? "", 10);
    const mon = idMatch[2]?.toLowerCase() ?? "";
    const y = parseInt(idMatch[3] ?? "", 10);
    const m = MONTH_MAP[mon];
    if (m === undefined || !isValidUtcDate(y, m, d)) {
      return 0;
    }
    return Date.UTC(y, m, d);
  }
  const timestamp = Date.parse(trimmed);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}
