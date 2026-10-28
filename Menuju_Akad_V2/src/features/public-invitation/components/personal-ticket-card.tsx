"use client";

import { useEffect, useState } from "react";
import type { PublicGuestInvitation } from "../types/invitation";

export function PersonalTicketCard({
  invitation,
  onClose,
}: {
  invitation: PublicGuestInvitation;
  onClose?: () => void;
}) {
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    let active = true;
    import("qrcode")
      .then((qr) =>
        qr.toDataURL(
          JSON.stringify({
            token: invitation.token,
            event: "Andi-Risa-2027",
            pax: invitation.attendingPax,
            table: invitation.tableNumber,
          }),
          { width: 200, margin: 1, color: { dark: "#1E3F32", light: "#FFFFFF" } },
        ),
      )
      .then((url) => {
        if (active) setQrUrl(url);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [invitation.token, invitation.attendingPax, invitation.tableNumber]);

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 shadow-sm space-y-4 text-center">
      <div className="text-xs font-semibold text-success bg-success-bg py-1 px-3 rounded-full inline-block">
        ✓ Jawaban tersimpan · hadir {invitation.attendingPax} orang
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-widest text-muted">Sampai Bertemu!</div>
        <h3 className="font-serif text-2xl font-bold text-brand-secondary mt-0.5">Andi & Risa</h3>
        <p className="text-xs text-secondary mt-0.5">{invitation.eventDateText}</p>
      </div>

      <div className="p-4 bg-canvas rounded-xl border border-border flex flex-col items-center justify-center space-y-2">
        <div className="text-[10px] font-bold tracking-wider text-muted uppercase">
          QR DEMO · VALIDASI HARI-H
        </div>
        <div className="size-40 bg-white p-2 rounded-lg border border-border flex items-center justify-center">
          {qrUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrUrl} alt="QR Tiket Masuk Personal" className="size-full" />
          ) : (
            <span className="text-xs text-secondary">Menyiapkan QR…</span>
          )}
        </div>
        <div className="font-bold text-sm text-foreground">{invitation.guestName}</div>
        <div className="text-xs text-secondary">
          {invitation.attendingPax} orang · Meja {invitation.tableNumber} ·{" "}
          {invitation.tableCategory}
        </div>
        <div className="text-[11px] text-muted">{invitation.venueText}</div>
      </div>

      <p className="text-[11px] text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
        Simpan tangkapan layar ini untuk rombongan Anda. Jangan bagikan QR ke publik; petugas
        gerbang akan mencatat jumlah orang yang benar-benar tiba di lokasi acara.
      </p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-brand-secondary hover:underline block mx-auto pt-1"
        >
          ← Kembali ke Undangan
        </button>
      )}
    </div>
  );
}
