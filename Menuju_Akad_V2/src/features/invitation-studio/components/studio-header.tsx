"use client";

import { useState } from "react";
import { ArrowLeft, Undo2, Redo2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Button } from "@/components/ui/button";
import type { StudioEditor } from "../hooks/use-studio-editor";

type Props = {
  editor: StudioEditor;
  mode: string;
  onMode: (mode: "visual" | "form") => void;
  zoom: number;
  onZoom: (zoom: number) => void;
  viewport: number;
  onViewport: (width: number) => void;
  onHistory: () => void;
  onReview: () => void;
  onPreview: () => void;
  onSettings: () => void;
  onExit: () => void;
};
export function StudioHeader({
  editor,
  mode,
  onMode,
  zoom,
  onZoom,
  viewport,
  onViewport,
  onHistory,
  onReview,
  onPreview,
  onSettings,
  onExit,
}: Props) {
  const { state, dispatch } = editor;
  const [renaming, setRenaming] = useState(false);
  const status = {
    saved: "✓ Draf tersimpan di perangkat",
    dirty: "Perubahan belum tersimpan",
    saving: "Menyimpan draf…",
    offline: "Offline · draf tetap di perangkat",
    conflict: "Konflik versi · perlu ditinjau",
    forbidden: "Izin mengedit dicabut",
    error: "Gagal menyimpan · draf dipertahankan",
  }[state.saveStatus];
  return (
    <>
      <header className="flex min-h-20 flex-wrap items-center gap-3 border-b border-ux-border bg-canvas px-4 py-3 sm:px-6">
        <BrandLogo />
        {editor.trial && (
          <Button disabled={editor.persisting} size="small" onClick={() => void editor.saveTrial()}>
            Simpan draf trial
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Kembali ke daftar undangan"
          onClick={onExit}
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="sr-only">Studio Undangan</h1>
          {renaming ? (
            <input
              aria-label="Nama proyek"
              className="min-h-11 w-full rounded-control border border-border px-2"
              defaultValue={state.document.title}
              autoFocus
              onBlur={(event) => {
                dispatch({ type: "rename", title: event.target.value });
                setRenaming(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
            />
          ) : (
            <button
              className="min-h-11 text-left text-sm font-semibold"
              onClick={() => setRenaming(true)}
            >
              {state.document.title} <span aria-hidden="true">⌄</span>
            </button>
          )}
          <p className="text-xs text-secondary">
            {editor.trial ? "Simpan draf trial untuk menyimpan di browser ini. " : ""}
            Draf v{state.document.revision} · versi aktif{" "}
            {state.document.activeVersion ? `v${state.document.activeVersion}` : "belum ada"}
          </p>
        </div>
        <p role="status" className="text-xs text-secondary">
          {editor.trial
            ? editor.storageError || "Gunakan Simpan draf trial untuk menyimpan perubahan."
            : editor.remote
              ? editor.storageError ||
                (editor.persisting
                  ? "Menyimpan pada akun…"
                  : state.dirty
                    ? "Perubahan belum tersimpan"
                    : "✓ Draf tersimpan pada akun")
              : editor.storageError
                ? "Penyimpanan perangkat gagal · ekspor draf"
                : status}
        </p>
        <Button variant="secondary" size="small" disabled={editor.remote} onClick={onHistory}>
          Riwayat versi
        </Button>
        <Button size="small" className="bg-primary" onClick={onReview}>
          Review & publikasi
        </Button>
      </header>
      <div
        className="flex min-h-16 flex-wrap items-center gap-2 border-b border-ux-border bg-surface px-4 py-2 sm:px-6"
        aria-label="Toolbar studio"
      >
        {(
          [
            ["visual", "Visual"],
            ["form", "Form"],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            size="small"
            variant={mode === value ? "primary" : "ghost"}
            aria-pressed={mode === value}
            onClick={() => onMode(value)}
          >
            {label}
          </Button>
        ))}
        <div className="hidden flex-1 sm:block" />
        <label className="flex min-h-11 items-center gap-2 text-xs">
          Viewport
          <select
            aria-label="Ukuran hasil"
            className="min-h-11 rounded-control bg-subtle px-2"
            value={viewport}
            onChange={(event) => onViewport(Number(event.target.value))}
          >
            {[375, 768, 1280].map((width) => (
              <option key={width} value={width}>
                {width}
              </option>
            ))}
          </select>
        </label>
        <select
          aria-label="Zoom kanvas"
          className="min-h-11 rounded-control bg-subtle px-2 text-xs"
          value={zoom}
          onChange={(event) => onZoom(Number(event.target.value))}
        >
          {[50, 75, 100, 125, 150].map((scale) => (
            <option key={scale} value={scale}>
              {scale}%
            </option>
          ))}
        </select>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Urungkan"
          disabled={!state.past.length}
          onClick={() => dispatch({ type: "undo" })}
        >
          <Undo2 size={18} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ulangi perubahan"
          disabled={!state.future.length}
          onClick={() => dispatch({ type: "redo" })}
        >
          <Redo2 size={18} />
        </Button>
        <Button variant="ghost" size="small" onClick={onPreview}>
          Lihat hasil
        </Button>
        <Button variant="ghost" size="small" onClick={onSettings}>
          RSVP & Privasi (Draf)
        </Button>
      </div>
    </>
  );
}
