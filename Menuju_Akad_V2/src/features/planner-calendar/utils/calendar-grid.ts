import type { CalendarEventItem } from "../types/calendar";

export type CalendarDayCell = {
  dayNumber: number;
  isCurrentMonth: boolean;
  dateStr: string;
  events: CalendarEventItem[];
};

export const TOTAL_WEEKS = 5;
export const DEFAULT_WEEK_INDEX = 3;

export function generateOctoberGrid(events: CalendarEventItem[]): CalendarDayCell[] {
  return Array.from({ length: 35 }, (_, index) => {
    const dayNumber = index < 3 ? 28 + index : index < 34 ? index - 2 : 1;
    const isCurrentMonth = index >= 3 && index < 34;
    const dateStr = isCurrentMonth
      ? `2026-10-${String(dayNumber).padStart(2, "0")}`
      : index < 3
        ? `2026-09-${String(dayNumber).padStart(2, "0")}`
        : `2026-11-01`;

    const dayEvents = events.filter((e) => e.date === dateStr);
    return { dayNumber, isCurrentMonth, dateStr, events: dayEvents };
  });
}

export function getWeekDays(allDays: CalendarDayCell[], weekIndex: number): CalendarDayCell[] {
  const boundedIndex = Math.max(0, Math.min(weekIndex, TOTAL_WEEKS - 1));
  const start = boundedIndex * 7;
  return allDays.slice(start, start + 7);
}

const MONTH_NAMES: Record<string, string> = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "Mei",
  "06": "Jun",
  "07": "Jul",
  "08": "Agu",
  "09": "Sep",
  "10": "Okt",
  "11": "Nov",
  "12": "Des",
};

function formatMonth(monthKey: string | undefined): string {
  if (!monthKey) return "Okt";
  return MONTH_NAMES[monthKey] ?? monthKey;
}

export function getWeekRangeLabel(weekDays: CalendarDayCell[]): string {
  const first = weekDays[0];
  const last = weekDays[weekDays.length - 1];
  if (!first || !last) return "";

  const firstParts = first.dateStr.split("-");
  const lastParts = last.dateStr.split("-");
  const firstMonth = firstParts[1];
  const lastMonth = lastParts[1];
  const lastYear = lastParts[0] ?? "2026";

  if (firstMonth && lastMonth && firstMonth !== lastMonth) {
    return `${first.dayNumber} ${formatMonth(firstMonth)} - ${last.dayNumber} ${formatMonth(lastMonth)} ${lastYear}`;
  }

  return `${first.dayNumber} - ${last.dayNumber} ${formatMonth(lastMonth)} ${lastYear}`;
}
