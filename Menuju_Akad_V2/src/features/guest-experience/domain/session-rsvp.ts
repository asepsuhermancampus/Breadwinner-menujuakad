import type { RsvpSession, SessionValidation } from "../types/experience";

// Per-sesion RSVP rules per Batch 05 contract frame 61:
// decline forces pax 0; pax must be a positive integer when attending; deadline and
// per-session quota are re-checked at save time by the (future) server adapter.
export const RSVP_DEADLINE_ISO = "2027-02-07T23:59:00+07:00";

export function validateSessionRsvp(sessions: RsvpSession[], nowIso: string): SessionValidation {
  if (new Date(nowIso).getTime() > new Date(RSVP_DEADLINE_ISO).getTime()) {
    return { ok: false, reason: "deadline" };
  }
  for (const s of sessions) {
    if (s.status === "DECLINED") {
      if (s.pax !== 0) return { ok: false, reason: "invalid" };
      continue;
    }
    if (!Number.isInteger(s.pax) || s.pax < 1 || s.pax > s.maxQuota) {
      return { ok: false, reason: "quota" };
    }
  }
  return { ok: true };
}

export function uniquePeopleNote(sessions: RsvpSession[]): string {
  const totalPax = sessions.reduce((sum, s) => sum + s.pax, 0);
  return `${totalPax} pax lintas sesi — bukan jumlah orang unik; satu orang yang hadir di Akad dan Resepsi tetap satu tamu.`;
}
