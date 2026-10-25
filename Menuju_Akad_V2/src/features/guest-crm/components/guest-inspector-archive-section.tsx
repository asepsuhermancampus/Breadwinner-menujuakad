"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  guestId: string;
  onArchive: (id: string) => void;
};

export function GuestInspectorArchiveSection({ guestId, onArchive }: Props) {
  const [confirmArchive, setConfirmArchive] = useState(false);

  return (
    <div className="pt-4 border-t border-border">
      {confirmArchive ? (
        <div className="space-y-2 bg-danger-bg p-3 rounded-control border border-danger/30">
          <div className="text-xs font-bold text-danger">Arsipkan undangan ini?</div>
          <p className="text-xs text-secondary">
            Undangan akan disembunyikan dari daftar aktif dan tautan personal dinonaktifkan.
          </p>
          <div className="flex gap-2 pt-1">
            <Button variant="danger" size="small" onClick={() => onArchive(guestId)}>
              Ya, Arsipkan
            </Button>
            <Button variant="secondary" size="small" onClick={() => setConfirmArchive(false)}>
              Batal
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="small"
          className="text-danger hover:bg-danger-bg w-full"
          onClick={() => setConfirmArchive(true)}
        >
          Arsipkan Undangan Ini…
        </Button>
      )}
    </div>
  );
}
