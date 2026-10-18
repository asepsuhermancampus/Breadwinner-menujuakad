"use client";

import { Button } from "@/components/ui/button";

export function OptionalFeaturesPanel({ onGallery }: { onGallery: () => void }) {
  return (
    <details className="rounded-card border border-border bg-canvas p-4">
      <summary className="flex min-h-11 cursor-pointer items-center text-xs font-bold">
        Fitur tambahan &amp; alternatif
      </summary>
      <dl className="grid gap-3 text-xs">
        <div>
          <dt className="font-semibold">Video &amp; siaran langsung · belum tersedia</dt>
          <dd className="mt-1 text-secondary">
            Nikmati foto yang telah dipilih pasangan di galeri.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Hotel &amp; transportasi · panduan tersedia</dt>
          <dd className="mt-1 text-secondary">
            Hubungi pengirim undangan untuk kebutuhan mobilitas dan rekomendasi penginapan.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Filter Instagram · belum tersedia</dt>
          <dd className="mt-1 text-secondary">
            Foto momen dapat dikirim untuk ditinjau dengan persetujuan Anda.
          </dd>
        </div>
        <div>
          <dt className="font-semibold">Wallet · belum didukung dalam pratinjau</dt>
          <dd className="mt-1 text-secondary">
            Gunakan tiket dari tautan undangan personal. Tidak ada pemasangan atau izin notifikasi
            otomatis.
          </dd>
        </div>
      </dl>
      <Button variant="secondary" className="mt-3 w-full" onClick={onGallery}>
        Buka galeri foto
      </Button>
    </details>
  );
}
