import { expect, it } from "vitest";
import { analyticsCsv } from "./analytics-export";
import { analyticsFixture } from "../content/manager-content";

it("exports aggregate counts with raw numbers and no personal identifiers", () => {
  const csv = analyticsCsv(analyticsFixture);
  expect(csv).toContain("sessions;340;");
  expect(csv).toContain("online_answers;168;");
  expect(csv).not.toMatch(/token|Budi|\+628|contact/i);
});
