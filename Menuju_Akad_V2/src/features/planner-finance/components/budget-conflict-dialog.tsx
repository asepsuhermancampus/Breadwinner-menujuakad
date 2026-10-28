"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";

type Props = {
  open: boolean;
  onClose: () => void;
  onResolve: (chosenAmount: number) => void;
};

export function BudgetConflictDialog({ open, onClose, onResolve }: Props) {
  return (
    <Dialog open={open} onClose={onClose} title="Konflik Perubahan Anggaran (Venue)">
      <div className="flex flex-col gap-4 p-5 max-w-lg">
        <div className="flex items-start gap-3 rounded-control bg-warning-bg p-3.5 border border-warning/30 text-xs text-foreground">
          <Icon name="history" size={18} className="text-warning mt-0.5 shrink-0" />
          <div>
            <strong className="block font-semibold">Perubahan terdeteksi di server (v18).</strong>
            <span>
              Pasangan Anda telah memperbarui rencana Venue di server. Memaksa simpan lokal (Rp
              32.000.000) akan membuat total anggaran menjadi Rp 152.000.000 (overbudget Rp
              2.000.000).
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="rounded-card border border-border bg-ux-dock p-3">
            <span className="text-secondary block mb-1">Versi Awal (Base v17)</span>
            <strong className="font-mono text-sm text-foreground block">Rp 30.000.000</strong>
            <span className="text-[10px] text-secondary">Tersimpan lokal</span>
          </div>

          <div className="rounded-card border border-primary bg-primary/5 p-3">
            <span className="text-brand-secondary font-semibold block mb-1">Server (v18)</span>
            <strong className="font-mono text-sm text-brand-secondary block">Rp 31.000.000</strong>
            <span className="text-[10px] text-secondary">Diperbarui pasangan</span>
          </div>

          <div className="rounded-card border border-warning bg-warning-bg/40 p-3">
            <span className="text-warning font-semibold block mb-1">Draf Anda (v19)</span>
            <strong className="font-mono text-sm text-foreground block">Rp 32.000.000</strong>
            <span className="text-[10px] text-secondary">Perubahan belum commit</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3 border-t border-border">
          <Button
            variant="secondary"
            onClick={() => {
              onResolve(31_000_000);
              onClose();
            }}
            className="flex items-center justify-between"
          >
            <span>Gunakan Versi Server (v18)</span>
            <span className="font-mono font-semibold">Rp 31.000.000</span>
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              onResolve(32_000_000);
              onClose();
            }}
            className="flex items-center justify-between"
          >
            <span>Terapkan Draf Lokal dengan Versi Baru</span>
            <span className="font-mono font-semibold">Rp 32.000.000</span>
          </Button>

          <Button variant="ghost" onClick={onClose} className="mt-1">
            Batal & Pertahankan Status Sekarang
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
