"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
};

export function DisputeSubmissionDialog({ open, onClose, onSubmitted }: Props) {
  const [reason, setReason] = useState("Ketidaksesuaian kesepakatan ruang lingkup kerja");
  const [acknowledged, setAcknowledged] = useState(false);
  const [fileName] = useState("lampiran-bukti-chat.pdf");

  function handleSubmit() {
    onSubmitted();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Ajukan Sengketa Pesanan Jasa">
      <div className="space-y-4">
        <div className="p-3 bg-surface border border-border rounded-control">
          <div className="text-sm font-bold text-foreground">
            Pengajuan Sengketa Terarah · ORD-SIM-204
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Khusus pemilik pesanan terverifikasi. Pengajuan sengketa bukan pengembalian dana
            otomatis (bukan auto-refund).
          </p>
        </div>

        <div className="text-xs space-y-2 border-t border-b border-border py-3">
          <div className="flex justify-between">
            <span className="text-secondary">Vendor / Item Terkait</span>
            <span className="font-semibold text-foreground">Lensa Teduh (Kontrak v9)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Dana DP yang Dipersengketakan</span>
            <span className="font-mono font-bold text-primary">{formatIdr(4500000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Batas Waktu Hak Sengketa</span>
            <span className="font-mono text-secondary">21 Feb 2027 · 23.59 WIB</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">
            Alasan Pengajuan Sengketa
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full text-xs rounded-control border border-border bg-canvas px-3 py-2"
          >
            <option>Ketidaksesuaian kesepakatan ruang lingkup kerja</option>
            <option>Vendor membatalkan sepihak tanpa kesepakatan</option>
            <option>Perubahan jadwal tidak disetujui kedua pihak</option>
            <option>Lainnya (dilengkapi dengan bukti tertulis)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">
            Unggah Berkas Bukti (PDF / JPG / PNG ≤ 10 MB)
          </label>
          <div className="p-3 bg-subtle border border-border rounded-control text-xs flex justify-between items-center">
            <span className="font-mono text-secondary">{fileName}</span>
            <span className="text-[11px] text-success font-semibold">✓ 1.2 MB Terlampir</span>
          </div>
        </div>

        <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary leading-relaxed">
          <strong>Alur Mediasi Terpadu:</strong> Draf diajukan → Menunggu tanggapan vendor → Mediasi
          oleh Tim Kepatuhan Menuju Akad → Keputusan akhir. Pihak vendor hanya menanggapi bukti dan
          tidak dapat menyetujui refund sepihak.
        </div>

        <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            Informasi dan berkas bukti di atas adalah benar. Saya memahami bahwa pengajuan ini belum
            berarti pengembalian dana disetujui.
          </span>
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="danger" disabled={!acknowledged} onClick={handleSubmit}>
            Kirimkan Permohonan Sengketa
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
