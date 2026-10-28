"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GuestInvitation } from "../types/guest";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirmImport: (newGuests: GuestInvitation[]) => void;
};

export function GuestImportDialog({ open, onClose, onConfirmImport }: Props) {
  const [step] = useState<1 | 2 | 3>(3); // Defaults to step 3 review as per design preview

  const importItems = [
    {
      name: "Alya & Partner",
      phone: "+62 821 •••• 3140",
      rawPhone: "+6282199883140",
      quota: 2,
      status: "Valid",
      valid: true,
    },
    {
      name: "Dimas",
      phone: "+62 812 •••• 7721",
      rawPhone: "+6281233447721",
      quota: 1,
      status: "Valid",
      valid: true,
    },
    {
      name: "Novi & Keluarga",
      phone: "+62 856 •••• 1290",
      rawPhone: "+6285611221290",
      quota: 3,
      status: "Valid",
      valid: true,
    },
    {
      name: "Eko Prasetyo",
      phone: "0800000 (tidak valid)",
      rawPhone: "0800000",
      quota: 1,
      status: "Nomor tidak valid",
      valid: false,
    },
    {
      name: "Budi Santoso",
      phone: "+62 812 •••• 4601",
      rawPhone: "+6281234564601",
      quota: 2,
      status: "Duplikat terdeteksi",
      valid: false,
    },
  ];

  function handleImport() {
    const validGuests: GuestInvitation[] = [
      {
        id: `imp-${Date.now()}-1`,
        name: "Alya & Partner",
        contactPhone: "+6282199883140",
        group: "Teman",
        quota: 2,
        rsvpStatus: "PENDING",
        attendingCount: 0,
        waConsent: false,
        personalToken: "tok-alya-821",
      },
      {
        id: `imp-${Date.now()}-2`,
        name: "Dimas",
        contactPhone: "+6281233447721",
        group: "Teman",
        quota: 1,
        rsvpStatus: "PENDING",
        attendingCount: 0,
        waConsent: false,
        personalToken: "tok-dimas-812",
      },
      {
        id: `imp-${Date.now()}-3`,
        name: "Novi & Keluarga",
        contactPhone: "+6285611221290",
        group: "Keluarga Risa",
        quota: 3,
        rsvpStatus: "PENDING",
        attendingCount: 0,
        waConsent: false,
        personalToken: "tok-novi-856",
      },
    ];
    onConfirmImport(validGuests);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Impor Undangan Tamu (CSV)">
      <div className="space-y-4">
        <div className="flex gap-2 text-xs font-semibold text-secondary pb-2 border-b border-border">
          <span className={step === 1 ? "text-brand-secondary font-bold" : ""}>1 · Unggah CSV</span>
          <span>→</span>
          <span className={step === 2 ? "text-brand-secondary font-bold" : ""}>
            2 · Pemetaan Kolom
          </span>
          <span>→</span>
          <span className={step === 3 ? "text-brand-secondary font-bold" : ""}>
            3 · Tinjau Data
          </span>
        </div>

        <div className="flex gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-success-bg text-success font-semibold">
            3 Siap Diimpor
          </span>
          <span className="px-2.5 py-1 rounded-full bg-warning-bg text-warning font-semibold">
            1 Nomor Tidak Valid
          </span>
          <span className="px-2.5 py-1 rounded-full bg-danger-bg text-danger font-semibold">
            1 Duplikat
          </span>
        </div>

        <div className="app-scroll overflow-x-auto border border-border rounded-control">
          <table className="w-full text-xs text-left">
            <thead className="bg-subtle text-secondary font-semibold border-b border-border">
              <tr>
                <th className="p-2">Nama Undangan</th>
                <th className="p-2">Nomor Ternormalisasi</th>
                <th className="p-2">Kuota</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {importItems.map((item, idx) => (
                <tr key={idx} className="border-b border-border last:border-0">
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2 font-mono">{item.phone}</td>
                  <td className="p-2 font-mono">{item.quota} pax</td>
                  <td className="p-2">
                    {item.valid ? (
                      <span className="text-success font-semibold">✓ Siap</span>
                    ) : (
                      <span className="text-danger font-semibold">
                        Dikecualikan ({item.status})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary leading-relaxed">
          <strong>Perhatian:</strong> Mengimpor nomor telepon tidak otomatis memberikan persetujuan
          WhatsApp. Izin komunikasi tamu tetap harus dicatat secara terpisah sebelum pengiriman
          pesan dimulai.
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleImport}>
            Impor 3 Tamu yang Siap
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
