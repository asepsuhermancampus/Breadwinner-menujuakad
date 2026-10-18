"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SameDateCheckDialog({ open, onClose }: Props) {
  const vendors = [
    {
      name: "Aru MUA · Akad",
      session: "04.30–08.00 WIB",
      status: "available",
      statusText: "Tersedia",
      distance: "5,2 km",
    },
    {
      name: "Lensa Teduh · Foto",
      session: "07.00–16.00 WIB",
      status: "available",
      statusText: "Tersedia",
      distance: "6,4 km",
    },
    {
      name: "Luma Dekor · Dekor",
      session: "06.00–16.00 WIB",
      status: "available",
      statusText: "Tersedia",
      distance: "8,1 km",
    },
    {
      name: "Kalyana Photo",
      session: "07.00–16.00 WIB",
      status: "unavailable",
      statusText: "Tidak Tersedia (Acara Rama & Sinta)",
      distance: "7,0 km",
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} title="Pemeriksaan Tanggal Serentak">
      <div className="space-y-4">
        <div className="p-3 bg-surface border border-border rounded-control">
          <div className="text-sm font-bold text-foreground">
            Satu Tanggal. Semua Vendor Diperiksa.
          </div>
          <p className="text-xs text-secondary mt-1">
            Sandbox Preset 3 · Ketersediaan contoh diperiksa pada <strong>10.42 WIB</strong> (belum
            terkunci sebelum checkout).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs p-3 bg-subtle rounded-control border border-border">
          <div>
            <span className="text-secondary">Tanggal Acara:</span>
            <div className="font-bold text-foreground">14 Februari 2027 · WIB</div>
          </div>
          <div>
            <span className="text-secondary">Lokasi Acara:</span>
            <div className="font-bold text-foreground">Bumi Samami · Bandung</div>
          </div>
        </div>

        <div className="overflow-x-auto border border-border rounded-control">
          <table className="w-full text-xs text-left">
            <thead className="bg-subtle text-secondary font-semibold border-b border-border">
              <tr>
                <th className="p-2.5">Vendor / Layanan</th>
                <th className="p-2.5">Sesi Waktu</th>
                <th className="p-2.5">Status 14 Feb</th>
                <th className="p-2.5">Jarak</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="p-2.5 font-medium text-foreground">{v.name}</td>
                  <td className="p-2.5 font-mono text-secondary">{v.session}</td>
                  <td className="p-2.5">
                    {v.status === "available" ? (
                      <Status tone="success">Tersedia</Status>
                    ) : (
                      <Status tone="danger">{v.statusText}</Status>
                    )}
                  </td>
                  <td className="p-2.5 text-secondary">{v.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
          <strong>Prinsip Kemandirian Vendor:</strong> Status ketersediaan diperiksa per vendor
          secara individual. Ketersediaan satu vendor tidak otomatis membuat seluruh paket
          terkonfirmasi.
        </p>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button variant="primary" onClick={onClose}>
            Selesai Meninjau
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
