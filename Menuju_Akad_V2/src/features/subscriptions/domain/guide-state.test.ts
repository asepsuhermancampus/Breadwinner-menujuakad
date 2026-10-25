import { expect, it } from "vitest";
import { advanceNotice } from "./guide-state";
it("advances idempotently, clamps back, and completes at the end", () => {
  const initial = {
    grantId: "g",
    capabilities: ["studio", "pdf"] as const,
    state: "new" as const,
    step: 0,
  };
  const started = advanceNotice(initial, "start", 0);
  expect(started.state).toBe("started");
  const next = advanceNotice(started, "next", 0);
  expect(next.step).toBe(1);
  expect(advanceNotice(next, "next", 0)).toEqual(next);
  expect(advanceNotice(next, "next", 1).state).toBe("completed");
  expect(advanceNotice(started, "back", 0).step).toBe(0);
  expect(advanceNotice(started, "dismiss", 0).state).toBe("dismissed");
});
