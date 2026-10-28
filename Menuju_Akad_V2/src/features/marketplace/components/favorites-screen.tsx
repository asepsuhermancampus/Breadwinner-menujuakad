"use client";

import { useState } from "react";
import { formatIdr } from "../utils/marketplace-calc";

export function FavoritesScreen() {
  const [favorites, setFavorites] = useState([
    {
      id: "fav-1",
      name: "Aru MUA",
      category: "MUA",
      service: "Paket Akad",
      price: 8000000,
    },
    {
      id: "fav-2",
      name: "Lensa Teduh Photo",
      category: "Dokumentasi",
      service: "Sehari Penuh",
      price: 15000000,
    },
    {
      id: "fav-3",
      name: "Luma Dekor",
      category: "Dekorasi / Florist",
      service: "Cypress",
      price: 12000000,
    },
  ]);

  function handleRemove(id: string) {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Favorit & Draf Paket</h1>
          <p className="text-xs text-secondary mt-1">
            Sandbox Preset 3 · Menyimpan vendor atau draf paket tidak memesan atau mengunci tanggal
            secara sepihak.
          </p>
        </div>
        <a
          href="/marketplace/bundles"
          className="text-xs font-semibold px-3 py-2 bg-primary text-on-primary rounded-control hover:bg-primary-hover"
        >
          Lihat Racik Paket (PKT-SIM-204) →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-surface border border-border rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-foreground">
              Vendor Tersimpan ({favorites.length})
            </h3>
            <span className="text-xs text-secondary">Owner-scoped</span>
          </div>

          <div className="space-y-3">
            {favorites.length === 0 ? (
              <p className="text-xs text-secondary py-4 text-center">Belum ada vendor favorit.</p>
            ) : (
              favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3 bg-canvas border border-border rounded-xl flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-sm text-foreground">{fav.name}</div>
                    <div className="text-xs text-secondary">
                      {fav.category} · {fav.service}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-sm text-foreground">
                      {formatIdr(fav.price)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(fav.id)}
                      className="text-[11px] text-danger hover:underline mt-0.5"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 bg-surface border border-border rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-foreground">Draf Paket Utama</h3>
              <span className="font-mono text-xs font-bold text-brand-secondary bg-subtle px-2 py-0.5 rounded">
                PKT-SIM-204
              </span>
            </div>

            <div className="p-4 bg-canvas rounded-xl border border-border space-y-2">
              <div className="text-xs text-secondary">3 Jasa Terangkum · Acara 14 Feb 2027</div>
              <div className="text-2xl font-bold font-mono text-foreground">Rp 35.000.000</div>
              <div className="text-[11px] text-muted">
                Terakhir disimpan: 10.42 WIB · Harga snapshot draf bukan quote terjamin.
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
              <strong>Ketahanan Draf:</strong> Saat vendor mengubah status ketersediaan atau layanan
              dihapus, draf tetap dipertahankan dan sistem memberikan alternatif pengganti tanpa
              menghapus pesanan historis atau mengubah harga diam-diam.
            </p>
          </div>

          <a
            href="/marketplace/bundles"
            className="block text-center w-full py-2.5 text-xs font-semibold rounded-control bg-primary text-on-primary hover:bg-primary-hover"
          >
            Buka Editor Racik Paket
          </a>
        </div>
      </div>
    </div>
  );
}
