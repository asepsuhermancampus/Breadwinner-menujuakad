"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { CardOrnament } from "@/components/ui/card-ornament";
import styles from "./join-workspace.module.css";
export function JoinedWorkspace({ url }: { url: string }) {
  const [message, setMessage] = useState("");
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <CardOrnament variant={2} />
        <div className={styles.heading}>
          <p>Pasangan berhasil terhubung</p>
          <h1>Profil berhasil disimpan</h1>
          <p>
            Buka Profil & Akses untuk mengunggah foto. Seluruh fitur ruang bersama mengikuti paket
            pemilik akun.
          </p>
        </div>
        <Field
          label="Tautan Profil & Akses"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
        />
        <div className={styles.successActions}>
          <Button
            variant="secondary"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setMessage("Tautan Profil & Akses disalin.");
              } catch {
                setMessage("Pilih dan salin tautan di atas.");
              }
            }}
          >
            Salin tautan
          </Button>
          <a href={url} className={styles.openLink}>
            Buka Profil & Akses
          </a>
        </div>
        {message && (
          <p role="status" className={styles.notice}>
            {message}
          </p>
        )}
        <p className={styles.notice}>
          Gunakan akun yang sama saat membuka tautan ini dari browser lain.
        </p>
      </section>
    </main>
  );
}
