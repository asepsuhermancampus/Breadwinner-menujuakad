import { describe, expect, it } from "vitest";
import { normalizeE164, filterGuests } from "./guest-filter";
import type { GuestInvitation } from "../types/guest";

describe("guest-filter utils", () => {
  it("normalizes E.164 phone numbers correctly", () => {
    expect(normalizeE164("081234567890")).toEqual({ valid: true, normalized: "+6281234567890" });
    expect(normalizeE164("+6281234567890")).toEqual({ valid: true, normalized: "+6281234567890" });
    expect(normalizeE164("12345")).toEqual({ valid: false, normalized: "12345" });
    expect(normalizeE164("")).toEqual({ valid: false, normalized: "" });
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

  it("normalizes phone search matching between local 08 and +62 formats", () => {
    const guests: GuestInvitation[] = [
      {
        id: "g1",
        name: "Ahmad",
        group: "Teman",
        quota: 2,
        rsvpStatus: "PENDING",
        attendingCount: 0,
        waConsent: true,
        contactPhone: "+6281234567890",
        personalToken: "tok1",
      },
      {
        id: "g2",
        name: "Budi",
        group: "Kolega",
        quota: 2,
        rsvpStatus: "PENDING",
        attendingCount: 0,
        waConsent: true,
        contactPhone: "085611223344",
        personalToken: "tok2",
      },
    ];

    expect(filterGuests(guests, "081234567890", "Semua grup", "Semua RSVP")).toHaveLength(1);
    expect(filterGuests(guests, "0812", "Semua grup", "Semua RSVP")).toHaveLength(1);
    expect(filterGuests(guests, "+62812", "Semua grup", "Semua RSVP")).toHaveLength(1);
    expect(filterGuests(guests, "0812-3456", "Semua grup", "Semua RSVP")).toHaveLength(1);

    expect(filterGuests(guests, "+6285611223344", "Semua grup", "Semua RSVP")).toHaveLength(1);
    expect(filterGuests(guests, "+62856", "Semua grup", "Semua RSVP")).toHaveLength(1);
  });
});
