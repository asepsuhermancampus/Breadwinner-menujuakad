import Image from "next/image";
import { Button } from "@/components/ui/button";
import type { CatalogDraft, VendorPackage } from "../types/vendor";
import { OperationalBadge } from "./operational-feedback";
import { portfolio } from "./vendor-portfolio";
const money = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export function VendorCatalogPackages({
  draft,
  canEdit,
  busy,
  setItem,
  setPhoto,
}: {
  draft: CatalogDraft;
  canEdit: boolean;
  busy: boolean;
  setItem: (item: VendorPackage) => void;
  setPhoto: (index: number) => void;
}) {
  const profile = draft.profile;
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(220px,340px)_minmax(0,1fr)]">
      <button
        className="relative min-h-80 overflow-hidden rounded-control lg:min-h-[436px]"
        onClick={() => setPhoto(0)}
        aria-label="Lihat foto utama portofolio"
      >
        <Image
          src={profile.cover}
          alt={portfolio[0]!.alt}
          fill
          sizes="(max-width:1024px) 85vw, 340px"
          className="object-cover"
          priority
        />
      </button>
      <section className="grid min-w-0 content-start gap-5" aria-label="Paket dan harga">
        <h2 className="text-[22px] font-semibold tracking-tight">Paket & harga</h2>
        <p className="text-sm leading-relaxed text-secondary">
          {draft.packages.filter((pkg) => pkg.active).length} paket aktif · harga berikut untuk
          pemesanan baru. Pesanan lama mengikuti snapshot kontraknya.
        </p>
        <div className="overflow-x-auto rounded-card border border-ux-border">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">Paket layanan vendor</caption>
            <thead className="bg-ux-dock text-secondary">
              <tr>
                <th className="p-4 font-medium">Paket</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-3">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {draft.packages.map((pkg) => (
                <tr key={pkg.id} className="border-t border-ux-border">
                  <td className="p-4">{pkg.name}</td>
                  <td className="whitespace-nowrap p-4 font-mono">{money(pkg.priceIdr)}</td>
                  <td className="p-4">
                    <OperationalBadge
                      status={pkg.active ? "eligible" : "draft"}
                      label={pkg.active ? "Aktif" : "Draf"}
                    />
                  </td>
                  <td className="p-2">
                    <Button
                      variant="ghost"
                      size="small"
                      aria-label={`Edit paket ${pkg.name}`}
                      disabled={!canEdit || busy}
                      onClick={() => setItem(structuredClone(pkg))}
                    >
                      Edit →
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button
          variant="secondary"
          className="w-fit"
          disabled={!canEdit || busy}
          onClick={() =>
            setItem({
              id: `package-${crypto.randomUUID()}`,
              name: "",
              priceIdr: 0,
              active: true,
              duration: "",
              description: "",
              deliverables: [],
              image: portfolio[0]!.src,
            })
          }
        >
          Tambah paket
        </Button>
      </section>
    </div>
  );
}
