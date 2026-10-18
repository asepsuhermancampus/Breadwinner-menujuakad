import { normalizeE164 } from "@/features/guest-crm/utils/guest-filter";
import type { FollowUpExclusionCode, FollowUpGuest } from "../types/followup";

type Eligibility =
  | { eligible: true; phone: string; reason: string }
  | { eligible: false; code: FollowUpExclusionCode; reason: string };

export function recheckEligibility(guest: FollowUpGuest, now: Date): Eligibility {
  if (guest.consent !== "Diberikan")
    return { eligible: false, code: "consent", reason: "Izin WhatsApp tidak aktif" };
  if (guest.rsvpStatus !== "PENDING")
    return { eligible: false, code: "answered", reason: "Tamu sudah menjawab" };
  const phone = normalizeE164(guest.contactPhone);
  if (!phone.valid) return { eligible: false, code: "phone", reason: "Nomor WhatsApp tidak valid" };
  const lastSent = guest.lastSentAt === null ? null : new Date(guest.lastSentAt).getTime();
  if (
    !Number.isFinite(now.getTime()) ||
    (lastSent !== null &&
      (!Number.isFinite(lastSent) || now.getTime() - lastSent < 7 * 24 * 60 * 60 * 1000))
  )
    return {
      eligible: false,
      code: "cooldown",
      reason: "Jeda kirim minimal 7 hari belum terpenuhi",
    };
  return { eligible: true, phone: phone.normalized, reason: "Memenuhi syarat" };
}
