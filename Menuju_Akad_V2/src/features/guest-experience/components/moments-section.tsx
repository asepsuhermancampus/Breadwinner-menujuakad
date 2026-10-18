"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { guestMomentsTexts } from "../content/experience-content";
import { useMomentUpload } from "./use-moment-upload";

export function MomentsSection({ onBack }: { onBack: () => void }) {
  const t = guestMomentsTexts;
  const state = useMomentUpload();
  const input = useRef<HTMLInputElement>(null);
  const { upload } = state;
  const sending = upload?.status === "QUEUED";
  const submitted = upload?.status === "MODERATION";
  function leave() {
    if (upload && !submitted && !window.confirm("Tinggalkan foto privat yang belum dikirim?"))
      return;
    onBack();
  }
  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Foto momen">
      <button
        type="button"
        onClick={leave}
        className="flex min-h-11 w-fit items-center gap-1.5 text-xs font-semibold text-secondary"
      >
        ← Kembali
      </button>
      <header className="grid gap-2 text-center">
        <h2 className="whitespace-pre-line font-serif text-4xl leading-tight">{t.heading}</h2>
        <p className="text-xs text-secondary">{t.intro}</p>
      </header>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png"
        aria-label="Pilih foto JPG atau PNG"
        className="sr-only"
        disabled={sending || submitted}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) state.choose(file);
          event.target.value = "";
        }}
      />
      {upload && (
        <figure className="grid gap-2">
          <img
            src={state.preview}
            alt={`Pratinjau privat ${upload.fileName}`}
            className="max-h-72 w-full rounded-card border border-border object-cover"
          />
          <figcaption className="break-all text-center font-mono text-xs text-secondary">
            {upload.fileName} ·{" "}
            {upload.fileSizeMb.toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB
          </figcaption>
        </figure>
      )}
      <Button
        variant="secondary"
        disabled={sending || submitted}
        onClick={() => input.current?.click()}
      >
        {upload ? "Ganti foto" : "Pilih foto"}
      </Button>
      <p className="text-center text-xs text-secondary">{t.restrictions}</p>
      {upload && (
        <>
          <label className="flex min-h-11 items-start gap-2.5 text-xs text-secondary">
            <input
              type="checkbox"
              checked={upload.consent}
              disabled={sending || submitted}
              onChange={(event) => state.consent(event.target.checked)}
              className="mt-0.5"
            />
            <span>{t.consentLabel}</span>
          </label>
          <Button disabled={!upload.consent || sending || submitted} onClick={state.submit}>
            {submitted
              ? "Menunggu moderasi"
              : sending
                ? "Mengirim simulasi…"
                : state.error
                  ? "Coba kirim lagi"
                  : "Kirim untuk moderasi"}
          </Button>
          {!upload.consent && (
            <p className="text-xs text-secondary">
              Berikan izin sebelum mengirim foto untuk ditinjau.
            </p>
          )}
          {sending && (
            <label className="grid gap-1 text-xs">
              Progres simulasi {state.progress}%
              <progress value={state.progress} max={100} className="w-full" />
            </label>
          )}
          {submitted && (
            <p
              role="status"
              className="rounded-control border border-success/30 bg-success-bg p-3 text-xs font-semibold text-success"
            >
              ✓ Foto masuk antrean moderasi (simulasi). Tidak otomatis tampil di galeri publik.
            </p>
          )}
          <Button variant="ghost" disabled={sending} onClick={state.withdraw}>
            {submitted ? "Tarik foto & persetujuan" : "Hapus foto privat"}
          </Button>
        </>
      )}
      {state.error && (
        <p
          role="alert"
          className="rounded-control border border-danger/30 bg-danger-bg p-3 text-xs text-danger"
        >
          {state.error}
        </p>
      )}
      {!upload && (
        <p role="status" className="text-xs text-secondary">
          Tidak ada foto dalam antrean lokal. Pratinjau dan izin telah dihapus.
        </p>
      )}
      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold">{t.queueNote.title}</p>
        <p className="mt-1 text-xs text-secondary">{t.queueNote.body}</p>
        <p className="mt-2 text-xs text-secondary">
          Simulasi menyimpan pratinjau hanya selama layar ini terbuka. Tidak ada berkas dikirim atau
          disimpan server; kebijakan retensi produksi belum tersedia.
        </p>
      </div>
    </section>
  );
}
