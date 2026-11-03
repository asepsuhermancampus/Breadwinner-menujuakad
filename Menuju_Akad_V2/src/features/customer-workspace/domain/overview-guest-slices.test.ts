import { describe, it, expect } from "vitest";
import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import {
  categorizeGuests,
  buildOverviewGuestRsvpSlices,
  buildOverviewGuestGroupSlices,
} from "./overview-guest-slices";

const sampleGuests: GuestInvitation[] = [
  {
    id: "g1",
    name: "Budi Santoso",
    group: "Keluarga Andi",
    quota: 2,
    rsvpStatus: "ATTENDING",
    attendingCount: 2,
    waConsent: true,
    personalToken: "tok-1",
  },
  {
    id: "g2",
    name: "Dewi Lestari",
    group: "Keluarga Risa",
    quota: 3,
    rsvpStatus: "PENDING",
    attendingCount: 0,
    waConsent: true,
    personalToken: "tok-2",
  },
  {
    id: "g3",
    name: "Ahmad Dahlan",
    group: "VIP",
    quota: 1,
    rsvpStatus: "ATTENDING",
    attendingCount: 1,
    waConsent: false,
    personalToken: "tok-3",
  },
  {
    id: "g4",
    name: "Rudi Hartono",
    group: "Teman",
    quota: 2,
    rsvpStatus: "DECLINED",
    attendingCount: 0,
    waConsent: true,
    personalToken: "tok-4",
  },
  {
    id: "g5",
    name: "Arsip Tamu",
    group: "Kolega",
    quota: 2,
    rsvpStatus: "ATTENDING",
    attendingCount: 2,
    waConsent: false,
    personalToken: "tok-5",
    isArchived: true,
  },
];

describe("categorizeGuests", () => {
  it("handles empty guest list correctly", () => {
    const c = categorizeGuests([]);
    expect(c.totalInvitations).toBe(0);
    expect(c.totalQuota).toBe(0);
    expect(c.attendingPax).toBe(0);
    expect(c.attendingRate).toBe(0);
    expect(c.responseRate).toBe(0);
  });

  it("calculates active invitations, pax counts and rates properly", () => {
    const c = categorizeGuests(sampleGuests);
    expect(c.totalInvitations).toBe(4);
    expect(c.totalQuota).toBe(8);
    expect(c.attendingInvitations).toBe(2);
    expect(c.attendingPax).toBe(3);
    expect(c.pendingInvitations).toBe(1);
    expect(c.pendingPax).toBe(3);
    expect(c.declinedInvitations).toBe(1);
    expect(c.declinedPax).toBe(2);
    expect(c.vipInvitations).toBe(1);
    expect(c.responseRate).toBe(75);
    expect(c.attendingRate).toBe(38);
  });
});

describe("buildOverviewGuestRsvpSlices", () => {
  it("generates rsvp slices matching categories", () => {
    const c = categorizeGuests(sampleGuests);
    const { slices, centerValue, centerLabel } = buildOverviewGuestRsvpSlices(c);
    expect(slices).toHaveLength(3);
    expect(slices[0]?.id).toBe("attending");
    expect(slices[0]?.amount).toBe(3);
    expect(centerValue).toBe("38%");
    expect(centerLabel).toBe("Pasti Hadir");
  });
});

describe("buildOverviewGuestGroupSlices", () => {
  it("uses custom side names for family groups", () => {
    const names = { groom: "Herman", bride: "Latifah" };
    const { slices, centerValue, centerLabel } = buildOverviewGuestGroupSlices(
      sampleGuests,
      names,
    );
    expect(slices.length).toBeGreaterThan(0);
    expect(slices[0]?.label).toBe("Keluarga Herman");
    expect(slices[1]?.label).toBe("Keluarga Latifah");
    expect(centerValue).toBe(4);
    expect(centerLabel).toBe("Undangan");
  });
});
