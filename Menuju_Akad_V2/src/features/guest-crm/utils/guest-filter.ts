import { guestGroupLabel } from "./guest-groups";
import {
  defaultSideNames,
  type SideNames,
} from "@/features/customer-workspace/domain/side-profile-names";
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

export function matchPhoneSearch(phone: string | undefined, query: string): boolean {
  if (!phone || !query) return false;
  const cleanPhone = phone.trim().replace(/[\s-]/g, "");
  const cleanQuery = query.trim().replace(/[\s-]/g, "");
  if (!cleanPhone || !cleanQuery) return false;

  if (
    phone.toLowerCase().includes(query.toLowerCase()) ||
    cleanPhone.toLowerCase().includes(cleanQuery.toLowerCase())
  ) {
    return true;
  }

  const phoneVariants: string[] = [cleanPhone];
  if (cleanPhone.startsWith("+62")) {
    const raw = cleanPhone.slice(3);
    phoneVariants.push("0" + raw, "62" + raw, raw);
  } else if (cleanPhone.startsWith("0")) {
    const raw = cleanPhone.slice(1);
    phoneVariants.push("+62" + raw, "62" + raw, raw);
  } else if (cleanPhone.startsWith("62")) {
    const raw = cleanPhone.slice(2);
    phoneVariants.push("+62" + raw, "0" + raw, raw);
  }

  const queryVariants: string[] = [cleanQuery];
  if (cleanQuery.startsWith("+62")) {
    const raw = cleanQuery.slice(3);
    queryVariants.push("0" + raw, "62" + raw, raw);
  } else if (cleanQuery.startsWith("0")) {
    const raw = cleanQuery.slice(1);
    queryVariants.push("+62" + raw, "62" + raw, raw);
  } else if (cleanQuery.startsWith("62")) {
    const raw = cleanQuery.slice(2);
    queryVariants.push("+62" + raw, "0" + raw, raw);
  }

  return phoneVariants.some((pv) =>
    queryVariants.some((qv) => qv && pv.toLowerCase().includes(qv.toLowerCase())),
  );
}

export type QuotaValidationResult =
  { allowed: true; minQuota: number } | { allowed: false; minQuota: number; error: string };

export function canUpdateGuestQuota(
  guest: GuestInvitation,
  newQuota: number,
): QuotaValidationResult {
  const minQuota = guest.rsvpStatus === "ATTENDING" ? Math.max(1, guest.attendingCount) : 1;
  if (
    typeof newQuota !== "number" ||
    !Number.isFinite(newQuota) ||
    !Number.isInteger(newQuota) ||
    newQuota <= 0
  ) {
    return {
      allowed: false,
      minQuota,
      error: "Jumlah kuota harus berupa bilangan bulat positif.",
    };
  }
  if (newQuota < minQuota) {
    return {
      allowed: false,
      minQuota,
      error: `Kuota tidak boleh kurang dari jumlah hadir terkonfirmasi (${minQuota} orang).`,
    };
  }
  return { allowed: true, minQuota };
}

export function filterGuests(
  guests: GuestInvitation[],
  query: string,
  groupFilter: string,
  rsvpFilter: string,
  names: SideNames = defaultSideNames,
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
      guestGroupLabel(g.group, names).toLowerCase().includes(q) ||
      matchPhoneSearch(g.contactPhone, query)
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
