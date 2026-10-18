"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PublicGuestInvitation } from "../types/invitation";

type Props = {
  open: boolean;
  onClose: () => void;
  invitation: PublicGuestInvitation;
  onSaveRsvp: (status: "ATTENDING" | "DECLINED", pax: number, notes: string) => void;
};

export function RsvpDialog({ open, onClose, invitation, onSaveRsvp }: Props) {
  const [status, setStatus] = useState<"ATTENDING" | "DECLINED">(
    invitation.rsvpStatus === "DECLINED" ? "DECLINED" : "ATTENDING",
  );
  const [pax, setPax] = useState(
    invitation.attendingPax > 0 ? invitation.attendingPax : Math.min(2, invitation.maxQuota),
  );
  const [notes, setNotes] = useState(invitation.notes || "");

  function handleSave() {
    const finalPax = status === "ATTENDING" ? Math.min(pax, invitation.maxQuota) : 0;
    onSaveRsvp(status, finalPax, notes);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Konfirmasi Kehadiran">
      <div className="space-y-4">
        <div className="p-3 bg-surface border border-border rounded-control">
          <div className="text-sm font-bold text-foreground">{invitation.guestName}</div>
          <p className="text-[11px] text-secondary mt-0.5">
            Nama mengikuti tautan personal Anda. Jawaban konfirmasi hanya terlihat oleh pasangan.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setStatus("ATTENDING")}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-control border transition-colors ${
              status === "ATTENDING"
                ? "bg-primary text-white border-primary"
                : "bg-surface text-secondary border-border hover:bg-subtle"
            }`}
          >
            ✓ Insyaallah Hadir
          </button>
          <button
            type="button"
            onClick={() => setStatus("DECLINED")}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-control border transition-colors ${
              status === "DECLINED"
                ? "bg-danger text-white border-danger"
                : "bg-surface text-secondary border-border hover:bg-subtle"
            }`}
          >
            Berhalangan Hadir
          </button>
        </div>

        {status === "ATTENDING" ? (
          <div className="p-3 bg-canvas rounded-control border border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Jumlah Orang yang Hadir</span>
              <span className="text-secondary text-[11px]">
                Maksimal {invitation.maxQuota} orang
              </span>
            </div>
            <div className="flex items-center justify-center gap-4 py-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setPax((p) => Math.max(1, p - 1))}
              >
                −
              </Button>
              <span className="font-mono text-xl font-bold w-12 text-center text-foreground">
                {pax}
              </span>
              <Button
                variant="secondary"
                size="small"
                onClick={() => setPax((p) => Math.min(invitation.maxQuota, p + 1))}
              >
                +
              </Button>
            </div>
            <p className="text-[11px] text-muted text-center">
              Termasuk Anda dan pendamping / keluarga
            </p>
          </div>
        ) : (
          <div className="p-3 bg-danger-bg text-danger text-xs rounded-control border border-danger/30">
            Saat Anda memilih berhalangan hadir, jumlah orang dihitung 0 dan kursi Anda akan
            dialokasikan kembali.
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">
            Pesan & Doa untuk Mempelai (Opsional)
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Tuliskan ucapan atau doa selamat untuk Andi & Risa…"
            className="w-full text-xs rounded-control border border-border bg-canvas p-2.5 text-foreground"
          />
        </div>

        <div className="text-[11px] text-secondary">
          Konfirmasi dapat diperbarui hingga <strong>{invitation.rsvpDeadline}</strong>.
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Simpan Konfirmasi
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
