"use client";

import { useEffect, useRef, useState } from "react";
import { validateMomentUpload } from "../domain/moment-upload";
import type { MomentUpload } from "../types/experience";

export function useMomentUpload() {
  const [upload, setUpload] = useState<MomentUpload | null>({
    fileName: "momen-kami.jpg",
    fileSizeMb: 2.8,
    mimeType: "image/jpeg",
    consent: false,
    status: "DRAFT",
  });
  const [preview, setPreview] = useState("/assets/images/editorial-6.png");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const active = useRef(true);
  const sending = useRef(false);
  const blob = useRef<string | null>(null);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      if (blob.current) URL.revokeObjectURL(blob.current);
    };
  }, []);

  function choose(file: File) {
    const result = validateMomentUpload(file, true);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (blob.current) URL.revokeObjectURL(blob.current);
    blob.current = URL.createObjectURL(file);
    setPreview(blob.current);
    setUpload({
      fileName: file.name,
      fileSizeMb: file.size / (1024 * 1024),
      mimeType: file.type as MomentUpload["mimeType"],
      consent: false,
      status: "DRAFT",
    });
    setProgress(0);
    setError(null);
  }

  async function submit() {
    if (!upload || sending.current || upload.status === "MODERATION") return;
    const result = validateMomentUpload(
      { type: upload.mimeType, size: upload.fileSizeMb * 1024 * 1024 },
      upload.consent,
    );
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (!navigator.onLine) {
      setError("Anda sedang offline. Foto tetap privat; coba kirim lagi saat terhubung.");
      return;
    }
    sending.current = true;
    setError(null);
    setUpload({ ...upload, status: "QUEUED" });
    for (const value of [25, 60, 100]) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      if (!active.current) {
        sending.current = false;
        return;
      }
      if (!navigator.onLine) {
        setUpload({ ...upload, status: "DRAFT" });
        setError("Koneksi terputus. Foto belum masuk moderasi; coba kirim lagi.");
        sending.current = false;
        return;
      }
      setProgress(value);
    }
    setUpload({ ...upload, status: "MODERATION" });
    sending.current = false;
  }

  function withdraw() {
    if (sending.current) return;
    if (blob.current) {
      URL.revokeObjectURL(blob.current);
      blob.current = null;
    }
    setUpload(null);
    setPreview("");
    setError(null);
    setProgress(0);
  }

  return {
    upload,
    preview,
    error,
    progress,
    choose,
    submit,
    withdraw,
    consent: (value: boolean) =>
      setUpload((current) => (current ? { ...current, consent: value } : current)),
  };
}
