"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";

export function GoogleSessionPanel({
  user,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    try {
      setPending(true);
      setError(null);
      await signOut({ callbackUrl: "/login", redirectTo: "/login" });
    } catch {
      setError("Gagal keluar dari sesi Google. Silakan coba kembali.");
      setPending(false);
    }
  }

  return (
    <div
      role="region"
      aria-label="Sesi Google Terverifikasi"
      className="mb-6 rounded-control border border-border bg-surface p-4 shadow-sm"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-success" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground">Sesi Google Terautentikasi</h2>
          </div>
          <p className="text-xs text-secondary">
            {user.email ? `Terhubung sebagai ${user.email}` : "Akun Google terhubung"}
            {user.name ? ` (${user.name})` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/checkout/qris"
            className="inline-flex min-h-9 items-center justify-center rounded-control border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-subtle"
          >
            Uji pembayaran QRIS
          </Link>
          <Button
            type="button"
            variant="secondary"
            size="small"
            disabled={pending}
            onClick={() => void handleSignOut()}
          >
            {pending ? "Keluar…" : "Keluar dari Google"}
          </Button>
        </div>
      </div>
      {error && (
        <div className="mt-3">
          <Status tone="danger">{error}</Status>
        </div>
      )}
      <div className="mt-3">
        <Status tone="info">
          Panel ini menampilkan identitas OAuth Google nyata. Data profil dan rencana pernikahan di
          bawah merupakan data pratinjau lokal mandiri yang tidak tercampur dengan akun Google Anda.
        </Status>
      </div>
    </div>
  );
}
