"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioExit({
  editor,
  onClose,
  onExit,
}: {
  editor: StudioEditor;
  onClose: () => void;
  onExit: () => void;
}) {
  const [ack, setAck] = useState(false);
  return (
    <Dialog open onClose={onClose} title="Perubahan belum tersinkron">
      <div className="grid gap-4 text-sm">
        <p>
          {editor.trial
            ? "Perubahan belum tersimpan di browser. Gunakan Simpan draf trial atau ekspor draf sebelum keluar."
            : editor.remote
              ? "Perubahan yang belum tersimpan pada akun dapat hilang. Tunggu penyimpanan atau ekspor draf sebelum keluar."
              : editor.storageError
                ? "Penyimpanan perangkat bermasalah. Ekspor salinan sebelum keluar agar perubahan tidak hilang."
                : "Perubahan belum tersinkron. Salinan draf tersimpan pada perangkat ini."}
        </p>
        <Button variant="secondary" onClick={editor.exportDraft}>
          Ekspor draf
        </Button>
        {editor.storageError && (
          <label className="flex min-h-11 items-center gap-3 text-xs">
            <input
              type="checkbox"
              checked={ack}
              onChange={(event) => setAck(event.target.checked)}
            />
            Saya memahami bahwa perubahan yang belum diekspor dapat hilang.
          </label>
        )}
        <Button onClick={onClose}>Lanjut mengedit</Button>
        <Button variant="ghost" disabled={Boolean(editor.storageError) && !ack} onClick={onExit}>
          {editor.remote || editor.storageError
            ? "Keluar tanpa menyimpan"
            : "Keluar dengan salinan lokal"}
        </Button>
      </div>
    </Dialog>
  );
}
