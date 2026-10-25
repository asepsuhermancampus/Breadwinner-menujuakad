import { describe, expect, it } from "vitest";
import { calculateGuestMetrics } from "./guest-filter";
import type { GuestInvitation } from "../types/guest";
import { initialGuestCrmFixture } from "@/preview/fixtures/guest-crm";

describe("guest-metrics utils", () => {
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
});
