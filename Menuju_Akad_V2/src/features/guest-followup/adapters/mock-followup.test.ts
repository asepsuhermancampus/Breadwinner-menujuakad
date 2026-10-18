import { describe, expect, it } from "vitest";
import { followUpGuests } from "../content/followup-content";
import { createMockFollowUpAdapter } from "./mock-followup";

describe("mock follow-up dispatch", () => {
  it("rechecks current data after the review selection was made", () => {
    const adapter = createMockFollowUpAdapter();
    const selectedIds = ["fu-1", "fu-2", "fu-3", "fu-4"];
    const latestGuests = followUpGuests.map((guest, index) => ({
      ...guest,
      ...(index === 0 ? { consent: "Dicabut" as const } : {}),
      ...(index === 1 ? { rsvpStatus: "ATTENDING" as const } : {}),
      ...(index === 2 ? { contactPhone: "invalid" } : {}),
      ...(index === 3 ? { lastSentAt: "2026-10-24T10:00:00+07:00" } : {}),
    }));

    const result = adapter.dispatch("campaign-a", selectedIds, latestGuests);

    expect(result.queuedIds).toEqual([]);
    expect(result.excluded.map((item) => item.code)).toEqual([
      "consent",
      "answered",
      "phone",
      "cooldown",
    ]);
  });

  it("queues only the explicitly selected guests and prevents campaign retries", () => {
    const adapter = createMockFollowUpAdapter();
    expect(adapter.dispatch("campaign-a", ["fu-1", "fu-4"], followUpGuests).queuedIds).toEqual([
      "fu-1",
      "fu-4",
    ]);
    const retry = adapter.dispatch("campaign-a", ["fu-1", "fu-4"], followUpGuests);
    expect(retry.queuedIds).toEqual([]);
    expect(retry.excluded.map((item) => item.code)).toEqual(["duplicate", "duplicate"]);
    expect(adapter.dispatch("campaign-b", ["fu-1"], followUpGuests).queuedIds).toEqual(["fu-1"]);
  });

  it("deduplicates duplicate IDs and normalized phone recipients in one campaign", () => {
    const adapter = createMockFollowUpAdapter();
    const guests = [
      followUpGuests[0]!,
      { ...followUpGuests[1]!, contactPhone: "+62 812-3456-7801" },
    ];
    const result = adapter.dispatch("campaign-a", ["fu-1", "fu-1", "fu-2"], guests);
    expect(result.queuedIds).toEqual(["fu-1"]);
    expect(result.excluded.map((item) => item.code)).toEqual(["duplicate", "duplicate"]);
  });

  it("excludes recipients no longer present in the latest snapshot", () => {
    const result = createMockFollowUpAdapter().dispatch("campaign-a", ["removed"], []);
    expect(result.queuedIds).toEqual([]);
    expect(result.excluded).toMatchObject([{ id: "removed", code: "missing" }]);
  });

  it("does not send twice when a queued guest changes their phone number", () => {
    const adapter = createMockFollowUpAdapter();
    adapter.dispatch("campaign-a", ["fu-1"], followUpGuests);
    const latest = [{ ...followUpGuests[0]!, contactPhone: "+6281234567899" }];
    const result = adapter.dispatch("campaign-a", ["fu-1"], latest);
    expect(result.queuedIds).toEqual([]);
    expect(result.excluded).toMatchObject([{ code: "duplicate" }]);
  });

  it("uses an injected clock instead of the device date", () => {
    const adapter = createMockFollowUpAdapter(() => new Date("2026-10-19T10:00:00+07:00"));
    const result = adapter.dispatch("campaign-a", ["fu-1"], followUpGuests);
    expect(result.queuedIds).toEqual([]);
    expect(result.excluded).toMatchObject([{ code: "cooldown" }]);
  });
});
