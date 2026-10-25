import { describe, it, expect } from "vitest";
import {
  generateOctoberGrid,
  getWeekDays,
  getWeekRangeLabel,
  TOTAL_WEEKS,
  DEFAULT_WEEK_INDEX,
} from "./calendar-grid";
import type { CalendarEventItem } from "../types/calendar";

describe("calendar grid and week range logic", () => {
  const sampleEvents: CalendarEventItem[] = [
    {
      id: "evt-1",
      date: "2026-10-25",
      time: "10:00",
      title: "Fitting busana pengantin",
      venue: "Rumah Mode",
      pic: "Risa",
      type: "fitting",
    },
  ];

  it("builds 35 fixture days covering full month with padding", () => {
    const grid = generateOctoberGrid(sampleEvents);
    expect(grid).toHaveLength(35);
    expect(grid[0]?.dateStr).toBe("2026-09-28");
    expect(grid[34]?.dateStr).toBe("2026-11-01");
  });

  it("slices bounded 7-day weekly view around default week index 3", () => {
    const grid = generateOctoberGrid(sampleEvents);
    const currentWeek = getWeekDays(grid, DEFAULT_WEEK_INDEX);
    expect(currentWeek).toHaveLength(7);
    expect(currentWeek.some((d) => d.dateStr === "2026-10-25")).toBe(true);

    const clampedLower = getWeekDays(grid, -10);
    expect(clampedLower[0]?.dateStr).toBe("2026-09-28");

    const clampedUpper = getWeekDays(grid, 99);
    expect(clampedUpper[6]?.dateStr).toBe("2026-11-01");
  });

  it("formats readable range labels for weeks", () => {
    const grid = generateOctoberGrid(sampleEvents);
    const week0 = getWeekDays(grid, 0);
    expect(getWeekRangeLabel(week0)).toBe("28 Sep - 4 Okt 2026");

    const midWeek = getWeekDays(grid, DEFAULT_WEEK_INDEX);
    expect(getWeekRangeLabel(midWeek)).toBe("19 - 25 Okt 2026");

    const lastWeek = getWeekDays(grid, TOTAL_WEEKS - 1);
    expect(getWeekRangeLabel(lastWeek)).toBe("26 Okt - 1 Nov 2026");
  });
});
