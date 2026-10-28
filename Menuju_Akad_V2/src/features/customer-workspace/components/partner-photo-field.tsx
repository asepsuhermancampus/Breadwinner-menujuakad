"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PortraitCropDialog } from "./portrait-crop-dialog";
import styles from "./profile-portraits.module.css";
export function PartnerPhotoField({
  title,
  value,
  disabled,
  changed,
  readOnly = false,
}: {
  title: string;
  value: string | null;
  disabled: boolean;
  changed: (value: string | null) => void;
  readOnly?: boolean;
}) {
  const [source, setSource] = useState<string | null>(null),
    [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  useEffect(
    () => () => {
      if (source) URL.revokeObjectURL(source);
    },
    [source],
  );
  async function commit(dataUrl?: string) {
    changed(dataUrl ?? null);
  }
  return (
    <>
      <div className={styles.photoField}>
        <span className={styles.portrait}>
          {value ? (
            <Image src={value} alt={`Foto ${title}`} width={80} height={80} unoptimized />
          ) : (
            <Icon name="users" size={32} />
          )}
        </span>
        {!readOnly && (
          <div className={styles.photoTools}>
            <input
              ref={input}
              type="file"
              hidden
              accept="image/jpeg,image/png,image/webp"
              aria-label={`Unggah foto ${title}`}
              disabled={disabled}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                setError("");
                if (!file) return;
                if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                  setError("Pilih foto JPEG, PNG, atau WebP.");
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  setError("Ukuran foto maksimal 5 MB.");
                  return;
                }
                setSource(URL.createObjectURL(file));
              }}
            />
            <Button
              variant="secondary"
              size="small"
              disabled={disabled}
              onClick={() => input.current?.click()}
            >
              <Icon name="upload" size={14} />
              {value ? "Ganti foto" : "Unggah foto"}
            </Button>
            {value && (
              <Button
                variant="secondary"
                size="icon"
                disabled={disabled}
                aria-label={`Hapus foto ${title}`}
                title="Hapus foto"
                onClick={() => {
                  setError("");
                  changed(null);
                }}
              >
                <Icon name="trash" size={14} />
              </Button>
            )}
          </div>
        )}
      </div>
      {!readOnly && (
        <p className={styles.hint}>
          JPEG, PNG, atau WebP hingga 5 MB. Atur crop persegi sebelum menyimpan.
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {source && (
        <PortraitCropDialog
          key={source}
          source={source}
          title={title}
          save={commit}
          close={() => setSource(null)}
        />
      )}
    </>
  );
}
