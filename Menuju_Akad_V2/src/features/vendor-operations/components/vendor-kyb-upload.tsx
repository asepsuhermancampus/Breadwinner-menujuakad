"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useKybUpload } from "./vendor-kyb-upload-state";
import type { UploadMetadata } from "../types/vendor";

export function VendorKybUpload({
  disabled = false,
  onReady,
  onBusyChange,
}: {
  disabled?: boolean;
  onReady: (proof: UploadMetadata | null) => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const upload = useKybUpload(disabled, onReady, onBusyChange);
  const input = useRef<HTMLInputElement>(null);
  const fileName = upload.file?.name ?? "bukti_rekening_revisi.pdf";
  const statuses = {
    initial: "perlu revisi",
    ready: "siap ditinjau",
    processing: "diproses lokal",
    cancelled: "dibatalkan",
    error: "gagal diproses",
  };
  return (
    <div className="grid gap-3 rounded-card border border-border bg-canvas p-4">
      <div className="flex items-start gap-3">
        <Icon name="documents" className="mt-0.5 text-secondary" />
        <div className="min-w-0">
          <p className="break-all text-sm font-semibold">{fileName}</p>
          <p className="mt-1 text-xs text-secondary">
            {upload.file
              ? `${(upload.file.size / 1024 / 1024).toLocaleString("id-ID", { maximumFractionDigits: 1 })} MB`
              : "1,2 MB"}{" "}
            · privat · {statuses[upload.phase]}
          </p>
        </div>
      </div>
      <input
        ref={input}
        type="file"
        aria-label="Ganti bukti rekening privat"
        accept="application/pdf,image/jpeg,image/png"
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void upload.process(file);
          event.target.value = "";
        }}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="small"
          disabled={disabled || upload.phase === "processing"}
          onClick={() => input.current?.click()}
        >
          Ganti berkas
        </Button>
        {upload.phase === "processing" && (
          <Button variant="ghost" size="small" onClick={upload.cancel}>
            Batalkan pemrosesan
          </Button>
        )}
        {(upload.phase === "error" || upload.phase === "cancelled") && upload.file && (
          <Button
            variant="secondary"
            size="small"
            disabled={disabled}
            onClick={() => {
              if (upload.file) void upload.process(upload.file);
            }}
          >
            Coba lagi
          </Button>
        )}
      </div>
      {upload.phase === "processing" && (
        <label className="grid gap-1 text-xs text-secondary">
          Progres pemrosesan lokal {upload.progress}%
          <progress max={100} value={upload.progress} className="w-full" />
        </label>
      )}
      {upload.error && (
        <p role="alert" className="text-xs text-danger">
          {upload.error}
        </p>
      )}
      {upload.phase === "ready" && (
        <p role="status" className="text-xs text-success">
          Berkas dapat dibaca. Konfirmasikan nama pemilik terlihat utuh sebelum mengirim.
        </p>
      )}
      {upload.preview && upload.file?.type.startsWith("image/") && (
        <img
          src={upload.preview}
          alt="Pratinjau privat bukti rekening"
          className="max-h-60 w-full rounded-control object-contain"
        />
      )}
      {upload.preview && upload.file?.type === "application/pdf" && (
        <a
          href={upload.preview}
          download={fileName}
          className="flex min-h-11 items-center gap-2 text-xs font-semibold text-brand-secondary underline"
        >
          <Icon name="download" size={14} />
          Unduh salinan PDF lokal untuk diperiksa
        </a>
      )}
      <p className="text-xs leading-relaxed text-secondary">
        PDF/JPG/PNG ≤10 MB. Pratinjau hanya selama layar terbuka; tidak dikirim ke storage atau
        ditampilkan di katalog publik.
      </p>
    </div>
  );
}
