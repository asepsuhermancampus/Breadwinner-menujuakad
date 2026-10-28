"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { CatalogVendor } from "../types/customer-catalog";

export function CatalogQuoteRequest({ items, guest }: { items: CatalogVendor[]; guest: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const summary = `${items.length} vendor / estimasi Rp ${items.reduce((total, vendor) => total + vendor.price, 0).toLocaleString("id-ID")}`;
  return (
    <>
      <section className="grid gap-3 rounded-card border border-ux-border p-5">
        <h2 className="font-semibold">Rencana paket kalian</h2>
        <p>{summary}</p>
        {guest ? (
          <Link href="/login?returnTo=%2Fmarketplace%2Fbundles" className="underline">
            Masuk untuk meminta penawaran
          </Link>
        ) : (
          <Button onClick={() => setOpen(true)}>Minta penawaran</Button>
        )}
      </section>
      <Dialog
        open={open}
        title="Minta penawaran vendor"
        onClose={() => {
          if (!busy) setOpen(false);
        }}
      >
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy || guest || !items.length) return;
            setBusy(true);
            setError("");
            try {
              const response = await fetch("/api/marketplace/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vendorIds: items.map((item) => item.id), message }),
              });
              const result = await response.json();
              if (!response.ok) throw Error(result.error ?? "Permintaan belum tersimpan.");
              router.push("/orders/" + result.order.id);
            } catch (cause) {
              setError(cause instanceof Error ? cause.message : "Permintaan gagal.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <fieldset disabled={busy} className="grid min-w-0 gap-3 border-0 p-0">
            <p>{summary}</p>
            <label className="grid gap-1 text-sm">
              Kebutuhan acara
              <textarea
                maxLength={2000}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="rounded-control border border-ux-border bg-canvas p-3"
              />
            </label>
            <p className="text-xs text-secondary">
              Permintaan ini disimpan untuk tindak lanjut pengelola. Harga dan jadwal perlu
              dikonfirmasi sebelum ada pembayaran.
            </p>
            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}
            <Button type="submit">{busy ? "Mengirim..." : "Kirim permintaan penawaran"}</Button>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Batal
            </Button>
          </fieldset>
        </form>
      </Dialog>
    </>
  );
}
