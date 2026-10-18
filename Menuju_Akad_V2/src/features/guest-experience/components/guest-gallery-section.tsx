"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { guestExperienceContent, guestGalleryTexts } from "../content/experience-content";

export function GuestGallerySection({ onBack }: { onBack: () => void }) {
  const photos = guestExperienceContent.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mediaRequested, setMediaRequested] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const photo = openIndex === null ? null : photos[openIndex]!;

  useEffect(() => {
    if (openIndex === null) return;
    function navigate(event: KeyboardEvent) {
      const delta = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
      if (!delta) return;
      event.preventDefault();
      setOpenIndex((index) =>
        index === null ? index : (index + delta + photos.length) % photos.length,
      );
    }
    window.addEventListener("keydown", navigate);
    return () => window.removeEventListener("keydown", navigate);
  }, [openIndex, photos.length]);

  function step(delta: number) {
    setFailedImage(null);
    setOpenIndex((index) =>
      index === null ? index : (index + delta + photos.length) % photos.length,
    );
  }

  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Galeri dan media">
      <button
        type="button"
        onClick={onBack}
        className="flex min-h-11 w-fit items-center gap-1.5 text-xs font-semibold text-secondary"
      >
        ← Kembali
      </button>
      <h2 className="text-center font-serif text-3xl">{guestGalleryTexts.heading}</h2>
      <p className="text-center text-xs font-bold uppercase tracking-widest text-secondary">
        {guestGalleryTexts.title}
      </p>
      <div className="columns-2 gap-2 [column-fill:_balance]">
        {photos.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => {
              setOpenIndex(index);
              setFailedImage(null);
            }}
            className="mb-2 block min-h-11 w-full focus-visible:outline-primary"
            aria-label={`Buka foto ${index + 1} dari ${photos.length}`}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="w-full rounded-card border border-border"
            />
          </button>
        ))}
      </div>
      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold">{guestGalleryTexts.videoNote.title}</p>
        <p className="mt-1 text-xs text-secondary">{guestGalleryTexts.videoNote.body}</p>
        <div className="mt-3 grid gap-2">
          <Button variant="secondary" size="small" onClick={() => setMediaRequested(true)}>
            Muat &amp; putar video ↗
          </Button>
          {mediaRequested && (
            <p role="status" className="text-xs text-secondary">
              Video belum tersedia pada simulasi. Anda tetap dapat menikmati galeri foto.
            </p>
          )}
          <Button
            variant="secondary"
            size="small"
            aria-pressed={musicOn}
            onClick={() => setMusicOn((value) => !value)}
          >
            {musicOn ? "Matikan musik (simulasi)" : "Putar musik (simulasi)"}
          </Button>
          <Button variant="secondary" size="small" disabled aria-describedby="live-unavailable">
            Buka siaran langsung ↗
          </Button>
          <p id="live-unavailable" className="text-xs text-secondary">
            Siaran langsung belum disediakan. Tidak ada media yang diputar otomatis.
          </p>
        </div>
      </div>
      <Dialog
        open={photo !== null}
        onClose={() => setOpenIndex(null)}
        title={`Foto ${(openIndex ?? 0) + 1} dari ${photos.length}`}
      >
        {photo && (
          <div className="grid gap-3">
            {failedImage === photo.src ? (
              <div role="status" className="rounded-card bg-canvas p-6 text-center text-sm">
                Foto tidak dapat dimuat. Coba foto lain atau tutup galeri.
              </div>
            ) : (
              <img
                src={photo.src}
                alt={photo.alt}
                onError={() => setFailedImage(photo.src)}
                className="max-h-[60vh] w-full rounded-card border border-border object-contain"
              />
            )}
            <p className="text-center font-serif text-lg">{photo.caption}</p>
            <p aria-live="polite" className="text-center font-mono text-xs text-secondary">
              {(openIndex ?? 0) + 1} / {photos.length}
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
              <Button variant="secondary" size="small" onClick={() => setOpenIndex(null)}>
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
            <p className="text-center text-xs text-secondary">
              Gunakan panah kiri/kanan. Tekan Esc untuk menutup.
            </p>
          </div>
        )}
      </Dialog>
    </section>
  );
}
