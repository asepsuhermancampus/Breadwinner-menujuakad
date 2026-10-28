"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import type { MoodboardItem } from "../types/moodboard";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (item: MoodboardItem) => void | Promise<boolean | void>;
  item?: MoodboardItem | null;
};

export function SaveInspirationDialog({ open, onClose, onSave, item }: Props) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [pending, setPending] = useState(false),
    [error, setError] = useState("");
  const [category, setCategory] = useState<"Dekorasi" | "Busana" | "Detail">(
    item?.category ?? "Dekorasi",
  );
  const [subtitle, setSubtitle] = useState(item?.subtitle ?? "");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [url, setUrl] = useState(item?.vendorRef ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (pending) return;
    setPending(true);
    setError("");
    try {
      const saved = await onSave({
        id: item?.id ?? crypto.randomUUID(),
        title,
        category,
        subtitle: subtitle || `${category} · Referensi baru`,
        notes,
        vendorRef: url,
        ...(item?.imageSrc ? { imageSrc: item.imageSrc } : {}),
      });

      if (saved === false) {
        setError("Perubahan belum tersimpan. Draf tetap tersedia; coba simpan kembali.");
        return;
      }
      setTitle("");
      setSubtitle("");
      setNotes("");
      setUrl("");
      onClose();
    } catch {
      setError("Perubahan belum tersimpan. Draf tetap tersedia; coba simpan kembali.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!pending) onClose();
      }}
      title={item ? "Edit inspirasi & catatan vendor" : "Simpan inspirasi & catatan vendor"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset disabled={pending} className="min-w-0 space-y-4 border-0 p-0">
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <Field
            label="Judul inspirasi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Pelaminan kayu minimalis"
            required
          />

          <Select
            label="Kategori tema"
            value={category}
            onChange={(e) => setCategory(e.target.value as "Dekorasi" | "Busana" | "Detail")}
          >
            <option value="Dekorasi">Dekorasi & Florist</option>
            <option value="Busana">Busana & Tekstur</option>
            <option value="Detail">Detail & Seserahan</option>
          </Select>

          <Field
            label="Subjudul / Konsep"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Misal: Outdoor garden party"
          />

          <Field
            label="URL referensi (Pinterest / Instagram / Website)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />

          <div className="space-y-1.5">
            <label htmlFor="inspiration-notes" className="text-xs font-medium text-secondary">
              Catatan untuk vendor
            </label>
            <textarea
              id="inspiration-notes"
              className="customer-control w-full rounded-control border border-border bg-surface p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Arah warna, bahan, atau elemen yang diinginkan..."
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={pending}>
              Simpan ke moodboard
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
