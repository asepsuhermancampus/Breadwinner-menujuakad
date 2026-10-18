import { describe, expect, it } from "vitest";
import { createSessionRsvpAdapter, validateSessionRsvp, uniquePeopleNote } from "./session-rsvp";
import type { RsvpSession } from "../types/experience";

function make(pax: number, status: RsvpSession["status"] = "ATTENDING", maxQuota = 2): RsvpSession {
  return { id: "akad", name: "Akad nikah", time: "08.00–09.00 WIB", maxQuota, status, pax };
}

const before = "2027-01-01T00:00:00+07:00";
const after = "2027-02-08T00:00:00+07:00";

describe("validateSessionRsvp", () => {
  it("accepts attending within quota before the deadline", () => {
    expect(validateSessionRsvp([make(2)], before).ok).toBe(true);
  });

  it("rejects pax above the per-session quota", () => {
    expect(validateSessionRsvp([make(3)], before)).toMatchObject({ ok: false, reason: "quota" });
  });

  it("rejects zero or negative pax while attending", () => {
    expect(validateSessionRsvp([make(0, "ATTENDING")], before).ok).toBe(false);
    expect(validateSessionRsvp([make(-1, "ATTENDING")], before).ok).toBe(false);
  });

  it("forces decline to zero pax and rejects decline with pax", () => {
    expect(validateSessionRsvp([make(0, "DECLINED")], before).ok).toBe(true);
    expect(validateSessionRsvp([make(1, "DECLINED")], before).ok).toBe(false);
  });

  it("enforces the 7 Feb 2027 23.59 WIB deadline", () => {
    expect(validateSessionRsvp([make(1)], after)).toMatchObject({ ok: false, reason: "deadline" });
  });

  it("does not present summed sessions as unique people", () => {
    const note = uniquePeopleNote([make(1), { ...make(2), id: "resepsi" }]);
    expect(note.startsWith("3 pax")).toBe(true);
  });
});

describe("authoritative mock session adapter", () => {
  it("does not trust a raised quota from the submitted draft", () => {
    const adapter = createSessionRsvpAdapter([make(1)]);
    expect(adapter.save([make(3, "ATTENDING", 99)], 1, before)).toMatchObject({
      ok: false,
      reason: "quota",
    });
    expect(adapter.read().sessions[0]!.pax).toBe(1);
  });
  it("rejects revoked permission and stale saves", () => {
    const adapter = createSessionRsvpAdapter([make(1)]);
    expect(adapter.save([make(2)], 1, before).ok).toBe(true);
    expect(adapter.save([make(1)], 1, before)).toMatchObject({ ok: false, reason: "stale" });
    adapter.revoke();
    expect(adapter.save([make(1)], 2, before)).toMatchObject({ ok: false, reason: "revoked" });
  });
  it("rejects missing, duplicate, and unknown sessions", () => {
    const adapter = createSessionRsvpAdapter([make(1)]);
    for (const draft of [[], [make(1), make(1)], [{ ...make(1), id: "other" }]]) {
      expect(adapter.save(draft, 1, before).ok).toBe(false);
    }
  });
  it("rejects invalid clocks rather than bypassing the deadline", () => {
    expect(validateSessionRsvp([make(1)], "invalid").ok).toBe(false);
  });
});
