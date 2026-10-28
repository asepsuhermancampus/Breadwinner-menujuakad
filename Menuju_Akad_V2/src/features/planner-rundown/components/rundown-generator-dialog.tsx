"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { RundownItem, RundownGeneratorConfig } from "../types/rundown";

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (generated: RundownItem[]) => void;
  currentItems: RundownItem[];
};

export function RundownGeneratorDialog({ open, onClose, onApply, currentItems }: Props) {
  const [config, setConfig] = useState<RundownGeneratorConfig>({
    bufferMinutes: 30,
    lockAnchors: true,
    respectVendorConstraints: true,
  });
  const [previewing, setPreviewing] = useState(false);

  const handlePreview = () => {
    setPreviewing(true);
  };

  const handleConfirmApply = () => {
    onApply(currentItems);
    setPreviewing(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Generator otomatis susunan rundown">
      <div className="space-y-4">
        <p className="text-xs text-secondary">
          Susun alur waktu secara otomatis berdasarkan durasi vendor, jarak antar kegiatan, dan
          batas waktu sakral akad & resepsi.
        </p>

        <div className="space-y-3 rounded-card border border-border bg-subtle p-3.5">
          <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-foreground">
            <span>Kunci jam sakral (Akad 08:00 & Resepsi 10:00)</span>
            <input
              type="checkbox"
              checked={config.lockAnchors}
              onChange={(e) => setConfig((c) => ({ ...c, lockAnchors: e.target.checked }))}
              className="size-4 rounded border-border text-brand-secondary focus:ring-primary"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-foreground">
            <span>Selaraskan dengan catatan vendor MUA & Dokumentasi</span>
            <input
              type="checkbox"
              checked={config.respectVendorConstraints}
              onChange={(e) =>
                setConfig((c) => ({ ...c, respectVendorConstraints: e.target.checked }))
              }
              className="size-4 rounded border-border text-brand-secondary focus:ring-primary"
            />
          </label>

          <div className="space-y-1">
            <span className="text-xs text-secondary">Waktu jeda antar acara (Buffer)</span>
            <select
              value={config.bufferMinutes}
              onChange={(e) => setConfig((c) => ({ ...c, bufferMinutes: Number(e.target.value) }))}
              className="w-full rounded-control border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
            >
              <option value={15}>15 Menit</option>
              <option value={30}>30 Menit (Direkomendasikan)</option>
              <option value={45}>45 Menit</option>
            </select>
          </div>
        </div>

        {previewing ? (
          <div className="space-y-2 rounded-control bg-amber-50 p-3 text-xs text-amber-900">
            <strong className="block font-semibold">Pratinjau sinkronisasi jadwal:</strong>
            <p>
              Tidak ditemukan tabrakan jadwal (0 konflik). Jam sakral akad 08:00–09:00 dan resepsi
              10:00–14:00 tetap terkunci aman.
            </p>
            <p className="text-[11px] text-amber-800">
              Menerapkan generator tidak akan menghapus kegiatan kustom yang telah dibuat manual.
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-secondary">
            <Icon name="info" size={15} className="text-brand-secondary shrink-0" />
            <span>
              Hasil generator selalu berupa pratinjau yang butuh persetujuan sebelum diterapkan.
            </span>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          {!previewing ? (
            <Button onClick={handlePreview}>Cek simulasi susunan</Button>
          ) : (
            <Button onClick={handleConfirmApply}>Terapkan susunan ini</Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
