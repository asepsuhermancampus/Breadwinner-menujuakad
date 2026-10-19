"use client";

import { useEffect, useRef, useState } from "react";
import type { UploadMetadata } from "../types/vendor";

export function useKybUpload(
  disabled: boolean,
  onReady: (proof: UploadMetadata | null) => void,
  onBusyChange?: (busy: boolean) => void,
) {
  const [phase, setPhase] = useState<"initial" | "processing" | "ready" | "error" | "cancelled">(
    "initial",
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const sequence = useRef(0);
  const blob = useRef("");
  const blocked = useRef(disabled);
  useEffect(() => {
    blocked.current = disabled;
  }, [disabled]);
  useEffect(
    () => () => {
      ++sequence.current;
      if (blob.current) URL.revokeObjectURL(blob.current);
    },
    [],
  );

  async function process(selected: File) {
    if (blocked.current) return;
    const operation = ++sequence.current;
    setFile(selected);
    onReady(null);
    setPreview("");
    if (blob.current) {
      URL.revokeObjectURL(blob.current);
      blob.current = "";
    }
    setError("");
    setProgress(20);
    setPhase("processing");
    onBusyChange?.(true);
    try {
      if (
        !["application/pdf", "image/jpeg", "image/png"].includes(selected.type) ||
        selected.size <= 0 ||
        selected.size > 10 * 1024 * 1024
      )
        throw new Error("Pilih PDF, JPG, atau PNG maksimal 10 MB.");
      if (!navigator.onLine)
        throw new Error(
          "Anda sedang offline. Berkas belum diajukan; coba lagi setelah tersambung.",
        );
      if (selected.type === "application/pdf" && (await selected.slice(0, 5).text()) !== "%PDF-")
        throw new Error("Berkas PDF tidak dapat dibaca. Pilih bukti yang utuh.");
      if (operation !== sequence.current) return;
      const url = URL.createObjectURL(selected);
      blob.current = url;
      if (selected.type !== "application/pdf")
        await new Promise<void>((resolve, reject) => {
          const image = new Image();
          image.onload = () => resolve();
          image.onerror = () =>
            reject(new Error("Gambar tidak dapat dibaca. Berkas lama tidak berubah."));
          image.src = url;
        });
      if (operation !== sequence.current) return;
      setProgress(60);
      await new Promise((resolve) => setTimeout(resolve, 250));
      if (operation !== sequence.current) return;
      if (blocked.current) throw new Error("Akses berubah. Bukti belum diajukan.");
      if (!navigator.onLine)
        throw new Error("Koneksi terputus. Coba proses ulang berkas yang sama.");
      setProgress(100);
      setPreview(url);
      setPhase("ready");
      onReady({ name: selected.name, size: selected.size, type: selected.type });
    } catch (failure) {
      if (operation !== sequence.current) return;
      setError(failure instanceof Error ? failure.message : "Berkas gagal diproses. Coba lagi.");
      setPhase("error");
      if (blob.current) {
        URL.revokeObjectURL(blob.current);
        blob.current = "";
      }
    } finally {
      if (operation === sequence.current) onBusyChange?.(false);
    }
  }

  function cancel() {
    ++sequence.current;
    if (blob.current) {
      URL.revokeObjectURL(blob.current);
      blob.current = "";
    }
    setPhase("cancelled");
    setPreview("");
    setProgress(0);
    setError("");
    onReady(null);
    onBusyChange?.(false);
  }
  return { file, phase, progress, error, preview, process, cancel };
}
