"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { CatalogOrder } from "../types/customer-catalog";
export function CatalogRequests({ orders }: { orders: CatalogOrder[] }) {
  const router = useRouter(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <section className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold">Permintaan penawaran pelanggan</h2>
      {error && <p role="alert">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-sm text-secondary">Belum ada permintaan masuk.</p>
      ) : (
        orders.map((o) => (
          <article
            key={o.id}
            className="space-y-3 rounded-card border border-ux-border bg-surface p-5"
          >
            <h3 className="font-semibold">{o.id}</h3>
            <p className="text-sm">
              {o.contactEmail || "Kontak belum dicantumkan"} /{" "}
              {o.status === "contacted"
                ? "Sedang ditindaklanjuti"
                : o.status === "cancelled"
                  ? "Dibatalkan"
                  : "Menunggu tindak lanjut"}
            </p>
            <p>{o.items.map((i) => i.name).join(", ")}</p>
            <p>Estimasi Rp {o.total.toLocaleString("id-ID")}</p>
            <p className="whitespace-pre-wrap text-sm">{o.message}</p>
            <div className="flex flex-wrap gap-3">
              {(["contacted", "cancelled"] as const).map((status) => (
                <Button
                  key={status}
                  size="small"
                  variant="secondary"
                  disabled={busy || o.status === status}
                  onClick={async () => {
                    if (busy) return;
                    setBusy(true);
                    try {
                      const res = await fetch("/api/marketplace/requests", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: o.id, status }),
                      });
                      const b = await res.json();
                      if (!res.ok) throw Error(b.error ?? "Status belum tersimpan.");
                      router.refresh();
                    } catch (e) {
                      setError(e instanceof Error ? e.message : "Gagal menyimpan.");
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  {status === "contacted" ? "Tandai ditindaklanjuti" : "Batalkan permintaan"}
                </Button>
              ))}
            </div>
          </article>
        ))
      )}
    </section>
  );
}
