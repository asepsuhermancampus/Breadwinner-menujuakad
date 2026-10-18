"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { StudioEditor } from "../hooks/use-studio-editor";
import { StudioCrop } from "./studio-crop";

export function StudioAssets({ editor }: { editor: StudioEditor }) {
  const latest = useRef(editor);
  const sequence = useRef(0);
  const completed = useRef({ key: "", src: "" });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const { state, dispatch } = editor;
  useEffect(() => {
    latest.current = editor;
  }, [editor]);
  useEffect(
    () => () => {
      ++sequence.current;
    },
    [state.document.projectId],
  );

  function upload(selected: File) {
    const current = ++sequence.current;
    const projectId = state.document.projectId;
    const key = `${projectId}:${selected.name}:${selected.size}:${selected.lastModified}:${selected.type}`;
    const mb = selected.size / 1024 / 1024;
    setFile(selected);
    setProgress(0);
    if (
      completed.current.key === key &&
      state.document.cover.originalSrc === completed.current.src
    ) {
      setError("Foto ini sudah tersedia; unggahan tidak digandakan.");
      return;
    }
    if (!state.environment.canEdit || state.document.draftStatus !== "editing") {
      setError("Izin edit draf diperlukan untuk mengganti foto.");
      return;
    }
    const valid =
      ["image/jpeg", "image/png", "image/webp"].includes(selected.type) &&
      selected.size <= 10 * 1024 * 1024 &&
      state.document.assetsUsedMb + mb <= 100;
    if (!valid) {
      setError("Gunakan JPG, PNG, atau WebP maksimal 10 MB; kuota total 100 MB.");
      dispatch({ type: "environment", patch: { upload: "error" } });
      return;
    }
    setError("");
    setProgress(20);
    dispatch({ type: "environment", patch: { upload: "pending" } });
    function fail(message: string) {
      if (current !== sequence.current || latest.current.state.document.projectId !== projectId)
        return;
      setError(message);
      setProgress(0);
      latest.current.dispatch({ type: "environment", patch: { upload: "error" } });
    }
    const reader = new FileReader();
    reader.onerror = () => fail("Foto gagal dibaca. Foto sebelumnya tetap dipakai.");
    reader.onload = () => {
      if (current !== sequence.current || typeof reader.result !== "string") return;
      const src = reader.result;
      const image = new Image();
      image.onerror = () => fail("Berkas bukan gambar valid. Foto lama tetap dipakai.");
      image.onload = () => {
        const active = latest.current;
        if (current !== sequence.current || active.state.document.projectId !== projectId) return;
        if (!active.state.environment.canEdit || active.state.document.draftStatus !== "editing") {
          fail("Akses edit berubah. Foto sebelumnya tetap dipakai.");
          return;
        }
        if (active.state.document.assetsUsedMb + mb > 100) {
          fail("Kuota aset berubah. Foto lama tetap dipakai; sediakan ruang sebelum mencoba lagi.");
          return;
        }
        if (active.state.environment.upload !== "pending") return;
        active.edit({
          ...active.state.document,
          cover: { src, originalSrc: src, crop: { x: 50, y: 50, scale: 1, ratio: "375:340" } },
          assetsUsedMb: active.state.document.assetsUsedMb + mb,
        });
        completed.current = { key, src };
        setProgress(100);
        active.dispatch({ type: "environment", patch: { upload: "idle" } });
      };
      image.src = src;
    };
    reader.readAsDataURL(selected);
  }
  return (
    <div className="grid gap-4">
      <h2 className="text-sm font-semibold">Media & blok</h2>
      <p className="font-mono text-xs text-secondary">
        {state.document.assetsUsedMb.toFixed(1)} MB / 100 MB
      </p>
      <label className="grid gap-2 text-xs font-semibold">
        Unggah media
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="min-h-11 w-full text-xs"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) upload(selected);
            event.target.value = "";
          }}
        />
      </label>
      {progress > 0 && (
        <progress
          aria-label="Progres pemrosesan foto lokal"
          max={100}
          value={progress}
          className="w-full"
        />
      )}
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="small"
          disabled={!file || state.environment.upload === "pending" || progress === 100}
          onClick={() => {
            if (file) upload(file);
          }}
        >
          Ulangi unggahan
        </Button>
        <Button
          variant="ghost"
          size="small"
          onClick={() => {
            ++sequence.current;
            setProgress(0);
            setError("");
            setFile(null);
            dispatch({ type: "environment", patch: { upload: "idle" } });
          }}
        >
          Batalkan
        </Button>
      </div>
      <p className="text-xs leading-relaxed text-secondary">
        Gambar diproses lokal. SVG dan URL asing tidak diimpor. Foto lama dipertahankan sampai
        gambar baru valid.
      </p>
      <StudioCrop editor={editor} />
    </div>
  );
}
