import { describe, it, expect } from "vitest";
import { getTimeGreeting } from "./time-greeting";

describe("getTimeGreeting", () => {
  it("returns 'Selamat pagi' between 04:00 and 10:59 WIB", () => {
    // 04:00 WIB = 21:00 UTC previous day
    const morningStart = new Date("2026-11-04T04:00:00+07:00");
    const morningMid = new Date("2026-11-04T08:30:00+07:00");
    const morningEnd = new Date("2026-11-04T10:59:00+07:00");

    expect(getTimeGreeting(morningStart)).toBe("Selamat pagi");
    expect(getTimeGreeting(morningMid)).toBe("Selamat pagi");
    expect(getTimeGreeting(morningEnd)).toBe("Selamat pagi");
  });

  it("returns 'Selamat siang' between 11:00 and 14:59 WIB", () => {
    const noonStart = new Date("2026-11-04T11:00:00+07:00");
    const noonMid = new Date("2026-11-04T13:15:00+07:00");
    const noonEnd = new Date("2026-11-04T14:59:00+07:00");

    expect(getTimeGreeting(noonStart)).toBe("Selamat siang");
    expect(getTimeGreeting(noonMid)).toBe("Selamat siang");
    expect(getTimeGreeting(noonEnd)).toBe("Selamat siang");
  });

  it("returns 'Selamat sore' between 15:00 and 18:29 WIB", () => {
    const afternoonStart = new Date("2026-11-04T15:00:00+07:00");
    const afternoonMid = new Date("2026-11-04T17:00:00+07:00");
    const afternoonEnd = new Date("2026-11-04T18:29:00+07:00");

    expect(getTimeGreeting(afternoonStart)).toBe("Selamat sore");
    expect(getTimeGreeting(afternoonMid)).toBe("Selamat sore");
    expect(getTimeGreeting(afternoonEnd)).toBe("Selamat sore");
  });

  it("returns 'Selamat malam' between 18:30 and 03:59 WIB", () => {
    const eveningStart = new Date("2026-11-04T18:30:00+07:00");
    const night = new Date("2026-11-04T22:00:00+07:00");
    const midnight = new Date("2026-11-04T00:00:00+07:00");
    const earlyMorning = new Date("2026-11-04T03:59:00+07:00");

    expect(getTimeGreeting(eveningStart)).toBe("Selamat malam");
    expect(getTimeGreeting(night)).toBe("Selamat malam");
    expect(getTimeGreeting(midnight)).toBe("Selamat malam");
    expect(getTimeGreeting(earlyMorning)).toBe("Selamat malam");
  });
});

