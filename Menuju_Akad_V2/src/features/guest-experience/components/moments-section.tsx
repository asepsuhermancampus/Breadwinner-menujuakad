"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { guestMomentsTexts } from "@/features/guest-experience/content/experience-content";
import type { MomentUpload } from "../types/experience";

const MAX_MB = 10;

export function MomentsSection({ onBack }: { onBack: () => void }) {
  const t = guestMomentsTexts;
  const [upload, setUpload] = useState<MomentUpload | null>({
    fileName: "momen-kami.jpg",
    fileSizeMb: 2.8,
    mimeType: "image/jpeg",
    consent: false,
    status: "DRAFT",
  });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = Boolean(upload) && consent && upload!.fileSizeMb <= MAX_MB;

  function replacePhoto() {
    setUpload({
      fileName: "momen-kami-2.jpg",
      fileSizeMb: 3.1,
      mimeType: "image/jpeg",
      consent: false,
      status: "DRAFT",
    });
    setConsent(false);
    setError(null);
  }

  function submit() {
    if (!upload) return;
    if (upload.fileSizeMb > MAX_MB) {
      setError("Ukuran melebihi 10 MB.");
      return;
    }
    setError(null);
    setUpload({ ...upload, status: "MODERATION" });
  }

  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Foto momen">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-xs font-semibold text-secondary hover:text-foreground"
      >
        ← Kembali
      </button>

      <header className="grid gap-2 text-center">
        <h2 className="whitespace-pre-line font-serif text-4xl leading-tight text-foreground">
          {t.heading}
        </h2>
        <p className="text-xs text-secondary">{t.intro}</p>
      </header>

      {upload ? (
        <>
          <figure className="grid gap-2">
            <img
              src="/assets/images/editorial-6.png"
              alt={`Pratinjau ${upload.fileName}`}
              className="max-h-72 w-full rounded-card border border-border object-cover"
            />
            <figcaption className="text-center font-mono text-[11px] text-muted">
              {upload.fileName} · {upload.fileSizeMb.toLocaleString("id-ID")} MB
            </figcaption>
          </figure>

          <Button variant="secondary" className="w-full" onClick={replacePhoto}>
            Ganti foto
          </Button>
          <p className="text-center text-[11px] text-muted">{t.restrictions}</p>

          <label className="flex min-h-11 items-start gap-2.5 text-xs text-secondary">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span>{t.consentLabel}</span>
          </label>

          <Button
            className="w-full"
            disabled={!canSubmit || upload.status === "MODERATION"}
            onClick={submit}
          >
            {upload.status === "MODERATION" ? "Menunggu moderasi" : "Kirim untuk moderasi"}
          </Button>
          {error && (
            <p
              role="alert"
              className="rounded-control border border-danger/30 bg-danger-bg p-3 text-xs text-danger"
            >
              {error}
            </p>
          )}
          {upload.status === "MODERATION" && (
            <p
              role="status"
              className="rounded-control border border-success/30 bg-success-bg p-3 text-xs font-semibold text-success"
            >
              ✓ Foto masuk antrean moderasi (simulasi). Tidak otomatis tampil di galeri publik.
            </p>
          )}
        </>
      ) : (
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setError("Pilih foto terlebih dahulu.")}
        >
          Pilih foto
        </Button>
      )}

      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold text-foreground">{t.queueNote.title}</p>
        <p className="mt-1 text-xs text-secondary">{t.queueNote.body}</p>
      </div>
    </section>
  );
}
