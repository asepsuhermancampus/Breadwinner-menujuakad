"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import type { FollowUpDispatchResult, FollowUpGuest } from "../types/followup";

export function FollowUpReviewDialog({
  open,
  onClose,
  selected,
  onDispatch,
}: {
  open: boolean;
  onClose: () => void;
  selected: FollowUpGuest[];
  onDispatch: () => FollowUpDispatchResult;
}) {
  const [dispatched, setDispatched] = useState<FollowUpDispatchResult | null>(null);

  function handleDispatch() {
    setDispatched(onDispatch());
  }

  if (dispatched) {
    return (
      <Dialog
        open={open}
        onClose={() => {
          setDispatched(null);
          onClose();
        }}
        title="Hasil penjadwalan (simulasi)"
      >
        <div className="grid gap-3">
          <p
            role="status"
            className="rounded-control border border-border bg-canvas p-3 text-xs font-semibold text-foreground"
          >
            {dispatched.queuedIds.length} pengingat masuk antrean simulasi. Tidak ada WhatsApp nyata
            yang dikirim pada mode pratinjau.
          </p>
          <p className="text-xs text-secondary">
            Izin, nomor, jawaban terbaru, jeda kirim, dan duplikasi kampanye diperiksa pada data
            simulasi terbaru sebelum masuk antrean.
          </p>
          {dispatched.excluded.length > 0 && (
            <div className="grid gap-2 text-xs text-secondary">
              <p className="font-semibold">{dispatched.excluded.length} pengingat dikecualikan</p>
              <ul className="grid max-h-48 gap-2 overflow-auto">
                {dispatched.excluded.map((guest, index) => (
                  <li key={`${guest.id}-${index}`}>
                    {guest.name}: {guest.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button
            onClick={() => {
              setDispatched(null);
              onClose();
            }}
          >
            Selesai
          </Button>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} title={`Tinjau ${selected.length} pengingat`}>
      <div className="grid gap-3">
        <p className="text-xs text-secondary">
          Hanya tamu dengan izin WhatsApp aktif, nomor valid, belum menjawab, dan melewati jeda
          kirim yang diteruskan. Tanpa kampanye ganda ke penerima yang sama.
        </p>
        <ul className="grid max-h-64 gap-1.5 overflow-auto">
          {selected.map((g) => (
            <li
              key={g.id}
              className="flex items-center justify-between rounded-control border border-border bg-canvas px-3 py-2 text-xs"
            >
              <span className="font-semibold text-foreground">{g.name}</span>
              <span className="font-mono text-secondary">
                {g.quota} pax · {g.lastWaDate}
              </span>
            </li>
          ))}
          {selected.length === 0 && (
            <li className="rounded-control bg-canvas p-3 text-xs text-muted">
              Belum ada tamu dipilih.
            </li>
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-muted">
            <Icon name="info" size={13} /> Mode simulasi · bukan pengiriman nyata
          </span>
          <Button disabled={selected.length === 0} onClick={handleDispatch}>
            Jadwalkan {selected.length} pengingat
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
