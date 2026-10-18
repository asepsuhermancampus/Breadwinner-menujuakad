"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const plans = [
  {
    id: "free",
    kicker: "MULAI DARI SINI",
    title: "Free",
    subtitle: "Untuk langkah pertama kalian.",
    price: "Rp 0",
    period: "gratis, tanpa batas waktu",
    features: [
      "Workspace untuk berdua",
      "Checklist & dokumen dasar",
      "Hingga 100 data tamu",
      "1 template undangan dasar",
      "Catatan anggaran sederhana",
    ],
    cta: "Mulai gratis",
    href: "/auth/register",
    featured: false,
  },
  {
    id: "premium",
    kicker: "LEBIH LELUASA",
    title: "Premium",
    subtitle: "Untuk rencana yang lebih lengkap.",
    price: "Rp 149.000",
    period: "per 6 bulan",
    features: [
      "Semua fitur Free",
      "Tamu & tugas tanpa batas",
      "Template undangan premium",
      "Studio visual & moodboard",
      "Ekspor rencana ke PDF",
    ],
    cta: "Lihat Premium",
    href: "/account/plans",
    featured: true,
  },
  {
    id: "lifetime",
    kicker: "AKSES JANGKA PANJANG",
    title: "Lifetime",
    subtitle: "Untuk seluruh perjalanan kalian.",
    price: "Rp 399.000",
    period: "sekali bayar, tanpa kedaluwarsa",
    features: [
      "Semua fitur Premium",
      "Akses tanpa kedaluwarsa",
      "Multi-undangan",
      "Custom domain",
      "Prioritas bantuan pasangan",
    ],
    cta: "Lihat Lifetime",
    href: "/account/plans",
    featured: false,
  },
];

export function LandingPricing() {
  return (
    <section id="paket" className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-14">
        <div className="max-w-2xl">
          <span className="font-sans text-xs font-semibold tracking-wider text-rose uppercase">
            04 / Mulai Dari Yang Kalian Butuhkan
          </span>
          <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.9px] text-primary sm:text-4xl">
            Pilih ruang yang sesuai
            <br />
            dengan rencana kalian.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-secondary">
            Mulai gratis. Pilih dukungan lebih lengkap ketika kalian siap.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col justify-between rounded-card border p-8 shadow-xs transition hover:shadow-md ${
                p.featured
                  ? "border-primary bg-surface ring-2 ring-primary/10"
                  : p.id === "lifetime"
                    ? "border-champagne/40 bg-ux-dock/60"
                    : "border-ux-border bg-surface"
              }`}
            >
              <div className="space-y-6">
                <div>
                  <span
                    className={`font-sans text-xs font-semibold tracking-wider uppercase ${
                      p.featured
                        ? "text-primary"
                        : p.id === "lifetime"
                          ? "text-ux-gold-ink"
                          : "text-secondary"
                    }`}
                  >
                    {p.kicker}
                  </span>
                  <h3 className="mt-1 font-sans text-2xl font-bold text-primary">{p.title}</h3>
                  <p className="mt-1 text-xs text-secondary">{p.subtitle}</p>
                </div>

                <div className="border-y border-ux-border py-4">
                  <span className="font-mono text-3xl font-bold text-primary">{p.price}</span>
                  <span className="block mt-1 font-sans text-xs text-secondary">{p.period}</span>
                </div>

                <ul className="space-y-3 text-xs text-secondary">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <Icon name="check" size={14} className="text-emerald-700 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href={p.href}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-control py-3 text-xs font-semibold transition ${
                    p.featured
                      ? "bg-primary text-white hover:bg-primary-hover shadow-sm"
                      : "border border-ux-border bg-surface text-primary hover:bg-ux-dock"
                  }`}
                >
                  <span>{p.cta}</span>
                  <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-card border border-ux-border bg-ux-dock/60 p-6 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-primary font-medium">
            <Icon name="info" size={16} className="text-primary shrink-0" />
            <span>Sudah Premium? Akses aktif kalian tetap berlaku sesuai paket.</span>
          </div>
          <span className="text-secondary text-[11px]">
            Ketersediaan fitur mengikuti rilis layanan. Upgrade tidak membuka fitur yang belum
            tersedia.
          </span>
        </div>
      </div>
    </section>
  );
}
