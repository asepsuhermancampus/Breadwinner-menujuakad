import { describe, expect, it } from "vitest";
import { notificationLogs, operationsNow } from "../content/notifications";
import type { GateContext, NotificationLog } from "../types/operations";
import { inspectSameProvider, retryNotification } from "./dispatch";
const rendi = notificationLogs[0]!;
function context(log: NotificationLog): GateContext {
  return {
    role: "superadmin",
    action: "notifications.dispatch",
    scenario: "ready",
    expectedVersion: log.version,
    version: log.version,
  };
}
function retry(log = rendi, overrides: Partial<Parameters<typeof retryNotification>[0]> = {}) {
  return retryNotification({
    log,
    context: context(log),
    now: operationsNow,
    dispatchedKeys: [],
    reason: "Kegagalan definitif sudah diperiksa.",
    acknowledged: true,
    ...overrides,
  });
}
describe("dispatch rechecks the current notification object", () => {
  it("queues Rendi once without claiming delivery", () => {
    const first = retry();
    expect(first.ok).toBe(true);
    expect(first.log.status).toBe("queued");
    expect(first.dispatchedKeys).toEqual([rendi.campaignKey]);
    expect(retry(first.log, { dispatchedKeys: first.dispatchedKeys }).ok).toBe(false);
    expect(rendi.status).toBe("failed");
  });
  it.each(notificationLogs.slice(1))("never retries $id in $status", (log) => {
    expect(retry(log).ok).toBe(false);
  });
  it("checks the same provider source for an unknown result without a new intent", () => {
    const unknown = notificationLogs[2]!;
    const result = inspectSameProvider(unknown, context(unknown));
    expect(result.ok).toBe(true);
    expect(result.log.id).toBe(unknown.id);
    expect(result.log.campaignKey).toBe(unknown.campaignKey);
    expect(result.log.status).toBe("delivered");
  });
  it("rejects revoked consent even after a valid preview", () => {
    const result = retry({ ...rendi, consent: false });
    expect(result.ok).toBe(false);
    expect(result.log.status).toBe("canceled");
    expect(result.dispatchedKeys).toHaveLength(0);
  });
  it("honors current cooldown and campaign deduplication", () => {
    expect(retry({ ...rendi, templateValid: false }).ok).toBe(false);
    expect(retry({ ...rendi, cooldownUntil: operationsNow + 1 }).ok).toBe(false);
    expect(retry(rendi, { dispatchedKeys: [rendi.campaignKey] }).ok).toBe(false);
  });
  it.each(["offline", "revoked", "stale", "failure"] as const)(
    "does not mutate logs during %s",
    (scenario) => {
      const result = retry(rendi, { context: { ...context(rendi), scenario } });
      expect(result.ok).toBe(false);
      expect(result.log).toEqual(rendi);
      expect(result.dispatchedKeys).toHaveLength(0);
    },
  );
  it("rejects a stale version and support dispatch permission", () => {
    expect(retry(rendi, { context: { ...context(rendi), expectedVersion: 1 } }).ok).toBe(false);
    expect(retry(rendi, { context: { ...context(rendi), role: "support" } }).ok).toBe(false);
  });
});
