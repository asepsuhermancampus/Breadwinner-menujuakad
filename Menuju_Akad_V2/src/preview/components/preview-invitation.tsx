"use client";

import { PublicInvitationScreen } from "@/features/public-invitation/components/public-invitation-screen";
import type { PublicGuestInvitation } from "@/features/public-invitation/types/invitation";

export function PreviewPublicInvitation({ token }: { token?: string }) {
  // Check if token is valid or invalid/expired
  const isBudi = token === "token-budi-a7c6" || token === "a7c6" || token?.includes("a7c6");
  const isDewi = token === "token-dewi-b19d" || token === "b19d" || token?.includes("b19d");
  const isDemo = !token || token === "demo" || isBudi;

  const invitation: PublicGuestInvitation = isDewi
    ? {
        token: "token-dewi-b19d",
        guestName: "Dewi Anggraini",
        maxQuota: 1,
        rsvpStatus: "ATTENDING",
        attendingPax: 1,
        tableNumber: "07",
        tableCategory: "Reguler",
        notes: "Selamat untuk Andi & Risa!",
        rsvpDeadline: "7 Februari 2027, 23.59 WIB",
        eventDateText: "Minggu, 14 Februari 2027",
        venueText: "Bumi Samami, Bandung",
        isValid: true,
      }
    : isDemo
      ? {
          token: "token-budi-a7c6",
          guestName: "Budi Santoso & Partner",
          maxQuota: 2,
          rsvpStatus: "ATTENDING",
          attendingPax: 2,
          tableNumber: "04",
          tableCategory: "VIP",
          notes: "Insyaallah hadir. Terima kasih sudah mengundang kami!",
          rsvpDeadline: "7 Februari 2027, 23.59 WIB",
          eventDateText: "Minggu, 14 Februari 2027",
          venueText: "Bumi Samami, Bandung",
          isValid: true,
        }
      : {
          token: token || "",
          guestName: "",
          maxQuota: 0,
          rsvpStatus: "PENDING",
          attendingPax: 0,
          tableNumber: "",
          tableCategory: "",
          rsvpDeadline: "",
          eventDateText: "",
          venueText: "",
          isValid: false, // Triggers frame 50D (UnavailableLinkScreen)
        };

  return <PublicInvitationScreen initialInvitation={invitation} />;
}
