"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Heart, QrCode, Sparkles, Users } from "lucide-react";
import { Icon } from "@/components/ui/icon";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-brand-secondary py-20 text-white lg:py-28">
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/auth-editorial.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-20"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, rgba(6, 78, 59, 0.98) 0%, rgba(6, 78, 59, 0.90) 35%, rgba(6, 78, 59, 0.70) 65%, rgba(6, 78, 59, 0.45) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Kolom Kiri: Headline & Value Proposition */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-white/[0.08] px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-200 uppercase backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              Dasbor Pernikahan & Undangan Digital
            </div>

            <h1 className="font-sans text-4xl leading-[1.1] font-semibold tracking-[-1.5px] text-white sm:text-5xl lg:text-6xl">
              Rencana teratur.
              <br />
              Anggaran terukur.
              <br />
              <span className="font-serif italic font-normal text-emerald-200">
                Satu ruang berdua.
              </span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-emerald-100/85 sm:text-lg">
              Kelola persiapan akad dari berkas KUA, pembagian tugas keluarga, simulasi katering,
              hingga buku tamu QR check-in dalam satu dasbor tersinkronisasi.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-control bg-white px-6 py-3.5 text-sm font-semibold text-brand-secondary shadow-lg transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>Buka Dasbor Gratis</span>
                <Icon name="arrow-right" size={16} />
              </Link>

              <a
                href="#cara-kerja"
                className="inline-flex items-center gap-2 rounded-control border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Sparkles size={16} className="text-emerald-300" />
                <span>Lihat Alur Kerja</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-emerald-100/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Mulai tanpa biaya
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Sinkronisasi akun pasangan
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" />
                Tanpa iklan pihak ketiga
              </span>
            </div>
          </div>

          {/* Kolom Kanan: Live Dashboard Feature Showcase dengan Motion Web */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              {/* Main Preview Card: Replika Widget Dashboard Kesiapan */}
              <div className="animate-motion-float rounded-3xl border border-white/15 bg-white/[0.08] p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                      <Users size={16} />
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-white">Sarah & Dimas</h2>
                      <span className="text-[10px] text-emerald-200/80">Paket Lifetime · Akad & Resepsi</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
                    Live Sync
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-left">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <span className="block text-[10px] text-white/60">Berkas KUA</span>
                    <span className="font-mono text-sm font-bold text-white">8/8 Siap</span>
                    <span className="mt-1 block text-[9px] text-emerald-300">N1, N2, N4 Valid</span>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                    <span className="block text-[10px] text-white/60">Tugas Checklist</span>
                    <span className="font-mono text-sm font-bold text-white">18/24 Selesai</span>
                    <span className="mt-1 block text-[9px] text-emerald-300">75% Kesiapan</span>
                  </div>
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">Anggaran Acara</span>
                    <span className="font-mono font-semibold text-emerald-200">Rp 85.000.000</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300" style={{ width: "78%" }} />
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Tamu & QR Check-in */}
              <div className="animate-motion-float-delayed absolute -bottom-5 -left-4 rounded-2xl border border-white/20 bg-emerald-950/90 p-3 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
                    <QrCode size={14} />
                  </div>
                  <div className="text-left text-[11px]">
                    <span className="block font-semibold text-white">Buku Tamu & QR</span>
                    <span className="text-[10px] text-emerald-300">450 Tamu · RSVP 92%</span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Kolaborasi Dua Akun */}
              <div className="animate-motion-float absolute -top-4 -right-4 rounded-2xl border border-white/20 bg-emerald-950/90 px-3.5 py-2 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <Heart size={12} className="fill-amber-300 text-amber-300" />
                  <span className="text-[11px] font-medium text-white">2 Akun Terhubung</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
