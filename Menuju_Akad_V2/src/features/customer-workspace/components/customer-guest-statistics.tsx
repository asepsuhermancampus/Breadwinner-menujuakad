"use client";

import type { GuestInvitation } from "@/features/guest-crm/types/guest";
import { DualGuestDonutCard } from "./dual-guest-donut-card";
import { GuestStatusScrollCard } from "./guest-status-scroll-card";
import {
  categorizeGuests,
  buildOverviewGuestRsvpSlices,
  buildOverviewGuestGroupSlices,
} from "../domain/overview-guest-slices";
import type { SideNames } from "../domain/side-profile-names";

export type CustomerGuestStatisticsProps = {
  guestData: GuestInvitation[];
  partnerNames?: { user: string; partner: string } | undefined;
  ownerSide?: "groom" | "bride" | undefined;
  guestsAvailable?: boolean | undefined;
};

export function CustomerGuestStatistics({
  guestData,
  partnerNames = { user: "Saya", partner: "Pasangan" },
  ownerSide = "groom",
  guestsAvailable = true,
}: CustomerGuestStatisticsProps) {
  // 1. Kategorisasi Tamu & Metrik RSVP
  const c = categorizeGuests(guestData);

  // 2. Format Side Names untuk Kelompok Keluarga
  const isBride = ownerSide === "bride";
  const names: SideNames = {
    groom: isBride ? partnerNames.partner : partnerNames.user,
    bride: isBride ? partnerNames.user : partnerNames.partner,
  };

  // 3. Irisan Donut Status RSVP
  const {
    slices: rsvpSlices,
    centerValue: rsvpCenterValue,
  } = buildOverviewGuestRsvpSlices(c);

  // 4. Irisan Donut Distribusi Kelompok
  const {
    slices: groupSlices,
    centerValue: groupCenterValue,
  } = buildOverviewGuestGroupSlices(guestData, names);

  const badgeText =
    c.totalInvitations > 0
      ? c.responseRate === 100
        ? "100% RSVP Masuk"
        : `${c.attendingRate}% Konfirmasi Hadir`
      : undefined;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
      <DualGuestDonutCard
        className="xl:col-span-2"
        categorization={c}
        rsvpSlices={rsvpSlices}
        rsvpCenterValue={rsvpCenterValue}
        groupSlices={groupSlices}
        groupCenterValue={groupCenterValue}
        badgeText={badgeText}
        manageHref={guestsAvailable ? "/planner/guests" : undefined}
      />
      <GuestStatusScrollCard
        className="xl:col-span-1"
        guests={guestData}
        guestsAvailable={guestsAvailable}
        manageHref={guestsAvailable ? "/planner/guests" : undefined}
        names={names}
      />
    </div>
  );
}
