"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { DocumentItem } from "../domain/document-template";
import styles from "@/features/customer-workspace/components/customer-documents.module.css";
export function DocumentAddForm({ add }: { add: (item: DocumentItem) => Promise<boolean> }) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className={styles.create}
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy || !title.trim()) return;
        setBusy(true);
        try {
          if (
            await add({
              id: crypto.randomUUID(),
              title: title.trim(),
              group: "additional",
              completed: false,
            })
          )
            setTitle("");
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className={styles.intro}>
        <span className={styles.documentIcon}>
          <Icon name="file-text" size={20} />
        </span>
        <div>
          <h2>Tambah dokumen</h2>
          <p>Berkas tambahan khusus kebutuhan kalian.</p>
        </div>
      </div>
      <label className={styles.field}>
        Nama dokumen
        <input
          className={styles.input}
          required
          maxLength={160}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Contoh: Dokumen tambahan dari KUA"
          aria-describedby="document-name-help"
        />
      </label>
      <Button type="submit" className={styles.add} disabled={busy}>
        <Icon name="plus" size={18} />
        {busy ? "Menyimpan…" : "Tambah"}
      </Button>
      <p id="document-name-help" className={styles.helper}>
        Berkas masuk ke daftar tambahan dan dapat diedit atau dihapus.
      </p>
    </form>
  );
}
