"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CatalogQuoteRequest } from "./catalog-quote-request";
import { PageHeading } from "@/components/ui/page-heading";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import type { CatalogVendor } from "../types/customer-catalog";
import { CatalogVendorForm } from "./catalog-vendor-form";
type State = { data: unknown[] | null; error: string; save: (data: unknown[]) => Promise<boolean> };
export function Catalog({
  vendors,
  state,
  guest,
  operator,
  favorites,
}: {
  vendors: CatalogVendor[];
  state: State;
  guest: boolean;
  operator: boolean;
  favorites: boolean;
}) {
  const pathname = usePathname();
  const orderPage = pathname === "/marketplace/bundles" || pathname === "/checkout/services";
  const router = useRouter(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [edit, setEdit] = useState<CatalogVendor | null | undefined>(undefined);
  const selected = new Set((state.data ?? []).map((v) => (v as { id: string }).id)),
    items = vendors.filter((v) => selected.has(v.id));
  return (
    <section className="space-y-5">
      <header className="flex flex-wrap justify-between gap-3">
        <PageHeading
          key={pathname}
          title={
            orderPage
              ? pathname === "/checkout/services"
                ? "Checkout jasa"
                : "Rangkai paket"
              : favorites
                ? "Vendor pilihan"
                : "Marketplace vendor"
          }
          description={
            orderPage
              ? "Susun vendor pilihan dan kirim kebutuhan acara untuk mendapatkan penawaran."
              : favorites
                ? "Kelola vendor pilihan kalian dan rangkai kebutuhan acara."
                : "Temukan vendor untuk kebutuhan acara dan simpan pilihan kalian."
          }
        />
        {operator && <Button onClick={() => setEdit(null)}>Tambah vendor</Button>}
      </header>
      {edit !== undefined && (
        <CatalogVendorForm
          key={edit?.id ?? "new"}
          vendor={edit ?? undefined}
          close={() => setEdit(undefined)}
        />
      )}
      {(error || state.error) && (
        <p role="alert" className="text-danger">
          {error || state.error}
        </p>
      )}
      {state.data === null ? (
        !(error || state.error) && <PageSkeleton variant="cards" label="Memuat vendor pilihan" />
      ) : vendors.length === 0 ? (
        <p className="rounded-card border border-ux-border bg-surface p-6">
          Belum ada vendor terdaftar. Katalog menampilkan vendor yang ditambahkan pengelola.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vendors
            .filter((v) => !favorites || selected.has(v.id))
            .map((v) => (
              <article
                key={v.id}
                className="space-y-3 rounded-card border border-ux-border bg-surface p-5"
              >
                <p className="text-xs text-secondary">{v.category}</p>
                <Link href={"/marketplace/vendor/" + v.id}>
                  <h2 className="text-xl font-semibold">{v.name}</h2>
                </Link>
                <p className="whitespace-pre-wrap text-sm">{v.description}</p>
                <p>Rp {v.price.toLocaleString("id-ID")}</p>
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    disabled={!state.data || busy}
                    checked={selected.has(v.id)}
                    onChange={() =>
                      void state.save(
                        selected.has(v.id)
                          ? (state.data ?? []).filter((i) => (i as { id: string }).id !== v.id)
                          : [...(state.data ?? []), { id: v.id }],
                      )
                    }
                  />
                  Pilih {v.name}
                </label>
                {operator && (
                  <div className="flex gap-3">
                    <Button size="small" variant="secondary" onClick={() => setEdit(v)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="ghost"
                      disabled={busy}
                      onClick={async () => {
                        setBusy(true);
                        try {
                          const res = await fetch("/api/marketplace/vendors", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: v.id }),
                          });
                          if (!res.ok) throw Error("Vendor belum dapat dihapus.");
                          router.refresh();
                        } catch (e) {
                          setError(e instanceof Error ? e.message : "Gagal menghapus.");
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                )}
              </article>
            ))}
        </div>
      )}
      {items.length > 0 && <CatalogQuoteRequest items={items} guest={guest} />}
    </section>
  );
}
