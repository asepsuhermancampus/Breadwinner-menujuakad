import { describe, expect, it } from "vitest";
import { canUpdateGuestQuota } from "./guest-filter";
import type { GuestInvitation } from "../types/guest";

describe("guest-quota validation utils", () => {
  it("prevents decreasing quota below confirmed attendingCount", () => {
    const guest: GuestInvitation = {
      id: "1",
      name: "Budi Santoso",
      group: "Keluarga Andi",
      quota: 3,
      rsvpStatus: "ATTENDING",
      attendingCount: 2,
      waConsent: true,
      personalToken: "tok1",
    };

    expect(canUpdateGuestQuota(guest, 2)).toEqual({ allowed: true, minQuota: 2 });
    expect(canUpdateGuestQuota(guest, 3)).toEqual({ allowed: true, minQuota: 2 });
    const invalidResult = canUpdateGuestQuota(guest, 1);
    expect(invalidResult.allowed).toBe(false);
    if (!invalidResult.allowed) {
      expect(invalidResult.error).toBeDefined();
    }
  });

  it("allows quota change down to 1 for pending or declined guests", () => {
    const pendingGuest: GuestInvitation = {
      id: "2",
      name: "Siti",
      group: "Teman",
      quota: 3,
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: true,
      personalToken: "tok2",
    };

    expect(canUpdateGuestQuota(pendingGuest, 1)).toEqual({ allowed: true, minQuota: 1 });
    expect(canUpdateGuestQuota(pendingGuest, 0).allowed).toBe(false);
  });

  it("rejects NaN, Infinity, fractions, zero, and negative values at mutation boundary", () => {
    const guest: GuestInvitation = {
      id: "1",
      name: "Budi Santoso",
      group: "Keluarga Andi",
      quota: 3,
      rsvpStatus: "ATTENDING",
      attendingCount: 2,
      waConsent: true,
      personalToken: "tok1",
    };

    expect(canUpdateGuestQuota(guest, Number.NaN)).toEqual({
      allowed: false,
      minQuota: 2,
      error: "Jumlah kuota harus berupa bilangan bulat positif.",
    });
    expect(canUpdateGuestQuota(guest, Number.POSITIVE_INFINITY).allowed).toBe(false);
    expect(canUpdateGuestQuota(guest, Number.NEGATIVE_INFINITY).allowed).toBe(false);
    expect(canUpdateGuestQuota(guest, 2.5)).toEqual({
      allowed: false,
      minQuota: 2,
      error: "Jumlah kuota harus berupa bilangan bulat positif.",
    });
    expect(canUpdateGuestQuota(guest, 0).allowed).toBe(false);
    expect(canUpdateGuestQuota(guest, -1).allowed).toBe(false);
  });

  it("returns discriminated failure outcome with meaningful error message for disallowed quota mutations", () => {
    const guest: GuestInvitation = {
      id: "1",
      name: "Budi Santoso",
      group: "Keluarga Andi",
      quota: 3,
      rsvpStatus: "ATTENDING",
      attendingCount: 2,
      waConsent: true,
      personalToken: "tok1",
    };

    const result = canUpdateGuestQuota(guest, 1);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(typeof result.error).toBe("string");
      expect(result.error.length).toBeGreaterThan(0);
      expect(result.error).toContain("2 orang");
    }
  });
});
