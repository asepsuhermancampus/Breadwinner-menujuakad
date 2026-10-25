"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { rsvpExpiryText } from "@/features/guest-experience/content/experience-content";
import { createSessionRsvpAdapter, uniquePeopleNote } from "../domain/session-rsvp";
import type { RsvpSession } from "../types/experience";

export function SessionRsvpSection({
  onBack,
  adapter,
  now = () => new Date(),
}: {
  onBack: () => void;
  adapter: ReturnType<typeof createSessionRsvpAdapter>;
  now?: () => Date;
}) {
  const [initial] = useState(() => adapter.read());
  const [sessions, setSessions] = useState<RsvpSession[]>(initial.sessions);
  const [version, setVersion] = useState(initial.version);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(sessions) !== JSON.stringify(adapter.read().sessions);

  function update(id: string, patch: Partial<RsvpSession>) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    setSavedAt(null);
    setError(null);
  }

  function handleSave() {
    if (!navigator.onLine) {
      setSavedAt(null);
      setError("Anda sedang offline. Jawaban belum disimpan; coba lagi saat terhubung.");
      return;
    }
    const result = adapter.save(sessions, version, now().toISOString());
    if (!result.ok) {
      setSavedAt(null);
      setError(
        result.reason === "deadline"
          ? "Batas perubahan sudah lewat."
          : result.reason === "quota"
            ? "Kuota sesi diperiksa ulang saat disimpan; periksa jumlah orang."
            : result.reason === "revoked"
              ? "Akses undangan telah dicabut. Hubungi pengirim undangan."
              : result.reason === "stale"
                ? "Jawaban berubah di sesi lain. Muat jawaban terbaru sebelum mencoba lagi."
                : "Jawaban tidak valid.",
      );
      return;
    }
    setError(null);
    setVersion(adapter.read().version);
    setSavedAt(now().toISOString());
  }

  return (
    <section className="grid gap-5 px-5 py-6" aria-label="RSVP per sesi">
      <button
        type="button"
        onClick={() => {
          if (dirty && !window.confirm("Tinggalkan perubahan RSVP yang belum disimpan?")) return;
          onBack();
        }}
        className="flex min-h-11 w-fit items-center gap-1.5 text-xs font-semibold text-secondary hover:text-foreground"
      >
        ← Kembali
      </button>

      <header className="grid gap-2 text-center">
        <h2 className="whitespace-pre-line font-serif text-4xl leading-tight text-foreground">
          {"Konfirmasi\nkehadiran."}
        </h2>
        <p className="text-xs text-secondary">
          Budi Santoso &amp; Partner · jumlah orang diatur per sesi.
        </p>
      </header>

      {sessions.map((s) => (
        <div key={s.id} className="rounded-card border border-border bg-surface p-4">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold text-foreground">{s.name}</h3>
            <span className="font-mono text-[11px] text-secondary">{s.time}</span>
          </div>

          <div className="mt-3 grid gap-2">
            <span className="text-[11px] font-semibold text-secondary">Jawaban · {s.name}</span>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="small"
                variant={s.status === "ATTENDING" ? "primary" : "secondary"}
                aria-pressed={s.status === "ATTENDING"}
                onClick={() => update(s.id, { status: "ATTENDING", pax: s.pax < 1 ? 1 : s.pax })}
              >
                Hadir
              </Button>
              <Button
                size="small"
                variant={s.status === "DECLINED" ? "primary" : "secondary"}
                aria-pressed={s.status === "DECLINED"}
                onClick={() => update(s.id, { status: "DECLINED", pax: 0 })}
              >
                Berhalangan
              </Button>
            </div>

            <span className="text-[11px] font-semibold text-secondary">Jumlah · {s.name}</span>
            <div className="flex items-center justify-between rounded-control border border-ux-control-border bg-surface px-2 py-1">
              <button
                type="button"
                aria-label={`Kurangi jumlah sesi ${s.name}`}
                disabled={s.status === "DECLINED" || s.pax <= 1}
                onClick={() => update(s.id, { pax: Math.max(1, s.pax - 1) })}
                className="grid size-11 place-items-center text-lg text-secondary disabled:opacity-40"
              >
                −
              </button>
              <span className="font-mono text-sm font-bold text-foreground">
                {s.status === "DECLINED" ? "0 orang" : `${s.pax} orang`}
              </span>
              <button
                type="button"
                aria-label={`Tambah jumlah sesi ${s.name}`}
                disabled={s.status === "DECLINED" || s.pax >= s.maxQuota}
                onClick={() => update(s.id, { pax: Math.min(s.maxQuota, s.pax + 1) })}
                className="grid size-11 place-items-center text-lg text-secondary disabled:opacity-40"
              >
                +
              </button>
            </div>
            <p className="text-[11px] text-muted">Maksimal {s.maxQuota} orang untuk sesi ini</p>
          </div>
        </div>
      ))}

      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold text-foreground">Kehadiran dicatat per sesi.</p>
        <p className="mt-1 text-xs text-secondary">{uniquePeopleNote(sessions)}</p>
      </div>

      <Button className="w-full" disabled={Boolean(savedAt)} onClick={handleSave}>
        Simpan jawaban per sesi
      </Button>

      {error && (
        <div className="grid gap-2">
          <p
            role="alert"
            className="rounded-control border border-danger/30 bg-danger-bg p-3 text-xs text-danger"
          >
            {error}
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              const latest = adapter.read();
              setSessions(latest.sessions);
              setVersion(latest.version);
              setError(null);
              setSavedAt(null);
            }}
          >
            Muat jawaban terbaru
          </Button>
        </div>
      )}
      {savedAt && (
        <p
          role="status"
          className="rounded-control border border-success/30 bg-success-bg p-3 text-xs font-semibold text-success"
        >
          ✓ Jawaban per sesi tersimpan (simulasi). {uniquePeopleNote(sessions)}
        </p>
      )}

      <p className="text-center text-[11px] text-muted">{rsvpExpiryText}</p>
    </section>
  );
}
