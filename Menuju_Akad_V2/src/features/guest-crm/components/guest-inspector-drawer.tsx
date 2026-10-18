"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import type { GuestInvitation } from "../types/guest";

type Props = {
  guest: GuestInvitation | null;
  open: boolean;
  onClose: () => void;
  onUpdateQuota: (id: string, newQuota: number) => void;
  onArchive: (id: string) => void;
};

export function GuestInspectorDrawer({ guest, open, onClose, onUpdateQuota, onArchive }: Props) {
  const [copied, setCopied] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);

  if (!guest) return null;

  const fullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/i/${guest.personalToken}`
      : `/i/${guest.personalToken}`;

  function handleCopy() {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onClose={onClose} title="Detail Undangan & Tiket" side>
      <div className="space-y-5">
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-foreground">{guest.name}</h3>
              <p className="text-xs text-secondary mt-0.5">
                {guest.contactPhone || "Tanpa nomor kontak"}
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-subtle rounded">{guest.group}</span>
          </div>
        </div>

        <div className="p-3 bg-surface border border-border rounded-control space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-secondary">Kuota Undangan</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => onUpdateQuota(guest.id, Math.max(1, guest.quota - 1))}
              >
                −
              </Button>
              <span className="font-mono font-bold w-6 text-center">{guest.quota}</span>
              <Button
                variant="secondary"
                size="small"
                onClick={() => onUpdateQuota(guest.id, guest.quota + 1)}
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-border">
            <span className="text-secondary">Status Konfirmasi (RSVP)</span>
            <div>
              {guest.rsvpStatus === "ATTENDING" && (
                <Status tone="success">Hadir ({guest.attendingCount} orang)</Status>
              )}
              {guest.rsvpStatus === "DECLINED" && <Status tone="danger">Berhalangan</Status>}
              {guest.rsvpStatus === "PENDING" && <Status tone="info">Belum Menjawab</Status>}
            </div>
          </div>
          {guest.tableNumber && (
            <div className="flex justify-between items-center text-sm pt-2 border-t border-border">
              <span className="text-secondary">Alokasi Meja</span>
              <span className="font-semibold text-primary">
                Meja {guest.tableNumber} ({guest.tableCategory || "Reguler"})
              </span>
            </div>
          )}
        </div>

        <div className="p-3 bg-subtle border border-border rounded-control space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Status Izin WhatsApp</span>
            {guest.waConsent ? (
              <span className="text-xs font-semibold text-success">✓ Izin Diberikan</span>
            ) : (
              <span className="text-xs font-semibold text-secondary">Belum Ada Izin</span>
            )}
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            {guest.waConsent
              ? `Sumber: ${guest.waConsentSource || "Formulir pendaftaran"}${guest.waConsentDate ? ` · ${guest.waConsentDate}` : ""}. Menyimpan nomor saja tidak memberi izin untuk mengirim pesan.`
              : "Menyimpan nomor kontak tidak memberikan izin pengiriman pesan secara hukum."}
          </p>
        </div>

        <div className="p-3 bg-canvas border border-border rounded-control space-y-2">
          <label className="block text-xs font-semibold text-secondary">
            Tautan Personal (Opaque Token)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={`menujuakad.id/i/••••${guest.personalToken.slice(-4)}`}
              className="flex-1 text-xs bg-subtle px-2 py-1.5 rounded border border-border font-mono text-secondary"
            />
            <Button variant="secondary" size="small" onClick={handleCopy}>
              {copied ? "Tersalin!" : "Salin"}
            </Button>
          </div>
          <a
            href={`/i/${guest.personalToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-primary font-semibold hover:underline pt-1"
          >
            Buka tampilan undangan tamu ↗
          </a>
        </div>

        <div className="pt-4 border-t border-border">
          {confirmArchive ? (
            <div className="space-y-2 bg-danger-bg p-3 rounded-control border border-danger/30">
              <div className="text-xs font-bold text-danger">Arsipkan undangan ini?</div>
              <p className="text-xs text-secondary">
                Undangan akan disembunyikan dari daftar aktif dan tautan personal dinonaktifkan.
              </p>
              <div className="flex gap-2 pt-1">
                <Button variant="danger" size="small" onClick={() => onArchive(guest.id)}>
                  Ya, Arsipkan
                </Button>
                <Button variant="secondary" size="small" onClick={() => setConfirmArchive(false)}>
                  Batal
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="small"
              className="text-danger hover:bg-danger-bg w-full"
              onClick={() => setConfirmArchive(true)}
            >
              Arsipkan Undangan Ini…
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
