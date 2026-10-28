"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import type { CatalogDraft, VendorPackage } from "../types/vendor";
import { VendorPackageDialog } from "./vendor-package-dialog";
import { VendorLocationDialog } from "./vendor-location-dialog";
import { VendorCatalogProfile } from "./vendor-catalog-profile";
import { VendorPortfolio, portfolio } from "./vendor-portfolio";
import { VendorCatalogPackages } from "./vendor-catalog-packages";

type Props = {
  draft: CatalogDraft;
  onChange: (draft: CatalogDraft) => void;
  onSave: () => void;
  onKyb: () => void;
  busy: boolean;
  dirty: boolean;
  canEdit: boolean;
  errors: Record<string, string>;
};
export function VendorCatalog({
  draft,
  onChange,
  onSave,
  onKyb,
  busy,
  dirty,
  canEdit,
  errors,
}: Props) {
  const [tab, setTab] = useState("Paket layanan");
  const [item, setItem] = useState<VendorPackage | null>(null);
  const [location, setLocation] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const profile = draft.profile;
  function profileChange(patch: Partial<CatalogDraft["profile"]>) {
    onChange({ ...draft, profile: { ...profile, ...patch } });
  }
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.8px] sm:text-[32px]">
            Karya yang siap ditemukan.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-secondary">
            Kelola profil, paket, dan portofolio tanpa mengubah pesanan yang sudah disepakati.
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary-hover"
          disabled={busy || !canEdit}
          onClick={onSave}
        >
          {busy ? "Menyimpan…" : "Simpan perubahan"}
        </Button>
      </div>
      <div
        className="flex flex-wrap gap-x-7 gap-y-1 border-b border-ux-border pb-3"
        role="group"
        aria-label="Bagian katalog vendor"
      >
        {["Paket layanan", "Profil usaha", "Portofolio", "Dokumen & KYB"].map((label) => (
          <button
            key={label}
            aria-pressed={label === tab}
            className={`min-h-11 text-sm ${label === tab ? "font-semibold text-brand-secondary" : "text-secondary"}`}
            onClick={() => (label === "Dokumen & KYB" ? onKyb() : setTab(label))}
          >
            {label}
          </button>
        ))}
      </div>
      {!canEdit && (
        <p className="text-sm text-danger">
          Perubahan dibatasi oleh izin atau sesi saat ini. Draf tetap terlihat.
        </p>
      )}
      <div className="grid gap-5 lg:grid-cols-3">
        <Field
          label="Nama usaha"
          value={profile.name}
          error={errors.name ?? errors["profile.name"]}
          disabled={!canEdit || busy}
          maxLength={120}
          onChange={(e) => profileChange({ name: e.target.value })}
        />
        <Field
          label="Kota operasional"
          value={profile.city}
          error={errors.city ?? errors["profile.city"]}
          disabled={!canEdit || busy}
          maxLength={80}
          onChange={(e) => profileChange({ city: e.target.value })}
        />
        <div className="grid content-start gap-2">
          <p className="text-sm font-medium">Titik usaha</p>
          <Button
            variant="secondary"
            className="justify-start text-xs font-normal"
            onClick={() => setLocation(true)}
          >
            {profile.pinSet ? "Pin usaha tersimpan · kelola lokasi" : "Tetapkan titik usaha"}
          </Button>
        </div>
      </div>
      {tab === "Profil usaha" ? (
        <VendorCatalogProfile profile={profile} canEdit={canEdit} profileChange={profileChange} />
      ) : tab === "Portofolio" ? (
        <VendorPortfolio onPhoto={setPhoto} />
      ) : (
        <VendorCatalogPackages
          draft={draft}
          canEdit={canEdit}
          busy={busy}
          setItem={setItem}
          setPhoto={setPhoto}
        />
      )}
      {tab !== "Portofolio" && (
        <div className="grid grid-cols-3 gap-4">
          {portfolio.map((value, index) => (
            <button
              key={value.src}
              className="relative h-24 overflow-hidden rounded-control"
              aria-label={`Lihat portofolio ${index + 1}`}
              onClick={() => setPhoto(index)}
            >
              <Image src={value.src} alt={value.alt} fill sizes="30vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-2 border-t border-ux-border pt-5">
        <p className="text-sm font-semibold">Konten melewati moderasi</p>
        <p className="text-sm leading-relaxed text-secondary">
          Gunakan foto berizin. Kontak yang terdeteksi pada caption ditinjau manusia; hasil scanner
          bukan keputusan otomatis.
        </p>
        <p className="text-xs text-secondary">
          {dirty
            ? "Ada perubahan katalog yang belum disimpan."
            : "Katalog tersimpan. Kontrak pesanan tetap mengikuti versi yang disepakati."}
        </p>
      </div>
      {item && (
        <VendorPackageDialog
          key={item.id}
          item={item}
          onClose={() => setItem(null)}
          onApply={(next) => {
            onChange({
              ...draft,
              packages: draft.packages.some((pkg) => pkg.id === next.id)
                ? draft.packages.map((pkg) => (pkg.id === next.id ? next : pkg))
                : [...draft.packages, next],
            });
            setItem(null);
          }}
        />
      )}
      {location && (
        <VendorLocationDialog
          profile={profile}
          canEdit={canEdit}
          profileChange={profileChange}
          onClose={() => setLocation(false)}
        />
      )}

      <Dialog
        open={photo !== null}
        title={photo === null ? "Portofolio" : portfolio[photo]!.alt}
        onClose={() => setPhoto(null)}
      >
        {photo !== null && (
          <Image
            src={portfolio[photo]!.src}
            alt={portfolio[photo]!.alt}
            width={800}
            height={600}
            className="max-h-[65dvh] w-full rounded-control object-contain"
          />
        )}
      </Dialog>
    </>
  );
}
