"use client";
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { portraitCrop } from "../domain/portrait-crop";
import { PortraitCropFrame } from "./portrait-crop-frame";
import styles from "./profile-portraits.module.css";
export function PortraitCropDialog({
  source,
  title,
  save,
  close,
}: {
  source: string;
  title: string;
  save: (dataUrl: string) => Promise<void>;
  close: () => void;
}) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1),
    [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const picture = new window.Image();
    picture.onload = () => {
      if (!active) return;
      if (picture.naturalWidth * picture.naturalHeight > 40000000)
        setError("Ukuran gambar terlalu besar. Gunakan foto di bawah 40 megapiksel.");
      else setImage(picture);
    };
    picture.onerror = () => {
      if (active) setError("Foto tidak dapat dibaca. Pilih JPEG, PNG, atau WebP yang valid.");
    };
    picture.src = source;
    return () => {
      active = false;
    };
  }, [source]);
  const crop = image
    ? portraitCrop(image.naturalWidth, image.naturalHeight, zoom, position.x, position.y)
    : null;
  return (
    <Dialog
      open
      title={`Atur foto ${title}`}
      onClose={() => {
        if (!pending) close();
      }}
    >
      <div className={styles.cropContent}>
        <p className={styles.hint}>
          Geser foto dan atur pembesaran. Area persegi ini akan tampil sebagai foto profil.
        </p>
        <PortraitCropFrame
          image={image}
          source={source}
          zoom={zoom}
          position={position}
          setPosition={setPosition}
          pending={pending}
          error={error}
        />
        <label className={styles.zoom}>
          Pembesaran <span>{Math.round(zoom * 100)}%</span>
          <input
            aria-label="Pembesaran foto"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            disabled={!image || pending}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>
        <p className={styles.hint}>
          Gunakan tombol panah saat area foto dipilih untuk menggeser dengan keyboard.
        </p>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" disabled={pending} onClick={close}>
            Batal
          </Button>
          <Button
            disabled={!image || pending}
            onClick={async () => {
              if (!image || !crop) return;
              setPending(true);
              setError("");
              try {
                const canvas = document.createElement("canvas");
                canvas.width = 512;
                canvas.height = 512;
                const context = canvas.getContext("2d");
                if (!context)
                  throw new Error("Browser belum dapat memotong foto. Coba browser lain.");
                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, 512, 512);
                context.drawImage(image, crop.x, crop.y, crop.size, crop.size, 0, 0, 512, 512);
                let data = canvas.toDataURL("image/jpeg", 0.88);
                if (data.length > 349520) data = canvas.toDataURL("image/jpeg", 0.65);
                if (data.length > 349520)
                  throw new Error("Foto masih terlalu besar. Gunakan foto lain.");
                await save(data);
                close();
              } catch (cause) {
                setError(
                  cause instanceof Error
                    ? cause.message
                    : "Foto belum tersimpan. Silakan coba lagi.",
                );
              } finally {
                setPending(false);
              }
            }}
          >
            {pending ? "Menyimpan foto..." : "Simpan foto"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
