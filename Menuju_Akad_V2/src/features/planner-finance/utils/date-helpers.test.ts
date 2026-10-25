import { describe, expect, it } from "vitest";
import { parseIndonesianDate } from "./date-helpers";

describe("parseIndonesianDate & chronological sorting stability", () => {
  it("parses ISO 8601 YYYY-MM-DD dates to UTC timestamp", () => {
    const ts = parseIndonesianDate("2026-09-25");
    expect(ts).toBe(Date.UTC(2026, 8, 25));
  });

  it("parses Indonesian date string with short and full month names", () => {
    const oktShort = parseIndonesianDate("24 Okt 2026");
    const oktFull = parseIndonesianDate("24 Oktober 2026");
    expect(oktShort).toBe(Date.UTC(2026, 9, 24));
    expect(oktFull).toBe(Date.UTC(2026, 9, 24));

    const sepShort = parseIndonesianDate("20 Sep 2026");
    expect(sepShort).toBe(Date.UTC(2026, 8, 20));
  });

  it("orders Indonesian date items chronologically and remains stable on equal dates", () => {
    const items = [
      { id: "c", date: "25 Okt 2026" },
      { id: "a", date: "20 Sep 2026" },
      { id: "b", date: "05 Okt 2026" },
      { id: "d", date: "25 Okt 2026" },
    ];

    const sorted = [...items].sort((x, y) => {
      const diff = parseIndonesianDate(x.date) - parseIndonesianDate(y.date);
      if (diff !== 0) return diff;
      return x.id.localeCompare(y.id);
    });

    expect(sorted.map((i) => i.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("returns 0 gracefully on invalid or empty date strings", () => {
    expect(parseIndonesianDate("")).toBe(0);
    expect(parseIndonesianDate("32 Okt 2026")).toBe(0);
    expect(parseIndonesianDate("29 Feb 2026")).toBe(0);
    expect(parseIndonesianDate("29 Feb 2024")).toBe(Date.UTC(2024, 1, 29));
    expect(parseIndonesianDate("31 Apr 2026")).toBe(0);
  });
});
