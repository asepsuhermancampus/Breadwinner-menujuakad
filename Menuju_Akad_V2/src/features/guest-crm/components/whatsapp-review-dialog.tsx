"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirmDispatch: () => void;
};

export function WhatsappReviewDialog({ open, onClose, onConfirmDispatch }: Props) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <Dialog open={open} onClose={onClose} title="Tinjauan Pengiriman WhatsApp">
      <div className="space-y-4">
        <div className="p-3 bg-surface border border-border rounded-control">
          <div className="text-sm font-bold text-foreground">Kirim ke 10 Undangan?</div>
          <div className="text-xs text-secondary mt-1">
            14 dipilih · <span className="text-success font-semibold">10 memenuhi syarat</span> ·{" "}
            <span className="text-warning font-semibold">4 dikecualikan</span>
          </div>
        </div>

        <div className="text-xs space-y-2 border-t border-b border-border py-3">
          <div className="flex justify-between">
            <span className="text-secondary">Template Pesan</span>
            <span className="font-medium text-foreground">Undangan pernikahan · v1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Penerima Siap Kirim</span>
            <span className="font-semibold text-primary">10 undangan</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Kuota Pesan Terpakai</span>
            <span className="font-mono font-bold text-foreground">100 → 90 pesan</span>
          </div>
        </div>

        <div className="p-3 bg-warning-bg border border-warning/30 rounded-control space-y-1.5">
          <div className="text-xs font-bold text-warning">Empat Undangan Dikecualikan:</div>
          <ul className="text-xs text-secondary list-disc pl-4 space-y-0.5">
            <li>2 undangan sudah pernah terkirim sebelumnya</li>
            <li>1 tamu belum memberikan izin komunikasi WhatsApp</li>
            <li>1 nomor telepon belum valid</li>
          </ul>
        </div>

        <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary leading-relaxed">
          <strong>Perhatian:</strong> Izin diperiksa ulang saat pengiriman. Penerima yang tidak lagi
          memenuhi syarat dicatat sebagai dikecualikan, bukan tetap dikirim. Kuota berkurang hanya
          setelah antrean diterima.
        </div>

        <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5"
          />
          <span>Saya sudah meninjau penerima dan persetujuan komunikasi secara teliti.</span>
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            disabled={!acknowledged}
            onClick={() => {
              onConfirmDispatch();
              onClose();
            }}
          >
            Kirim 10 Pesan Sekarang
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
