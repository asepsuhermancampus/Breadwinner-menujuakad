import { describe, expect, it } from "vitest";
import { recheckEligibility } from "./recheck";
import type { FollowUpGuest } from "../types/followup";

function make(consent: FollowUpGuest["consent"]): FollowUpGuest {
  return {
    id: "t",
    name: "T",
    category: "Teman",
    side: "Andi",
    quota: 1,
    lastWaDate: "18 Okt 2026",
    consent,
    selected: false,
  };
}

describe("recheckEligibility", () => {
  it("keeps guests with active consent who have not answered", () => {
    expect(recheckEligibility(make("Diberikan"), false)).toMatchObject({ eligible: true });
  });

  it("excludes guests who answered after the last campaign", () => {
    expect(recheckEligibility(make("Diberikan"), true)).toMatchObject({ eligible: false });
  });

  it("excludes missing or revoked consent", () => {
    expect(recheckEligibility(make("Tidak ada"), false).eligible).toBe(false);
    expect(recheckEligibility(make("Dicabut"), false).eligible).toBe(false);
  });
});
