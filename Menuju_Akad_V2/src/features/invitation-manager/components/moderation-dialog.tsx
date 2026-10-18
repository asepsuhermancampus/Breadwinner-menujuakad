"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { ModerationItem } from "../types/manager";

export function ModerationDialog({
  item,
  onClose,
  onDecide,
  error,
}: {
  item: ModerationItem;
  onClose: () => void;
  onDecide: (status: "Ditampilkan" | "Disembunyikan", reason: string) => void;
  error: string | null;
}) {
  const [reason, setReason] = useState("");
  const [rejecting, setRejecting] = useState(false);
  return (
    <Dialog
      open
      onClose={() => {
        if (
          reason.trim() &&
          !window.confirm("Tutup tinjauan dan buang alasan yang belum disimpan?")
        )
          return;
        onClose();
      }}
      title={`Kiriman dari ${item.guest}`}
    >
      <div className="grid gap-3">
        {item.photo && (
          <img
            src={item.photo}
            alt={`Foto kiriman ${item.guest}`}
            className="max-h-64 w-full rounded-control object-cover"
          />
        )}
        {item.body && <p className="rounded-control bg-canvas p-3 text-sm">“{item.body}”</p>}
        <p className="text-xs text-secondary">Nama publik: {item.publicName}</p>
        <p className="text-xs text-secondary">{item.consentEvidence}</p>
        {!item.publicationConsent && (
          <p role="status" className="text-xs text-warning">
            Tanpa izin publikasi, kiriman tetap privat.
          </p>
        )}
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold">Alasan (dicatat pada audit)</span>
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="rounded-control border border-border bg-canvas p-3 text-sm"
          />
        </label>
        {!reason.trim() && (
          <p className="text-xs text-secondary">Isi alasan setelah meninjau izin dan konten.</p>
        )}
        {error && (
          <p role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-3">
          {rejecting ? (
            <>
              <Button variant="ghost" onClick={() => setRejecting(false)}>
                Batal
              </Button>
              <Button
                variant="secondary"
                disabled={!reason.trim()}
                onClick={() => onDecide("Disembunyikan", reason)}
              >
                Sembunyikan kiriman
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setRejecting(true)}>
                Tolak dengan alasan…
              </Button>
              <Button
                disabled={!item.publicationConsent || !reason.trim()}
                onClick={() => onDecide("Ditampilkan", reason)}
              >
                Setujui
              </Button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
