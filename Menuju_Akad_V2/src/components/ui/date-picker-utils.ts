import { format, parse, isValid } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export function parseDateValue(val?: string): Date | undefined {
  if (!val || !val.trim()) return undefined;
  const iso = new Date(val);
  if (!isNaN(iso.getTime()) && val.includes("-")) return iso;

  const currentYear = new Date().getFullYear();
  let parsed = parse(val, "d MMM yyyy", new Date(), { locale: idLocale });
  if (isValid(parsed)) return parsed;

  parsed = parse(`${val} ${currentYear}`, "d MMM yyyy", new Date(), { locale: idLocale });
  if (isValid(parsed)) return parsed;

  return undefined;
}

export function formatDateValue(date: Date): string {
  const currentYear = new Date().getFullYear();
  if (date.getFullYear() === currentYear) {
    return format(date, "d MMM", { locale: idLocale });
  }
  return format(date, "d MMM yyyy", { locale: idLocale });
}

