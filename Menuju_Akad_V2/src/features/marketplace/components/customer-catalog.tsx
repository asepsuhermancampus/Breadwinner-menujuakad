"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  const router = useRouter(),
    [message, setMessage] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [edit, setEdit] = useState<CatalogVendor | null | undefined>(undefined);
  const selected = new Set((state.data ?? []).map((v) => (v as { id: string }).id)),
    items = vendors.filter((v) => selected.has(v.id));
  return (
    <section className="space-y-5">
      <header className="flex flex-wrap justify-between gap-3">
        <h1 className="text-3xl font-semibold">
          {favorites ? "Vendor pilihan" : "Marketplace vendor"}
        </h1>
        {operator && <Button onClick={() => setEdit(null)}>Tambah vendor</Button>}
      </header>
      <nav className="flex gap-5 text-sm">
        <Link href="/marketplace" className="underline">
          Semua vendor
        </Link>
        <Link href="/marketplace/favorites" className="underline">
          Pilihan kalian
        </Link>
        <Link href="/marketplace/bundles" className="underline">
          Rangkai paket
        </Link>
      </nav>
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
      {vendors.length === 0 ? (
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
      {items.length > 0 && (
        <form
          className="grid gap-3 rounded-card border border-ux-border p-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy || guest) return;
            setBusy(true);
            try {
              const res = await fetch("/api/marketplace/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vendorIds: items.map((i) => i.id), message }),
              });
              const b = await res.json();
              if (!res.ok) throw Error(b.error ?? "Permintaan belum tersimpan.");
              router.push("/orders/" + b.order.id);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Permintaan gagal.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2 className="font-semibold">Rencana paket kalian</h2>
          <p>
            {items.length} vendor / estimasi Rp{" "}
            {items.reduce((n, v) => n + v.price, 0).toLocaleString("id-ID")}
          </p>
          <label className="grid gap-1 text-sm">
            Kebutuhan acara
            <textarea
              maxLength={2000}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-control border border-ux-border bg-canvas p-3"
            />
          </label>
          <p className="text-xs text-secondary">
            Permintaan ini disimpan untuk tindak lanjut pengelola. Harga dan jadwal perlu
            dikonfirmasi sebelum ada pembayaran.
          </p>
          {guest ? (
            <Link href="/login?returnTo=%2Fmarketplace%2Fbundles" className="underline">
              Masuk untuk meminta penawaran
            </Link>
          ) : (
            <Button type="submit" disabled={busy}>
              Kirim permintaan penawaran
            </Button>
          )}
        </form>
      )}
    </section>
  );
}
