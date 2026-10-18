import { describe, expect, it } from "vitest";
import { normalizeE164, filterGuests, calculateGuestMetrics } from "./guest-filter";
import type { GuestInvitation } from "../types/guest";
import { initialGuestCrmFixture } from "@/preview/fixtures/guest-crm";

describe("guest-filter utils", () => {
  it("fixture matches exact prompt arithmetic numbers", () => {
    const m = calculateGuestMetrics(initialGuestCrmFixture);
    expect(m.totalInvitations).toBe(350);
    expect(m.totalQuota).toBe(600);
    expect(m.attendingInvitations).toBe(170);
    expect(m.attendingPeople).toBe(340);
    expect(m.declinedInvitations).toBe(30);
    expect(m.pendingInvitations).toBe(150);
    expect(m.waConsentCount).toBe(240);
    expect(m.validPhoneCount).toBe(330);
  });
  it("normalizes E.164 phone numbers correctly", () => {
    expect(normalizeE164("081234567890")).toEqual({ valid: true, normalized: "+6281234567890" });
    expect(normalizeE164("+6281234567890")).toEqual({ valid: true, normalized: "+6281234567890" });
    expect(normalizeE164("12345")).toEqual({ valid: false, normalized: "12345" });
    expect(normalizeE164("")).toEqual({ valid: false, normalized: "" });
  });

  it("calculates guest metrics accurately without confusing invitation count with people count", () => {
    const guests: GuestInvitation[] = [
      {
        id: "1",
        name: "Budi Santoso",
        group: "Keluarga Andi",
        quota: 2,
        rsvpStatus: "ATTENDING",
        attendingCount: 2,
        waConsent: true,
        personalToken: "tok1",
      },
      {
        id: "2",
        name: "Dewi Anggraini",
        group: "Teman",
        quota: 1,
        rsvpStatus: "ATTENDING",
        attendingCount: 1,
        waConsent: true,
        contactPhone: "081234567891",
        personalToken: "tok2",
      },
      {
        id: "3",
        name: "Reza",
        group: "Kolega",
        quota: 2,
        rsvpStatus: "DECLINED",
        attendingCount: 0,
        waConsent: false,
        personalToken: "tok3",
      },
      {
        id: "4",
        name: "Siti",
        group: "Keluarga Risa",
        quota: 3,
        rsvpStatus: "PENDING",
        attendingCount: 0,
        waConsent: false,
        personalToken: "tok4",
      },
    ];

    const metrics = calculateGuestMetrics(guests);
    expect(metrics.totalInvitations).toBe(4);
    expect(metrics.totalQuota).toBe(8);
    expect(metrics.attendingInvitations).toBe(2);
    expect(metrics.attendingPeople).toBe(3);
    expect(metrics.declinedInvitations).toBe(1);
    expect(metrics.pendingInvitations).toBe(1);
    expect(metrics.waConsentCount).toBe(2);
  });

  it("filters guests by search query and group/rsvp", () => {
    const guests: GuestInvitation[] = [
      {
        id: "1",
        name: "Budi Santoso",
        group: "Keluarga Andi",
        quota: 2,
        rsvpStatus: "ATTENDING",
        attendingCount: 2,
        waConsent: true,
        personalToken: "tok1",
      },
      {
        id: "2",
        name: "Dewi Anggraini",
        group: "Teman",
        quota: 1,
        rsvpStatus: "DECLINED",
        attendingCount: 0,
        waConsent: true,
        personalToken: "tok2",
      },
    ];

    expect(filterGuests(guests, "Budi", "Semua grup", "Semua RSVP")).toHaveLength(1);
    expect(filterGuests(guests, "", "Teman", "Semua RSVP")).toHaveLength(1);
    expect(filterGuests(guests, "", "Semua grup", "Hadir")).toHaveLength(1);
    expect(filterGuests(guests, "", "Semua grup", "Tidak Hadir")).toHaveLength(1);
  });
});
