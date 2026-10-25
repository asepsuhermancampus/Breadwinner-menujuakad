"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DocumentItem } from "@/features/kua-documents/domain/document-template";
export function DocumentEditForm({
  item,
  save,
  cancel,
}: {
  item: DocumentItem;
  save: (item: DocumentItem) => Promise<boolean>;
  cancel: () => void;
}) {
  const [title, setTitle] = useState(item.title),
    [notes, setNotes] = useState(item.notes ?? ""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <form
      className="grid gap-3 rounded-card border border-ux-border p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        try {
          if (await save({ ...item, title: title.trim(), notes })) cancel();
          else setError("Belum tersimpan. Periksa perubahan di tab lain.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="grid gap-1 text-sm">
        Nama dokumen
        <input
          required
          maxLength={160}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Catatan
        <textarea
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          Simpan dokumen
        </Button>
        <Button type="button" variant="secondary" onClick={cancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
