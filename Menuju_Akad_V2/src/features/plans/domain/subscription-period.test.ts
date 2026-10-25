import { expect, it } from "vitest";
import { addCalendarMonths } from "./subscription-period";

it("clamps six calendar months to valid month ends and leap years", () => {
  expect(addCalendarMonths("2026-08-31T12:00:00Z", 6)).toBe("2027-02-28T12:00:00.000Z");
  expect(addCalendarMonths("2023-08-31T12:00:00Z", 6)).toBe("2024-02-29T12:00:00.000Z");
  expect(addCalendarMonths("2026-10-21T00:00:00Z", 6)).toBe("2027-04-21T00:00:00.000Z");
  expect(() => addCalendarMonths("invalid", 6)).toThrow();
});
