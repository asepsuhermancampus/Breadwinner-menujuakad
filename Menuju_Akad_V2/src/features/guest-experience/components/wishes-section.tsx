"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  guestExperienceContent,
  guestWishesTexts,
} from "@/features/guest-experience/content/experience-content";

export function WishesSection({ onBack }: { onBack: () => void }) {
  const t = guestWishesTexts;
  const [name, setName] = useState("Tamu undangan");
  const [body, setBody] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  const canSubmit = consent && body.trim().length >= 4;

  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Ucapan dan doa">
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

      <div className="grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-foreground">Nama tampil (opsional)</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="min-h-11 rounded-control border border-ux-control-border bg-surface px-3 text-sm text-foreground"
          />
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-foreground">Ucapan &amp; doa</span>
          <textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tuliskan doa untuk Andi & Risa…"
            className="rounded-control border border-ux-control-border bg-surface p-3 text-sm text-foreground"
          />
        </label>

        <label className="flex min-h-11 items-start gap-2.5 text-xs text-secondary">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          <span>{t.consentLabel}</span>
        </label>

        <Button className="w-full" disabled={!canSubmit} onClick={() => setSent(true)}>
          Kirim ucapan
        </Button>
        {!canSubmit && (
          <p className="text-[11px] text-muted">
            {consent
              ? "Tulis ucapan Anda terlebih dahulu."
              : "Centang persetujuan publikasi untuk mengirim."}
          </p>
        )}
        {sent && (
          <p
            role="status"
            className="rounded-control border border-success/30 bg-success-bg p-3 text-xs font-semibold text-success"
          >
            ✓ Ucapan masuk antrean moderasi (simulasi). Tidak otomatis tampil publik.
          </p>
        )}
      </div>

      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold text-foreground">{t.moderationNote.title}</p>
        <p className="mt-1 text-xs text-secondary">{t.moderationNote.body}</p>
      </div>

      <div className="grid gap-3">
        <h3 className="text-center font-serif text-xl text-foreground">{t.approvedHeading}</h3>
        {guestExperienceContent.wishes.map((w) => (
          <figure key={w.id} className="rounded-card border border-border bg-surface p-4">
            <blockquote className="text-sm text-foreground">“{w.body}”</blockquote>
            <figcaption className="mt-2 text-[11px] text-muted">— {w.publicName}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
