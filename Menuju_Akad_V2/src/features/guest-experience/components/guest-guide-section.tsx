"use client";

import { Button } from "@/components/ui/button";
import { guestGuideTexts } from "@/features/guest-experience/content/experience-content";
import { downloadGuestCalendar } from "../domain/calendar";

export function GuestGuideSection({ onBack }: { onBack: () => void }) {
  const t = guestGuideTexts;
  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Panduan tamu">
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-11 w-fit items-center gap-1.5 text-xs font-semibold text-secondary hover:text-foreground"
      >
        ← Kembali
      </button>

      <header className="grid gap-2 text-center">
        <h2 className="whitespace-pre-line font-serif text-4xl leading-tight text-foreground">
          {t.heading}
        </h2>
        <p className="text-xs text-secondary">{t.intro}</p>
      </header>

      <div className="rounded-card border border-border bg-surface p-4 text-center">
        <p className="text-sm font-bold text-foreground">Minggu, 14 Februari 2027</p>
        <p className="mt-1 text-xs text-secondary">
          Akad 08.00 WIB · Resepsi 10.00–14.00 WIB. Bumi Samami, Bandung.
        </p>
        <Button
          variant="secondary"
          size="small"
          className="mt-3 w-full"
          onClick={downloadGuestCalendar}
        >
          Tambahkan ke kalender
        </Button>
      </div>

      <figure className="grid gap-2">
        <img
          src="/assets/images/SR9iY.png"
          alt="Denah skematik venue"
          className="w-full rounded-card border border-border"
        />
        <figcaption className="text-center text-[11px] text-muted">{t.mapDisclaimer}</figcaption>
      </figure>

      <a
        href="https://www.google.com/maps/search/?api=1&query=Bumi+Samami+Bandung"
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center justify-center rounded-control bg-primary px-4 text-sm font-semibold text-on-primary"
      >
        Cari venue di peta eksternal ↗
      </a>
      <p className="text-center text-xs text-secondary">
        Pencarian nama venue; pastikan titik tujuan dengan pengirim. Lokasi perangkat tidak diminta.
      </p>

      <div className="grid gap-3">
        <h3 className="text-center font-serif text-xl text-foreground">{t.dressHeading}</h3>
        <div className="flex justify-center gap-3">
          {["Ivory", "Sage", "Cypress"].map((tone) => (
            <div key={tone} className="grid justify-items-center gap-1.5">
              <span
                aria-hidden
                className={`size-10 rounded-full border border-ux-border ${
                  tone === "Ivory" ? "bg-ux-warm" : tone === "Sage" ? "bg-ux-soft" : "bg-primary"
                }`}
              />
              <span className="text-[11px] text-secondary">{tone}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold text-foreground">{t.transportTitle}</p>
        <p className="mt-1 text-xs text-secondary">{t.transportBody}</p>
      </div>

      <details className="rounded-control border border-border p-3">
        <summary className="flex min-h-11 cursor-pointer items-center text-xs font-semibold">
          {t.faqQuestion}
        </summary>
        <p className="text-xs text-secondary">{t.faqAnswer}</p>
      </details>
    </section>
  );
}
