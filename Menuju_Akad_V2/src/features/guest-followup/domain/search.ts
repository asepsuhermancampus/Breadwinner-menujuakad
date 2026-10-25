import type { FollowUpGuest } from "../types/followup";

export function filterFollowUpGuests(guests: FollowUpGuest[], query: string): FollowUpGuest[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return guests;
  return guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(normalized) ||
      guest.category.toLowerCase().includes(normalized),
  );
}
