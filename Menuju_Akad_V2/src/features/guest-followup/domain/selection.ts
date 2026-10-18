import type { FollowUpGuest } from "../types/followup";

export function toggleVisibleSelection(
  guests: readonly FollowUpGuest[],
  visibleIds: readonly string[],
): FollowUpGuest[] {
  const visible = new Set(visibleIds);
  const visibleGuests = guests.filter((guest) => visible.has(guest.id));
  const allSelected = visibleGuests.length > 0 && visibleGuests.every((guest) => guest.selected);
  return guests.map((guest) =>
    visible.has(guest.id) ? { ...guest, selected: !allSelected } : guest,
  );
}
