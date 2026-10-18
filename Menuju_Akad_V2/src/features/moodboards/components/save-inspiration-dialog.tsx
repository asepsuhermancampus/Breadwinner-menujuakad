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
  onSave: (item: MoodboardItem) => void;
};

export function SaveInspirationDialog({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Dekorasi" | "Busana" | "Detail">("Dekorasi");
  const [subtitle, setSubtitle] = useState("");
  const [notes, setNotes] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: `mb-${Date.now()}`,
      title,
      category,
      subtitle: subtitle || `${category} · Referensi baru`,
      notes,
      vendorRef: url,
      imageSrc: "/assets/images/editorial-6.png",
    });

    setTitle("");
    setSubtitle("");
    setNotes("");
    setUrl("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Simpan inspirasi & catatan vendor">
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="text-xs font-medium text-secondary">Catatan untuk vendor</label>
          <textarea
            className="w-full rounded-control border border-border bg-surface p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
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
          <Button type="submit">Simpan ke moodboard</Button>
        </div>
      </form>
    </Dialog>
  );
}
