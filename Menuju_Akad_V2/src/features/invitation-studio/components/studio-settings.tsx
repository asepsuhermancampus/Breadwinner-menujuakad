"use client";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThemeGallery } from "./theme-gallery";
import type { StudioEditor } from "../hooks/use-studio-editor";

export function StudioSettings({
  editor,
  onClose,
  onReview,
}: {
  editor: StudioEditor;
  onClose: () => void;
  onReview: () => void;
}) {
  const { state, edit } = editor;
  const doc = state.document;
  return (
    <Dialog open onClose={onClose} title="RSVP & Privasi (Draf)">
      <div className="grid gap-5">
        <p className="text-xs text-secondary">
          RSVP aktif per sesi · batas {doc.content.rsvpDeadline}. Hadiah nonaktif; rekening dan
          alamat rumah tidak ditampilkan. Musik diputar hanya atas pilihan tamu.
        </p>
        <label className="flex min-h-11 items-center gap-3 text-xs">
          <input
            type="checkbox"
            checked={doc.privacy.searchEngineIndex}
            onChange={(event) =>
              edit({ ...doc, privacy: { ...doc.privacy, searchEngineIndex: event.target.checked } })
            }
          />
          Izinkan mesin pencari mengindeks setelah dipublikasikan
        </label>
        <details>
          <summary className="min-h-11 py-3 text-sm font-semibold">Galeri Tema</summary>
          <ThemeGallery
            activeTheme={state.activeDocument?.theme ?? "editorial"}
            draftTheme={doc.theme}
            onSelectTheme={(theme) => edit({ ...doc, theme })}
          />
        </details>
        <Button onClick={onReview}>Publikasikan Draf · tinjau dahulu</Button>
      </div>
    </Dialog>
  );
}
