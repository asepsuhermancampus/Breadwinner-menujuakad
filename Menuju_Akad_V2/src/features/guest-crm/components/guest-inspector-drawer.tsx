"use client";

import { useState } from "react";
import { useCustomerNames } from "@/features/customer-workspace/components/customer-names-context";
import { guestGroupLabel } from "../utils/guest-groups";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import type { GuestInvitation } from "../types/guest";
import { GuestInspectorTokenSection } from "./guest-inspector-token-section";
import { GuestInspectorArchiveSection } from "./guest-inspector-archive-section";

type Props = {
  trial?: boolean;
  guest: GuestInvitation | null;
  open: boolean;
  onClose: () => void;
  onUpdateQuota: (
    id: string,
    newQuota: number,
  ) =>
    | { success: boolean; error?: string }
    | void
    | Promise<{ success: boolean; error?: string } | void>;
  onArchive: (id: string) => void;
};

export function GuestInspectorDrawer({
  guest,
  open,
  onClose,
  onUpdateQuota,
  onArchive,
  trial = false,
}: Props) {
  const names = useCustomerNames();
  const [quotaError, setQuotaError] = useState("");

  if (!guest) return null;

  const minQuota = guest.rsvpStatus === "ATTENDING" ? Math.max(1, guest.attendingCount) : 1;
  const isMinQuota = guest.quota <= minQuota;

  async function handleDecreaseQuota() {
    if (isMinQuota) {
      setQuotaError(`Kuota tidak dapat lebih kecil dari jumlah hadir (${minQuota} orang).`);
      return;
    }
    const res = await onUpdateQuota(guest!.id, guest!.quota - 1);
    if (res && !res.success) {
      setQuotaError(res.error || "Gagal mengubah kuota.");
    } else {
      setQuotaError("");
    }
  }

  async function handleIncreaseQuota() {
    const res = await onUpdateQuota(guest!.id, guest!.quota + 1);
    if (res && !res.success) {
      setQuotaError(res.error || "Gagal mengubah kuota.");
    } else {
      setQuotaError("");
    }
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
            <span className="text-xs font-semibold px-2 py-1 bg-subtle rounded">
              {guestGroupLabel(guest.group, names)}
            </span>
          </div>
        </div>

        <div className="p-3 bg-surface border border-border rounded-control space-y-2">
          {quotaError && (
            <div className="p-2 text-xs text-danger bg-danger-bg rounded" role="alert">
              {quotaError}
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-secondary">Kuota Undangan</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="small"
                disabled={isMinQuota}
                onClick={handleDecreaseQuota}
              >
                −
              </Button>
              <span className="font-mono font-bold w-6 text-center">{guest.quota}</span>
              <Button variant="secondary" size="small" onClick={handleIncreaseQuota}>
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
              <span className="font-semibold text-brand-secondary">
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

        {trial ? (
          <p className="text-xs text-secondary">
            Data trial belum diterbitkan. Masuk untuk menggunakan tautan undangan.
          </p>
        ) : (
          <GuestInspectorTokenSection personalToken={guest.personalToken} />
        )}

        <GuestInspectorArchiveSection guestId={guest.id} onArchive={onArchive} />
      </div>
    </Dialog>
  );
}
