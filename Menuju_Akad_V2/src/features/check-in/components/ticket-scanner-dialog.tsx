"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  currentValidated: number;
  onConfirmArrival: (guestName: string, pax: number, tableNumber: string) => void;
};

export function TicketScannerDialog({ open, onClose, currentValidated, onConfirmArrival }: Props) {
  const [arrivingPax, setArrivingPax] = useState(2);
  const quota = 2;
  const alreadyIn = 0;
  const remaining = quota - alreadyIn;

  function handleConfirm() {
    onConfirmArrival("Budi Santoso & Partner", arrivingPax, "04");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Pindai Tiket Personal">
      <div className="space-y-4">
        <div className="p-3 bg-subtle border border-border rounded-control flex justify-between items-center text-xs">
          <span className="font-mono text-secondary">10:20 WIB</span>
          <span className="font-semibold text-brand-secondary">PETUGAS: DINA / GERBANG A</span>
        </div>

        <div className="p-4 bg-surface border-2 border-primary/30 rounded-xl space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-success uppercase bg-success-bg px-2 py-0.5 rounded">
                ✓ Tiket Dikenali
              </span>
              <h3 className="font-bold text-base text-foreground mt-1">Budi Santoso & Partner</h3>
              <p className="text-xs text-secondary">Meja 04 · Ruang VIP</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3 bg-canvas rounded-lg text-center border border-border">
            <div>
              <div className="text-[10px] text-secondary">Kuota Undangan</div>
              <div className="font-mono font-bold text-sm text-foreground">{quota} orang</div>
            </div>
            <div>
              <div className="text-[10px] text-secondary">Sudah Masuk</div>
              <div className="font-mono font-bold text-sm text-secondary">{alreadyIn} orang</div>
            </div>
            <div>
              <div className="text-[10px] text-secondary">Sisa Kuota</div>
              <div className="font-mono font-bold text-sm text-success">{remaining} orang</div>
            </div>
          </div>

          <div className="p-3 bg-subtle rounded-lg border border-border space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">Datang Sekarang:</span>
              <span className="text-secondary text-[11px]">Boleh hadir terpisah</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="secondary"
                size="small"
                disabled={arrivingPax <= 1}
                onClick={() => setArrivingPax((p) => Math.max(1, p - 1))}
              >
                −
              </Button>
              <span className="font-mono text-xl font-bold w-12 text-center text-foreground">
                {arrivingPax}
              </span>
              <Button
                variant="secondary"
                size="small"
                disabled={arrivingPax >= remaining}
                onClick={() => setArrivingPax((p) => Math.min(remaining, p + 1))}
              >
                +
              </Button>
            </div>
          </div>

          <p className="text-[11px] text-secondary leading-relaxed">
            Setelah konfirmasi:{" "}
            <strong>
              {currentValidated} → {currentValidated + arrivingPax} orang
            </strong>{" "}
            check-in. Validasi ini diperiksa daring untuk mencegah pencatatan ganda antar gerbang.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Konfirmasi Kedatangan ({arrivingPax} Orang)
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
