"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import type { VendorPackage } from "../types/vendor";

type Props = { item: VendorPackage; onApply: (item: VendorPackage) => void; onClose: () => void };
export function VendorPackageDialog({ item, onApply, onClose }: Props) {
  const [draft, setDraft] = useState(item);
  const [discard, setDiscard] = useState(false);
  const [error, setError] = useState("");
  const dirty = JSON.stringify(draft) !== JSON.stringify(item);
  function close() {
    if (dirty) setDiscard(true);
    else onClose();
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (
      !draft.name.trim() ||
      !Number.isSafeInteger(draft.priceIdr) ||
      draft.priceIdr <= 0 ||
      !draft.deliverables.some((text) => text.trim())
    ) {
      setError("Isi nama, harga rupiah bulat positif dan minimal satu deliverable.");
      return;
    }
    onApply({
      ...draft,
      name: draft.name.trim(),
      deliverables: draft.deliverables.map((v) => v.trim()).filter(Boolean),
    });
  }
  return (
    <>
      <Dialog
        open
        title={item.name ? "Edit paket layanan" : "Tambah paket layanan"}
        onClose={close}
      >
        <form className="grid gap-5" onSubmit={submit}>
          <p className="text-sm leading-relaxed text-secondary">
            Harga dan deliverables baru tidak mengubah pesanan yang sudah disepakati. Simpan
            perubahan katalog setelah menambahkan draf paket.
          </p>
          <Field
            label="Nama paket"
            required
            maxLength={100}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Field
            label="Harga paket (IDR)"
            type="number"
            required
            min={1}
            step={1}
            value={draft.priceIdr || ""}
            onChange={(e) => setDraft({ ...draft, priceIdr: Number(e.target.value) })}
            hint="Masukkan nominal rupiah tanpa pemisah ribuan."
          />
          <Field
            label="Durasi layanan"
            value={draft.duration}
            onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
          />
          <label className="grid gap-2 text-sm font-medium">
            Deliverables, satu per baris
            <textarea
              required
              rows={4}
              className="w-full rounded-control border border-ux-border px-3 py-3 text-sm font-normal"
              value={draft.deliverables.join("\n")}
              onChange={(e) => setDraft({ ...draft, deliverables: e.target.value.split("\n") })}
            />
          </label>
          <label className="flex min-h-11 items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
            />
            Aktif untuk pemesanan baru
          </label>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={close}>
              Batal
            </Button>
            <Button type="submit">Terapkan ke draf katalog</Button>
          </div>
        </form>
      </Dialog>
      <Dialog open={discard} title="Abaikan perubahan paket?" onClose={() => setDiscard(false)}>
        <p className="text-sm text-secondary">Perubahan paket ini belum masuk ke draf katalog.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setDiscard(false)}>
            Lanjutkan edit
          </Button>
          <Button variant="danger" onClick={onClose}>
            Abaikan perubahan
          </Button>
        </div>
      </Dialog>
    </>
  );
}
