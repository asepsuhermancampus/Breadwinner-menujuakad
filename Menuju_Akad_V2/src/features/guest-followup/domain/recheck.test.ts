import { describe, expect, it } from "vitest";
import { recheckEligibility } from "./recheck";
import type { FollowUpGuest } from "../types/followup";

const now = new Date("2026-10-25T10:00:00+07:00");

function make(overrides: Partial<FollowUpGuest> = {}): FollowUpGuest {
  return {
    id: "t",
    name: "T",
    category: "Teman",
    side: "Andi",
    quota: 1,
    lastWaDate: "18 Okt 2026",
    consent: "Diberikan",
    contactPhone: "081234567890",
    lastSentAt: "2026-10-18T10:00:00+07:00",
    rsvpStatus: "PENDING",
    selected: false,
    ...overrides,
  };
}

describe("recheckEligibility", () => {
  it("keeps guests with active consent who have not answered", () => {
    expect(recheckEligibility(make(), now)).toMatchObject({ eligible: true });
  });

  it("excludes guests who answered after the last campaign", () => {
    expect(recheckEligibility(make({ rsvpStatus: "ATTENDING" }), now).eligible).toBe(false);
    expect(recheckEligibility(make({ rsvpStatus: "DECLINED" }), now).eligible).toBe(false);
  });

  it("excludes missing or revoked consent", () => {
    expect(recheckEligibility(make({ consent: "Tidak ada" }), now).eligible).toBe(false);
    expect(recheckEligibility(make({ consent: "Dicabut" }), now).eligible).toBe(false);
  });

  it("rejects missing or invalid phone numbers", () => {
    for (const contactPhone of ["", "0812", "not-a-phone"]) {
      expect(recheckEligibility(make({ contactPhone }), now).eligible).toBe(false);
    }
  });

  it("enforces the seven-day boundary using the latest send timestamp", () => {
    expect(recheckEligibility(make(), now).eligible).toBe(true);
    expect(
      recheckEligibility(make({ lastSentAt: "2026-10-18T10:00:01+07:00" }), now).eligible,
    ).toBe(false);
  });

  it("fails closed for invalid or future send timestamps", () => {
    for (const lastSentAt of ["unknown", "2026-10-26T10:00:00+07:00"]) {
      expect(recheckEligibility(make({ lastSentAt }), now).eligible).toBe(false);
    }
  });
});
