import type { FollowUpGuest } from "../types/followup";

// Dispatch-time recheck per Batch 05 contract: consent + valid phone/latest answer + cooldown.
// A guest who answered or revoked consent after the last campaign is never included again.
export function recheckEligibility(
  guest: FollowUpGuest,
  answeredSince: boolean,
): { eligible: boolean; reason: string } {
  if (guest.consent !== "Diberikan")
    return { eligible: false, reason: "Izin WhatsApp tidak aktif" };
  if (answeredSince) return { eligible: false, reason: "Sudah menjawab setelah kampanye terakhir" };
  return { eligible: true, reason: "Memenuhi syarat" };
}
