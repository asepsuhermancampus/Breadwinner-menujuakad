"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { createHistoryDocument } from "../content/editor-content";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioHistory({
  editor,
  onClose,
  onPreview,
}: {
  editor: StudioEditor;
  onClose: () => void;
  onPreview: () => void;
}) {
  const [ack, setAck] = useState(false);
  const { state, dispatch } = editor;
  const historical = createHistoryDocument(state.document);
  const hasHistory = state.document.projectId === "inv-wedding-main";
  const history = [
    {
      version: state.document.revision,
      label: "Draf saat ini",
      actor: "Anda",
      time: "Tersimpan lokal",
    },
    ...(state.document.activeVersion
      ? [
          {
            version: state.document.activeVersion,
            label: "Versi aktif",
            actor: "Anda",
            time: "Snapshot publikasi lokal",
          },
        ]
      : []),
    ...(hasHistory
      ? [{ version: 2, label: "Konten awal", actor: "Risa", time: "24 Okt 2026 · 18.30" }]
      : []),
  ];
  return (
    <Dialog open onClose={onClose} title="Riwayat versi">
      <div className="grid gap-4 text-sm">
        <p className="text-xs text-secondary">Lihat salinan lama tanpa mengubah versi aktif.</p>
        <div className="divide-y divide-border">
          {history.map((item) => (
            <div key={item.version} className="flex justify-between gap-3 py-3">
              <strong>v{item.version}</strong>
              <div className="text-right">
                <p className="text-xs">{item.label}</p>
                <p className="mt-1 text-[11px] text-secondary">
                  {item.actor} · {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>
        {hasHistory ? (
          <>
            <div className="rounded-control bg-subtle p-4 text-xs">
              <strong>Perbandingan v2 → draf v{state.document.revision}</strong>
              <p className="mt-2">
                Judul: {historical.content.coupleTitle} → {state.document.content.coupleTitle}
              </p>
              <p>
                Lokasi: {historical.content.venue} → {state.document.content.venue}
              </p>
            </div>
            <Button variant="secondary" onClick={onPreview}>
              Preview versi 2
            </Button>
            <p className="text-xs leading-relaxed text-secondary">
              Pulihkan v2 menjadi draf v
              {Math.max(state.document.revision, state.document.activeVersion ?? 0) + 1}. Versi
              aktif, daftar tamu, kuota, dan jawaban RSVP tetap utuh.
            </p>
            <label className="flex min-h-11 items-center gap-3 text-xs">
              <input
                type="checkbox"
                checked={ack}
                onChange={(event) => setAck(event.target.checked)}
              />
              Saya ingin membuat draf baru dari versi 2.
            </label>
            <Button
              disabled={!ack || !state.environment.canEdit}
              onClick={() => {
                dispatch({ type: "restore" });
                onClose();
              }}
            >
              Pulihkan v2 sebagai draf baru
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-secondary">
              Proyek ini belum memiliki versi lama untuk dipulihkan. Anda dapat membuat salinan draf
              terpisah.
            </p>
            <Button
              variant="secondary"
              disabled={!state.environment.canEdit}
              onClick={() => {
                dispatch({ type: "duplicate", projectId: `inv-duplicate-${crypto.randomUUID()}` });
                onClose();
              }}
            >
              Buat salinan draf
            </Button>
          </>
        )}
      </div>
    </Dialog>
  );
}
