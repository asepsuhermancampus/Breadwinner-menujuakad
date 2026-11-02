"use client";

import Link from "next/link";
import { ShieldAlert, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewAuthGate({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-5 py-2">
      <div className="flex flex-col items-center text-center">
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          <ShieldAlert size={32} strokeWidth={1.5} />
        </span>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
          Wajib Akun Terdaftar · Minimal Paket Free
        </div>
        <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          Masuk untuk Membagikan Pengalaman
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-secondary sm:text-sm">
          Untuk menjaga keaslian cerita pengantin serta mengantisipasi ulasan tidak valid atau
          kompetitor, penulisan ulasan hanya terbuka bagi pengguna yang telah memiliki akun
          Menuju Akad.
        </p>
      </div>

      <div className="rounded-xl border border-ux-border/60 bg-subtle/40 p-4 text-xs text-secondary space-y-2">
        <div className="flex items-start gap-2.5">
          <span className="font-bold text-foreground">1.</span>
          <p>
            <strong className="text-foreground">Akun Free:</strong> Cukup mendaftar gratis tanpa
            kartu kredit untuk menulis ulasan.
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="font-bold text-foreground">2.</span>
          <p>
            <strong className="text-foreground">Moderasi Superadmin:</strong> Semua ulasan akan
            dipantau terlebih dahulu di panel Superadmin sebelum tampil di beranda.
          </p>
        </div>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        <Link
          href="/login?callbackUrl=/#ulasan"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-control bg-primary px-4 text-xs font-semibold text-on-primary shadow-xs hover:opacity-95"
          onClick={onClose}
        >
          <LogIn size={15} aria-hidden="true" /> Masuk ke Akun
        </Link>
        <Link
          href="/register"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-control border border-ux-border bg-surface px-4 text-xs font-semibold text-foreground shadow-xs hover:bg-subtle"
          onClick={onClose}
        >
          <UserPlus size={15} aria-hidden="true" /> Daftar Akun Gratis
        </Link>
      </div>

      <div className="text-center pt-1">
        <Button variant="ghost" size="small" onClick={onClose} className="text-xs text-muted">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}

