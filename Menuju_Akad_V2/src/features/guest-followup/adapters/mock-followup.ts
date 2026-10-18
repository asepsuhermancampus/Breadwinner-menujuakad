import { followUpSnapshotAt } from "../content/followup-content";
import { recheckEligibility } from "../domain/recheck";
import type { FollowUpDispatchResult, FollowUpGuest } from "../types/followup";

// This adapter only keeps a local simulation ledger; it never contacts a provider.
export function createMockFollowUpAdapter(clock: () => Date = () => new Date(followUpSnapshotAt)) {
  const queued = new Set<string>();

  return {
    dispatch(
      campaignId: string,
      recipientIds: readonly string[],
      latestGuests: readonly FollowUpGuest[],
    ): FollowUpDispatchResult {
      const result: FollowUpDispatchResult = { queuedIds: [], excluded: [] };
      const guests = new Map(latestGuests.map((guest) => [guest.id, guest]));
      const now = clock();

      for (const id of recipientIds) {
        const guest = guests.get(id);
        if (!guest) {
          result.excluded.push({
            id,
            name: "Tamu tidak tersedia",
            code: "missing",
            reason: "Tamu tidak ada pada data terbaru",
          });
          continue;
        }
        const eligibility = recheckEligibility(guest, now);
        if (!eligibility.eligible) {
          result.excluded.push({
            id,
            name: guest.name,
            code: eligibility.code,
            reason: eligibility.reason,
          });
          continue;
        }
        const guestKey = `${campaignId}:guest:${id}`;
        const phoneKey = `${campaignId}:phone:${eligibility.phone}`;
        if (queued.has(guestKey) || queued.has(phoneKey)) {
          result.excluded.push({
            id,
            name: guest.name,
            code: "duplicate",
            reason: "Penerima sudah masuk antrean kampanye ini",
          });
          continue;
        }
        queued.add(guestKey);
        queued.add(phoneKey);
        result.queuedIds.push(id);
      }
      return result;
    },
  };
}

// Shared for this preview page's lifetime, including switching CRM tabs.
export const followUpMockAdapter = createMockFollowUpAdapter();
