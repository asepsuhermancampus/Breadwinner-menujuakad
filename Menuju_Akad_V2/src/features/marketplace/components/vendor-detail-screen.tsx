"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatIdr } from "../utils/marketplace-calc";
import { saveBundleSelection } from "../utils/bundle-selection-store";
import type { VendorPackageSelection } from "../types/marketplace";

type Props = {
  onBack?: () => void;
  onAddToBundle?: (selection?: VendorPackageSelection) => void;
};

export function VendorDetailScreen({ onBack, onAddToBundle }: Props) {
  const [selectedPkg, setSelectedPkg] = useState("p2");
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const packages = [
    {
      id: "p1",
      name: "Akad Intimate",
      scope: "4 jam · 1 fotografer · 150 foto edit",
      price: 7500000,
      availability: "Periksa tanggal",
    },
    {
      id: "p2",
      name: "Sehari Penuh (Akad & Resepsi)",
      scope: "8 jam · 2 fotografer · galeri digital & album · estimasi 21 hari",
      price: 15000000,
      availability: "14 Feb 2027 Tersedia",
      isPrimary: true,
    },
    {
      id: "p3",
      name: "Cinema Add-on (Video)",
      scope: "Video sinematik 3–5 menit + teaser 60 detik",
      price: 5000000,
      availability: "Cek kru terpisah",
    },
  ];

  const activePackage = packages.find((pkg) => pkg.id === selectedPkg) ?? packages[1]!;

  function handleAdd() {
    const payload: VendorPackageSelection = {
      packageId: activePackage.id,
      vendorId: "v-lensa",
      vendorName: "Lensa Teduh Photo",
      packageName: activePackage.name,
      priceIdr: activePackage.price,
    };
    saveBundleSelection(payload);
    if (onAddToBundle) onAddToBundle(payload);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        {onBack ? (
          <Button variant="ghost" size="small" onClick={onBack}>
            ← Kembali ke Katalog Vendor
          </Button>
        ) : (
          <a
            href="/marketplace"
            className="text-xs font-semibold text-secondary hover:text-foreground"
          >
            ← Kembali ke Katalog Vendor
          </a>
        )}
        <div className="text-xs text-muted font-mono">Sandbox Preset 3</div>
      </div>

      <div className="p-6 bg-surface rounded-2xl border border-border space-y-4 shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-subtle text-brand-secondary">
              Dokumentasi Foto
            </span>
            <h1 className="text-2xl font-bold text-foreground mt-2">Lensa Teduh Photo</h1>
            <p className="font-serif italic text-secondary text-base mt-1">
              &ldquo;Foto yang tetap terasa seperti kalian.&rdquo;
            </p>
            <div className="text-xs text-secondary mt-2 flex items-center gap-2">
              <span>Bandung · estimasi 6,4 km dari venue</span>
              <span>•</span>
              <span className="text-success font-semibold">14 Feb 2027 Tersedia</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isFavorited ? "primary" : "secondary"}
              size="small"
              onClick={() => setIsFavorited((f) => !f)}
            >
              {isFavorited ? "★ Tersimpan di Favorit" : "☆ Simpan ke Favorit"}
            </Button>
          </div>
        </div>

        {addedNotice && (
          <div className="p-3 bg-success-bg text-success border border-success/30 rounded-control text-xs font-semibold">
            ✓ Layanan Lensa Teduh Photo ditambahkan ke racikan paket Anda!
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-bold text-sm text-foreground">Pilihan Paket Layanan</h3>
          <div className="space-y-2">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg.id)}
                className={`p-3 rounded-xl border flex flex-wrap justify-between items-center gap-2 cursor-pointer transition-all ${
                  selectedPkg === pkg.id
                    ? "border-primary bg-subtle ring-1 ring-primary/30"
                    : "border-border bg-surface hover:bg-subtle/50"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-foreground">{pkg.name}</div>
                  <div className="text-xs text-secondary">{pkg.scope}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-foreground">
                    {formatIdr(pkg.price)}
                  </div>
                  <span className="text-[11px] text-success font-medium">{pkg.availability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-canvas rounded-xl border border-border space-y-2 text-xs">
          <div className="font-bold text-foreground">Harga dan Ketentuan Pembayaran:</div>
          <p className="text-secondary leading-relaxed">
            Skema pembayaran standar: <strong>DP 30%</strong> saat kontrak disetujui,{" "}
            <strong>Termin 40%</strong> H-30 acara, dan <strong>Pelunasan 30%</strong> setelah
            berkas diserahkan. Biaya perjalanan di luar Bandung, revisi album, pembatalan dan hak
            tayang foto disepakati transparan di dalam draf kontrak.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-border">
          <Button variant="primary" onClick={handleAdd}>
            + Tambahkan ke Racik Paket ({formatIdr(activePackage.price)})
          </Button>
        </div>
      </div>
    </div>
  );
}
