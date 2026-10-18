"use client";

import { useState } from "react";
import type { PublicGuestInvitation } from "../types/invitation";
import { UnavailableLinkScreen } from "./unavailable-link-screen";
import { RsvpDialog } from "./rsvp-dialog";
import { PersonalTicketCard } from "./personal-ticket-card";
import { Button } from "@/components/ui/button";

type Props = {
  initialInvitation: PublicGuestInvitation;
};

export function PublicInvitationScreen({ initialInvitation }: Props) {
  const [invitation, setInvitation] = useState<PublicGuestInvitation>(initialInvitation);
  const [showRsvp, setShowRsvp] = useState(false);
  const [showTicket, setShowTicket] = useState(false);

  if (!invitation.isValid) {
    return <UnavailableLinkScreen />;
  }

  function handleSaveRsvp(status: "ATTENDING" | "DECLINED", pax: number, notes: string) {
    setInvitation((prev) => ({
      ...prev,
      rsvpStatus: status,
      attendingPax: pax,
      notes,
    }));
  }

  return (
    <div className="min-h-screen bg-canvas text-foreground flex flex-col items-center py-6 px-4">
      <main className="w-full max-w-[420px] bg-surface rounded-3xl border border-border overflow-hidden shadow-sm flex flex-col">
        {/* Cover / Header */}
        <div className="p-8 text-center bg-gradient-to-b from-subtle to-surface border-b border-border space-y-3">
          <div className="text-[11px] font-semibold tracking-widest uppercase text-muted">
            The Wedding of
          </div>
          <h1 className="font-serif text-3xl font-bold text-primary tracking-tight">Andi & Risa</h1>
          <p className="text-xs text-secondary leading-relaxed px-4">
            Dengan penuh rasa syukur, kami mengundang Anda untuk merayakan awal perjalanan suci
            kami.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {showTicket ? (
            <PersonalTicketCard invitation={invitation} onClose={() => setShowTicket(false)} />
          ) : (
            <>
              {/* Event Schedule */}
              <div className="p-4 bg-canvas rounded-2xl border border-border space-y-3 text-center">
                <div className="text-xs font-bold text-primary tracking-wider uppercase">
                  {invitation.eventDateText}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-border">
                  <div>
                    <div className="text-secondary text-[11px]">Akad Nikah</div>
                    <div className="font-bold text-foreground mt-0.5">08.00 WIB</div>
                  </div>
                  <div>
                    <div className="text-secondary text-[11px]">Resepsi</div>
                    <div className="font-bold text-foreground mt-0.5">10.00–14.00 WIB</div>
                  </div>
                </div>
                <div className="text-xs text-secondary font-medium">{invitation.venueText}</div>
              </div>

              {/* Personal Guest Card */}
              <div className="p-5 bg-subtle rounded-2xl border border-border text-center space-y-3">
                <div className="text-[11px] uppercase tracking-wider text-muted">
                  Kepada Yang Kami Hormati
                </div>
                <div className="text-lg font-bold text-foreground">{invitation.guestName}</div>
                <div className="text-xs text-secondary">
                  Undangan maksimal <strong>{invitation.maxQuota} orang</strong> · Meja{" "}
                  {invitation.tableNumber} ({invitation.tableCategory})
                </div>

                <div className="pt-2">
                  {invitation.rsvpStatus === "ATTENDING" && (
                    <div className="inline-block px-3 py-1 bg-success-bg text-success text-xs font-bold rounded-full border border-success/30">
                      ✓ Dikonfirmasi Hadir · {invitation.attendingPax} orang
                    </div>
                  )}
                  {invitation.rsvpStatus === "DECLINED" && (
                    <div className="inline-block px-3 py-1 bg-danger-bg text-danger text-xs font-bold rounded-full border border-danger/30">
                      Berhalangan Hadir
                    </div>
                  )}
                  {invitation.rsvpStatus === "PENDING" && (
                    <div className="inline-block px-3 py-1 bg-warning-bg text-warning text-xs font-bold rounded-full border border-warning/30">
                      Menunggu Konfirmasi
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button variant="primary" className="w-full" onClick={() => setShowRsvp(true)}>
                  {invitation.rsvpStatus === "PENDING"
                    ? "Konfirmasi Kehadiran (RSVP)"
                    : "Ubah Konfirmasi Kehadiran"}
                </Button>
                {invitation.rsvpStatus === "ATTENDING" && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setShowTicket(true)}
                  >
                    Lihat Tiket Masuk Personal (QR)
                  </Button>
                )}
              </div>

              <p className="text-[11px] text-muted text-center leading-relaxed">
                RSVP dapat diubah hingga <strong>{invitation.rsvpDeadline}</strong>. Anda tidak
                perlu membuat akun untuk mengisi atau melihat tiket.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-subtle text-center text-[11px] text-muted border-t border-border">
          Menuju Akad · Platform Pernikahan Terkurasi
        </div>
      </main>

      <RsvpDialog
        open={showRsvp}
        onClose={() => setShowRsvp(false)}
        invitation={invitation}
        onSaveRsvp={handleSaveRsvp}
      />
    </div>
  );
}
