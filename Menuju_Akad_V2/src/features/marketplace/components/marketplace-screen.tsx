"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_CATEGORIES, type MarketplaceVendor } from "../types/marketplace";
import { formatIdr } from "../utils/marketplace-calc";
import { SameDateCheckDialog } from "./same-date-check-dialog";
import { MarketplaceRecoveryView } from "./marketplace-recovery-view";

type Props = {
  initialVendors?: MarketplaceVendor[];
};

export function MarketplaceScreen({ initialVendors = [] }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [sameDateOpen, setSameDateOpen] = useState(false);
  const [showRecoveryInfo, setShowRecoveryInfo] = useState(false);

  const vendors = initialVendors;

  const filtered = vendors.filter((v) => {
    if (selectedCategory === "Semua") return true;
    return v.category === selectedCategory;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted">
            Katalog Marketplace Terkurasi
          </div>
          <h1 className="text-2xl font-bold text-foreground">Temukan Tim untuk Hari Kalian</h1>
          <p className="text-xs text-secondary mt-0.5">
            Sandbox Preset 3 · Acara: <strong>14 Februari 2027</strong> · Venue:{" "}
            <strong>Bumi Samami, Bandung</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="small" onClick={() => setSameDateOpen(true)}>
            📅 Cek Tanggal Serentak
          </Button>
          <a
            href="/marketplace/bundles"
            className="text-xs font-semibold px-3 py-2 bg-primary text-on-primary rounded-control hover:bg-primary-hover"
          >
            Racik Paket (3 Jasa) →
          </a>
        </div>
      </div>

      {/* Category Pills (11 Exact Categories) */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-border scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("Semua")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
            selectedCategory === "Semua"
              ? "bg-primary text-on-primary"
              : "bg-surface border border-border text-secondary hover:bg-subtle"
          }`}
        >
          Semua Kategori
        </button>
        {MARKETPLACE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-on-primary"
                : "bg-surface border border-border text-secondary hover:bg-subtle"
            }`}
          >
            {cat} {cat === "Katering" && "(Coming Soon)"}
          </button>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            className="p-5 bg-surface rounded-2xl border border-border flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-subtle text-brand-secondary">
                  {vendor.category}
                </span>
                {vendor.isComingSoon ? (
                  <span className="text-[11px] font-semibold text-warning bg-warning-bg px-2 py-0.5 rounded">
                    Coming Soon
                  </span>
                ) : vendor.availableOn14Feb ? (
                  <span className="text-[11px] font-semibold text-success bg-success-bg px-2 py-0.5 rounded">
                    ✓ Tersedia 14 Feb
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-danger bg-danger-bg px-2 py-0.5 rounded">
                    Tidak Tersedia
                  </span>
                )}
              </div>

              <h3 className="font-bold text-lg text-foreground mt-1">{vendor.name}</h3>
              <div className="text-xs text-secondary mt-1 flex items-center gap-1.5">
                <span>
                  {vendor.city} · {vendor.distanceKm} km
                </span>
                <span>•</span>
                <span className="font-semibold text-foreground">★ {vendor.rating}</span>
                <span className="text-muted">({vendor.reviewCount})</span>
              </div>

              {vendor.unavailabilityReason && (
                <div className="mt-2 text-xs text-danger bg-danger-bg p-2 rounded border border-danger/30">
                  Alasan: {vendor.unavailabilityReason}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-border flex justify-between items-center">
              <div>
                <div className="text-[10px] text-muted">Mulai dari</div>
                <div className="font-mono font-bold text-sm text-foreground">
                  {formatIdr(vendor.startingPriceIdr)}
                </div>
              </div>
              <a
                href={
                  vendor.slug === "lensa-teduh"
                    ? "/marketplace/vendor/lensa-teduh"
                    : `/marketplace/vendor/${vendor.slug}`
                }
                className="text-xs font-semibold text-brand-secondary hover:underline"
              >
                Lihat Detail →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowRecoveryInfo((s) => !s)}
          className="text-xs text-secondary underline hover:text-foreground"
        >
          {showRecoveryInfo
            ? "Sembunyikan Informasi Rilis #43"
            : "Lihat Informasi Keamanan & Pemulihan Akses Rilis #43"}
        </button>
        {showRecoveryInfo && (
          <div className="mt-3">
            <MarketplaceRecoveryView />
          </div>
        )}
      </div>

      <SameDateCheckDialog open={sameDateOpen} onClose={() => setSameDateOpen(false)} />
    </div>
  );
}
