import type { GuestInvitation, GuestGroup } from "@/features/guest-crm/types/guest";
import type { DonutSlice } from "@/components/ui/reui-capital-inflows-types";
import { guestGroupLabel } from "@/features/guest-crm/utils/guest-groups";
import type { SideNames } from "./side-profile-names";

export type GuestCategorization = {
  totalInvitations: number;
  totalQuota: number;
  attendingInvitations: number;
  attendingPax: number;
  pendingInvitations: number;
  pendingPax: number;
  declinedInvitations: number;
  declinedPax: number;
  vipInvitations: number;
  responseRate: number;
  attendingRate: number;
};

export function categorizeGuests(guests: GuestInvitation[]): GuestCategorization {
  const active = guests.filter((g) => !g.isArchived);
  let totalQuota = 0, attendingInvitations = 0, attendingPax = 0;
  let pendingInvitations = 0, pendingPax = 0, declinedInvitations = 0;
  let declinedPax = 0, vipInvitations = 0;

  for (const g of active) {
    const q = Math.max(1, g.quota);
    totalQuota += q;
    if (g.group === "VIP") vipInvitations += 1;
    if (g.rsvpStatus === "ATTENDING") {
      attendingInvitations += 1;
      attendingPax += Math.max(1, g.attendingCount || q);
    } else if (g.rsvpStatus === "DECLINED") {
      declinedInvitations += 1;
      declinedPax += q;
    } else {
      pendingInvitations += 1;
      pendingPax += q;
    }
  }

  const answered = attendingInvitations + declinedInvitations;
  const responseRate = active.length > 0 ? Math.round((answered / active.length) * 100) : 0;
  const attendingRate = totalQuota > 0 ? Math.round((attendingPax / totalQuota) * 100) : 0;

  return {
    totalInvitations: active.length, totalQuota, attendingInvitations, attendingPax,
    pendingInvitations, pendingPax, declinedInvitations, declinedPax,
    vipInvitations, responseRate, attendingRate,
  };
}

export function buildOverviewGuestRsvpSlices(c: GuestCategorization): {
  slices: DonutSlice[];
  centerValue: string;
  centerLabel: string;
} {
  const slices: DonutSlice[] = [];
  const total = c.totalQuota;
  if (total <= 0) {
    return { slices: [], centerValue: "0%", centerLabel: "Pasti Hadir" };
  }

  const attendingPercent = Math.round((c.attendingPax / total) * 100);
  const pendingPercent = Math.round((c.pendingPax / total) * 100);
  const declinedPercent = Math.max(0, 100 - attendingPercent - pendingPercent);

  if (attendingPercent > 0) {
    slices.push({
      id: "attending", label: "Konfirmasi Hadir", percent: attendingPercent,
      amount: c.attendingPax, color: "#059669",
    });
  }
  if (pendingPercent > 0) {
    slices.push({
      id: "pending", label: "Menunggu Konfirmasi", percent: pendingPercent,
      amount: c.pendingPax, color: "#f59e0b",
    });
  }
  if (declinedPercent > 0) {
    slices.push({
      id: "declined", label: "Berhalangan Hadir", percent: declinedPercent,
      amount: c.declinedPax, color: "#ef4444",
    });
  }

  return { slices, centerValue: `${c.attendingRate}%`, centerLabel: "Pasti Hadir" };
}

export function buildOverviewGuestGroupSlices(
  guests: GuestInvitation[],
  names: SideNames,
): { slices: DonutSlice[]; centerValue: string | number; centerLabel: string } {
  const active = guests.filter((g) => !g.isArchived);
  const groupCounts: Record<GuestGroup, number> = {
    "Keluarga Andi": 0, "Keluarga Risa": 0, Teman: 0, Kolega: 0, Rekanan: 0, VIP: 0,
  };

  let totalPax = 0;
  for (const g of active) {
    const q = Math.max(1, g.quota);
    totalPax += q;
    if (g.group in groupCounts) groupCounts[g.group] += q;
  }

  const groupsDef = [
    { id: "groom-family", label: guestGroupLabel("Keluarga Andi", names), count: groupCounts["Keluarga Andi"], color: "#0284c7" },
    { id: "bride-family", label: guestGroupLabel("Keluarga Risa", names), count: groupCounts["Keluarga Risa"], color: "#ec4899" },
    { id: "vip", label: "Tamu VIP", count: groupCounts["VIP"], color: "#eab308" },
    { id: "friends", label: "Teman & Sahabat", count: groupCounts["Teman"], color: "#8b5cf6" },
    { id: "colleagues", label: "Kolega & Rekanan", count: groupCounts["Kolega"] + groupCounts["Rekanan"], color: "#0d9488" },
  ];

  const slices: DonutSlice[] = [];
  for (const g of groupsDef) {
    if (g.count > 0 && totalPax > 0) {
      slices.push({
        id: g.id, label: g.label, percent: Math.round((g.count / totalPax) * 100),
        amount: g.count, color: g.color,
      });
    }
  }

  return { slices, centerValue: active.length, centerLabel: "Undangan" };
}
