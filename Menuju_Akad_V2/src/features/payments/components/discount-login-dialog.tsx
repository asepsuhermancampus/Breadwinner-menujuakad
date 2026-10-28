"use client";
import Link from "next/link";
import { Dialog } from "@/components/ui/dialog";
export function DiscountLoginDialog({ open, close }: { open: boolean; close: () => void }) {
  return (
    <Dialog open={open} onClose={close} title="Masuk untuk klaim diskon tambahan">
      <p className="mb-5 text-sm">
        Buat akun atau masuk terlebih dahulu agar diskon tambahan terhubung ke akun kalian.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/login?returnTo=%2Faccount%2Fplans"
          className="rounded-control bg-primary px-4 py-3 text-sm text-on-primary"
        >
          Masuk atau daftar
        </Link>
        <button
          onClick={close}
          className="rounded-control border border-ux-border px-4 py-3 text-sm"
        >
          Batal
        </button>
      </div>
    </Dialog>
  );
}
