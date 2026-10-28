"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DocumentItem } from "@/features/kua-documents/domain/document-template";
import { Icon } from "@/components/ui/icon";
import styles from "./customer-documents.module.css";
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
      className={styles.editor}
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
      <div className={styles.intro}>
        <span className={styles.documentIcon}>
          <Icon name="pencil" size={20} />
        </span>
        <div>
          <h2>Edit dokumen</h2>
          <p>Perbarui nama dan catatan berkas kalian.</p>
        </div>
      </div>
      <label className={styles.field}>
        Nama dokumen
        <input
          required
          maxLength={160}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
      </label>
      <label className={styles.field}>
        Catatan
        <textarea
          maxLength={2000}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={styles.input}
          rows={3}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className={styles.editorActions}>
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
