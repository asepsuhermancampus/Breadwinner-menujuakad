import { describe, expect, it } from "vitest";
import { formatRupiah, formatRupiahInput, parseRupiahInput } from "./rupiah";

describe("whole rupiah input", () => {
  it("formats exact integer amounts and groups digits as users type", () => {
    expect(formatRupiah(1234567)).toBe("Rp 1.234.567");
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiahInput("1234567")).toBe("1.234.567");
    expect(formatRupiahInput("1.234.567")).toBe("1.234.567");
    expect(parseRupiahInput("1.234.567")).toBe(1234567);
    expect(parseRupiahInput("1234567")).toBe(1234567);
    expect(parseRupiahInput("0")).toBe(0);
  });
  it.each([
    "",
    " ",
    "1,000",
    "1,50",
    "1.50",
    "1.000,50",
    "1,000.50",
    "-100",
    "+100",
    "1e6",
    "Rp 1000",
    "12 000",
    "1.2345",
    "9007199254740992",
    "Infinity",
  ])("rejects ambiguous or unsafe amount %j", (value) => {
    expect(parseRupiahInput(value)).toBeNaN();
    expect(formatRupiahInput(value)).toBe(value);
  });
  it("keeps the largest safe integer exact", () => {
    expect(parseRupiahInput(formatRupiahInput(String(Number.MAX_SAFE_INTEGER)))).toBe(
      Number.MAX_SAFE_INTEGER,
    );
  });
});
