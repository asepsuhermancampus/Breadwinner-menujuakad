"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { StudioSettings } from "../types/studio";

type Props = {
  open: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onConfirmPublish: () => void;
};

export function PublishReviewDialog({ open, onClose, settings, onConfirmPublish }: Props) {
  return (
    <Dialog open={open} onClose={onClose} title="Konfirmasi Publikasi Undangan">
      <div className="space-y-4">
        <div className="p-3 bg-surface border border-border rounded-control">
          <div className="text-sm font-bold text-foreground">
            Publikasikan Draf v{settings.draftVersion} Menjadi Versi Aktif?
          </div>
          <p className="text-xs text-secondary mt-1">
            Perubahan konfigurasi studio akan langsung tampil pada seluruh tautan personal tamu
            tanpa merusak data RSVP yang sudah masuk.
          </p>
        </div>

        <div className="text-xs space-y-2.5 border-t border-b border-border py-3">
          <div className="flex justify-between items-center">
            <span className="text-secondary">Tema Undangan</span>
            <span className="font-semibold text-primary capitalize">{settings.draftTheme}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Batas RSVP</span>
            <span className="font-mono font-medium text-foreground">{settings.rsvpDeadline}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Musik Autoplay</span>
            <span className="text-secondary">{settings.autoplayMusic ? "Aktif" : "Nonaktif"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-secondary">Rekening Hadiah</span>
            <span className="text-danger font-semibold">Nonaktif (Baseline #43)</span>
          </div>
        </div>

        <p className="text-xs text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
          <strong>Perhatian Integritas Data:</strong> Tamu yang sudah mengisi konfirmasi kehadiran
          (RSVP) tidak perlu mengisi ulang. Tiket dan alokasi meja mereka tetap utuh.
        </p>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onConfirmPublish();
              onClose();
            }}
          >
            Publikasikan Sekarang
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
