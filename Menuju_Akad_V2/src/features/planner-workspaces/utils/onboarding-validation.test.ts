import { describe, expect, it } from "vitest";
import type { OnboardingDraft } from "../contracts";
import { eventErrors, photoError, profileErrors, updateEvent } from "./onboarding-validation";

function draft(): OnboardingDraft {
  const person = { fullName: "Name", nickname: "N", father: "", mother: "", photoUrl: null };
  return {
    workspaceId: "a",
    actorId: "owner",
    version: 1,
    scope: "both",
    profile: { groom: { ...person }, bride: { ...person }, culture: "", actorRole: "bride" },
    events: {
      engagement: {
        id: "event-engagement",
        kind: "engagement",
        date: "2026-11-22",
        city: "Bandung",
        venue: "",
        address: "",
        budgetIdr: 15_000_000,
        guestEstimate: 50,
      },
      wedding: {
        id: "event-wedding",
        kind: "wedding",
        date: "2027-02-14",
        city: "Bandung",
        venue: "",
        address: "",
        budgetIdr: 150_000_000,
        guestEstimate: 500,
      },
    },
    invite: null,
    members: [],
  };
}

describe("onboarding boundaries", () => {
  it("keeps event IDs, dates and integer budgets separate", () => {
    const initial = draft();
    const changed = updateEvent(initial, "engagement", { budgetIdr: 20_000_000 });
    expect(changed.events.wedding).toEqual(initial.events.wedding);
    expect(changed.events.engagement.id).toBe("event-engagement");
    expect(eventErrors(changed)).toEqual({});
  });

  it("validates required profile names while allowing family data later", () => {
    const initial = draft();
    initial.profile.bride.fullName = " ";
    expect(profileErrors(initial)).toEqual({ "bride.fullName": "Nama wajib diisi." });
  });

  it("rejects impossible dates, merged event identities and fractional IDR", () => {
    const initial = draft();
    initial.events.engagement.date = "2026-02-30";
    initial.events.engagement.id = initial.events.wedding.id;
    initial.events.wedding.budgetIdr = 12.2;
    expect(eventErrors(initial)).toMatchObject({
      "engagement.date": expect.any(String),
      "wedding.budgetIdr": expect.any(String),
      eventId: expect.any(String),
    });
  });

  it("does not reject an inactive event or lose its draft values", () => {
    const initial = draft();
    initial.scope = "wedding";
    initial.events.engagement.date = "";
    expect(eventErrors(initial)).toEqual({});
    expect(initial.events.engagement.budgetIdr).toBe(15_000_000);
  });

  it("rejects unsupported, empty or oversized photo uploads", () => {
    expect(photoError({ size: 5, type: "text/html" })).toMatch("JPG");
    expect(photoError({ size: 0, type: "image/png" })).toMatch("kosong");
    expect(photoError({ size: 5 * 1024 * 1024 + 1, type: "image/jpeg" })).toMatch("5 MB");
    expect(photoError({ size: 5 * 1024 * 1024, type: "image/webp" })).toBeNull();
  });
});
