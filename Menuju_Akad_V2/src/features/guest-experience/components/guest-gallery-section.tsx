"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  guestExperienceContent,
  guestGalleryTexts,
} from "@/features/guest-experience/content/experience-content";

function useKeyDown(onKey: (key: string) => void) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onKey("Escape");
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onKey]);
}

export function GuestGallerySection({ onBack }: { onBack: () => void }) {
  const content = guestExperienceContent.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  function closeLightbox() {
    setOpenIndex(null);
  }

  useKeyDown((key) => {
    if (openIndex === null) return;
    if (key === "Escape") setOpenIndex(null);
  });

  function step(delta: number) {
    setOpenIndex((prev) =>
      prev === null ? prev : (prev + delta + content.length) % content.length,
    );
  }

  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Galeri dan media">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-xs font-semibold text-secondary hover:text-foreground"
      >
        ← Kembali
      </button>

      <h2 className="text-center font-serif text-3xl text-foreground">
        {guestGalleryTexts.heading}
      </h2>

      {openIndex === null ? (
        <>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-muted">
            {guestGalleryTexts.title}
          </p>
          <div className="columns-2 gap-2 [column-fill:_balance]">
            {content.map((photo, i) => (
              <button
                key={photo.src}
                type="button"
                onClick={() => setOpenIndex(i)}
                className="mb-2 block w-full focus-visible:outline-primary"
                aria-label={`Buka foto ${i + 1} dari ${content.length}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full rounded-card border border-border"
                />
              </button>
            ))}
          </div>

          <div className="rounded-card border border-border bg-canvas p-4">
            <p className="text-xs font-bold text-foreground">{guestGalleryTexts.videoNote.title}</p>
            <p className="mt-1 text-xs text-secondary">{guestGalleryTexts.videoNote.body}</p>
            <div className="mt-3 grid gap-2">
              {!mediaLoaded ? (
                <Button
                  variant="secondary"
                  size="small"
                  className="w-full"
                  onClick={() => setMediaLoaded(true)}
                >
                  Muat &amp; putar video ↗
                </Button>
              ) : (
                <p
                  className="rounded-control bg-surface p-2 text-center text-[11px] text-muted"
                  role="status"
                >
                  Pemutar video simulasi — tidak ada konten eksternal yang dimuat pada pratinjau
                  ini.
                </p>
              )}
              <Button
                variant="secondary"
                size="small"
                className="w-full"
                aria-pressed={musicOn}
                onClick={() => setMusicOn((v) => !v)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Icon name={musicOn ? "check" : "sparkles"} size={13} />
                  {musicOn ? "Musik diputar (simulasi)" : "Putar musik"}
                </span>
              </Button>
              <Button variant="secondary" size="small" className="w-full">
                Buka siaran langsung ↗
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div
          className="grid gap-3"
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${openIndex + 1} dari ${content.length}`}
        >
          <img
            src={content[openIndex]!.src}
            alt={content[openIndex]!.alt}
            className="max-h-[60vh] w-full rounded-card border border-border object-cover"
          />
          <p className="text-center font-serif text-lg text-foreground">
            {guestGalleryTexts.lightboxCaption}
          </p>
          <p className="text-center font-mono text-[11px] text-muted">
            {openIndex + 1} / {content.length}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="secondary"
              size="small"
              onClick={() => step(-1)}
              aria-label="Foto sebelumnya"
            >
              ←
            </Button>
            <Button variant="secondary" size="small" onClick={closeLightbox}>
              Tutup foto
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => step(1)}
              aria-label="Foto berikutnya"
            >
              →
            </Button>
          </div>
          <button
            type="button"
            onClick={closeLightbox}
            className="text-center text-[11px] text-muted underline underline-offset-2"
          >
            Tekan Esc atau klik tombol untuk menutup
          </button>
        </div>
      )}
    </section>
  );
}
