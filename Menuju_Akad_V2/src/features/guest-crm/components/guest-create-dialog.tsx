"use client";

import { useState } from "react";
import { useCustomerNames } from "@/features/customer-workspace/components/customer-names-context";
import { guestGroupLabel, guestGroups } from "../utils/guest-groups";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GuestGroup, GuestInvitation } from "../types/guest";
import { normalizeE164 } from "../utils/guest-filter";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (guest: Omit<GuestInvitation, "id" | "personalToken">) => void | Promise<boolean | void>;
};

export function GuestCreateDialog({ open, onClose, onSave }: Props) {
  const names = useCustomerNames();
  const [name, setName] = useState("");
  const [group, setGroup] = useState<GuestGroup>("Teman");
  const [quota, setQuota] = useState(2);
  const [phone, setPhone] = useState("");
  const [hasConsent, setHasConsent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama undangan wajib diisi.");
      return;
    }
    if (quota < 1) {
      setError("Kuota minimal 1 orang.");
      return;
    }
    let normalizedPhone = phone.trim();
    if (phone) {
      const res = normalizeE164(phone);
      if (!res.valid) {
        setError("Format nomor WhatsApp tidak valid. Gunakan format +62 atau 08.");
        return;
      }
      normalizedPhone = res.normalized;
    }

    const saved = await onSave({
      name: name.trim(),
      group,
      quota,
      contactPhone: normalizedPhone,
      rsvpStatus: "PENDING",
      attendingCount: 0,
      waConsent: hasConsent,
      waConsentDate: hasConsent ? new Date().toISOString() : undefined,
      waConsentSource: hasConsent ? "Input langsung formulir" : undefined,
    });
    if (saved === false) {
      setError(
        "Perubahan belum tersimpan. Periksa sisa trial atau pesan penyimpanan; data formulir tetap tersedia.",
      );
      return;
    }
    setName("");
    setPhone("");
    setQuota(2);
    setHasConsent(false);
    setError("");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Tambah Undangan Baru">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div role="alert" className="p-2 text-xs text-danger bg-danger-bg rounded">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">
            Nama Tamu / Rombongan <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso & Partner"
            className="w-full rounded-control border border-border bg-canvas px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">Grup Tamu</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as GuestGroup)}
              className="w-full rounded-control border border-border bg-canvas px-3 py-2 text-sm"
            >
              {guestGroups.map((value) => (
                <option key={value} value={value}>
                  {guestGroupLabel(value, names)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">
              Kuota Maksimal
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setQuota((q) => Math.max(1, q - 1))}
              >
                −
              </Button>
              <span className="font-mono text-sm w-8 text-center">{quota}</span>
              <Button variant="secondary" size="small" onClick={() => setQuota((q) => q + 1)}>
                +
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">
            Nomor WhatsApp (Opsional)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812xxxxxxxx / +628xxxxxxxx"
            className="w-full rounded-control border border-border bg-canvas px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-control bg-subtle p-3 border border-border space-y-2">
          <p className="text-xs text-secondary leading-relaxed">
            Menyimpan nomor tidak berarti boleh mengirim pesan massal. Tambahkan bukti persetujuan
            tamu sebelum memasukkannya ke antrean WhatsApp.
          </p>
          <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={hasConsent}
              onChange={(e) => setHasConsent(e.target.checked)}
            />
            <span>Tamu telah memberikan izin tertulis / formulir untuk dihubungi</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" type="submit">
            Simpan Undangan
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
