import type { RsvpSession, SessionValidation } from "../types/experience";

// Per-sesion RSVP rules per Batch 05 contract frame 61:
// decline forces pax 0; pax must be a positive integer when attending; deadline and
// per-session quota are re-checked at save time by the (future) server adapter.
export const RSVP_DEADLINE_ISO = "2027-02-07T23:59:00+07:00";

export function validateSessionRsvp(sessions: RsvpSession[], nowIso: string): SessionValidation {
  const now = new Date(nowIso).getTime();
  if (
    !Number.isFinite(now) ||
    !sessions.length ||
    new Set(sessions.map((s) => s.id)).size !== sessions.length
  ) {
    return { ok: false, reason: "invalid" };
  }
  if (now > new Date(RSVP_DEADLINE_ISO).getTime()) {
    return { ok: false, reason: "deadline" };
  }
  for (const s of sessions) {
    if (!["ATTENDING", "DECLINED"].includes(s.status)) return { ok: false, reason: "invalid" };
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

export function createSessionRsvpAdapter(initial: RsvpSession[]) {
  let current = initial.map((session) => ({ ...session }));
  let version = 1;
  let permitted = true;
  return {
    read: () => ({ sessions: current.map((session) => ({ ...session })), version }),
    revoke: () => {
      permitted = false;
    },
    save(draft: RsvpSession[], expectedVersion: number, nowIso: string): SessionValidation {
      if (!permitted) return { ok: false, reason: "revoked" };
      if (version !== expectedVersion) return { ok: false, reason: "stale" };
      if (
        draft.length !== current.length ||
        draft.some((session) => !current.some((saved) => saved.id === session.id))
      )
        return { ok: false, reason: "invalid" };
      const checked = draft.map((session) => ({
        ...current.find((saved) => saved.id === session.id)!,
        status: session.status,
        pax: session.pax,
      }));
      const result = validateSessionRsvp(checked, nowIso);
      if (!result.ok) return result;
      current = checked;
      version += 1;
      return { ok: true };
    },
  };
}

export function uniquePeopleNote(sessions: RsvpSession[]): string {
  const totalPax = sessions.reduce((sum, s) => sum + s.pax, 0);
  return `${totalPax} pax lintas sesi — bukan jumlah orang unik; satu orang yang hadir di Akad dan Resepsi tetap satu tamu.`;
}
