"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CatalogVendor } from "../types/customer-catalog";
export function CatalogVendorForm({
  vendor,
  close,
}: {
  vendor?: CatalogVendor | undefined;
  close: () => void;
}) {
  const router = useRouter(),
    [name, setName] = useState(vendor?.name ?? ""),
    [category, setCategory] = useState(vendor?.category ?? ""),
    [price, setPrice] = useState(vendor?.price ?? 0),
    [description, setDescription] = useState(vendor?.description ?? ""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <form
      className="grid gap-3 rounded-card border border-ux-border bg-surface p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        try {
          const res = await fetch("/api/marketplace/vendors", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...(vendor ? { id: vendor.id } : {}),
              name,
              category,
              price,
              description,
            }),
          });
          const b = await res.json();
          if (!res.ok) throw Error(b.error ?? "Belum tersimpan.");
          router.refresh();
          close();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Gagal menyimpan.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="font-semibold">{vendor ? "Edit vendor" : "Tambah vendor"}</h2>
      <label className="grid gap-1 text-sm">
        Nama vendor
        <input
          required
          maxLength={160}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Kategori
        <input
          required
          maxLength={80}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Harga penawaran (Rp)
        <input
          required
          type="number"
          min={0}
          max={1e12}
          step={1}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Deskripsi
        <textarea
          maxLength={2000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          Simpan vendor
        </Button>
        <Button type="button" variant="secondary" onClick={close}>
          Batal
        </Button>
      </div>
    </form>
  );
}
