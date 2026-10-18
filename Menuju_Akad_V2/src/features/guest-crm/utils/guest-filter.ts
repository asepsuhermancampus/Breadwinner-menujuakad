import type { GuestInvitation } from "../types/guest";

export function normalizeE164(phone: string): { valid: boolean; normalized: string } {
  const clean = phone.trim().replace(/[\s-]/g, "");
  if (!clean) return { valid: false, normalized: "" };
  if (/^\+628[1-9][0-9]{7,11}$/.test(clean)) {
    return { valid: true, normalized: clean };
  }
  if (/^08[1-9][0-9]{7,11}$/.test(clean)) {
    return { valid: true, normalized: "+62" + clean.slice(1) };
  }
  if (/^628[1-9][0-9]{7,11}$/.test(clean)) {
    return { valid: true, normalized: "+" + clean };
  }
  return { valid: false, normalized: clean };
}

export function filterGuests(
  guests: GuestInvitation[],
  query: string,
  groupFilter: string,
  rsvpFilter: string,
): GuestInvitation[] {
  const q = query.trim().toLowerCase();
  return guests.filter((g) => {
    if (g.isArchived) return false;
    if (groupFilter !== "Semua grup" && g.group !== groupFilter) return false;
    if (rsvpFilter !== "Semua RSVP") {
      const match =
        (rsvpFilter === "Hadir" && g.rsvpStatus === "ATTENDING") ||
        (rsvpFilter === "Tidak Hadir" && g.rsvpStatus === "DECLINED") ||
        (rsvpFilter === "Belum Menjawab" && g.rsvpStatus === "PENDING");
      if (!match) return false;
    }
    if (!q) return true;
    return (
      g.name.toLowerCase().includes(q) ||
      (g.contactPhone && g.contactPhone.toLowerCase().includes(q)) ||
      g.group.toLowerCase().includes(q)
    );
  });
}

export function calculateGuestMetrics(guests: GuestInvitation[]) {
  const active = guests.filter((g) => !g.isArchived);
  let totalQuota = 0;
  let attendingInvitations = 0;
  let attendingPeople = 0;
  let declinedInvitations = 0;
  let pendingInvitations = 0;
  let waConsentCount = 0;
  let validPhoneCount = 0;

  for (const g of active) {
    totalQuota += g.quota;
    if (g.rsvpStatus === "ATTENDING") {
      attendingInvitations += 1;
      attendingPeople += g.attendingCount;
    } else if (g.rsvpStatus === "DECLINED") {
      declinedInvitations += 1;
    } else {
      pendingInvitations += 1;
    }
    if (g.waConsent) waConsentCount += 1;
    if (g.contactPhone && normalizeE164(g.contactPhone).valid) validPhoneCount += 1;
  }

  return {
    totalInvitations: active.length,
    totalQuota,
    attendingInvitations,
    attendingPeople,
    declinedInvitations,
    pendingInvitations,
    waConsentCount,
    validPhoneCount,
  };
}
