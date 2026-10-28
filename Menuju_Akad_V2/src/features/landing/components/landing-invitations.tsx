"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const pills = [
  "Musik latar eksklusif",
  "RSVP & batas kuota personal",
  "Peta lokasi & panduan denah",
  "Cerita perjalanan & galeri foto",
  "Bebas iklan pihak ketiga",
];

const cards = [
  {
    title: "Editorial Light",
    tpl: "TPL-01 · LGT",
    badge: "EDITORIAL INTIMATE",
    plan: "Tersedia di Free & Premium",
    couple: "Risa & Andi",
    venue: "Minggu, 14 Februari 2027 · Bumi Samami, Bandung",
    desc: "Hangat, lapang, dan penuh kenangan. Menempatkan foto mempelai sebagai jiwa utama dengan tipografi majalah editorial yang tenang.",
    chips: ["Foto Sampul Penuh", "Kutipan Pembuka", "Amplop Digital"],
    bgClass: "bg-surface",
    imgSrc: "/assets/images/auth-editorial.png",
  },
  {
    title: "Cypress Modern",
    tpl: "TPL-02 · CYP",
    badge: "SIGNATURE EKSKLUSIF",
    plan: "Koleksi Terpopuler",
    couple: "Andi & Risa",
    venue: "14 · 02 · 2027 · Bumi Samami, Bandung",
    desc: "Kemewahan arsitektural bernuansa hutan cypress. Dipadukan aksen champagne halus, QR scan presisi, dan susunan rundown multi-sesi.",
    chips: ["Aksen Champagne", "QR Check-in Tamu", "Multi-Sesi RSVP"],
    bgClass: "bg-[#1e3f32] text-white",
    imgSrc: "/assets/images/editorial-2.png",
  },
  {
    title: "Botanical Taupe",
    tpl: "TPL-03 · BOT",
    badge: "ROMANTIC ORGANIC",
    plan: "Koleksi Eksklusif",
    couple: "Alya & Dimas",
    venue: "Minggu, 21 Juni 2027 · Gedong Putih",
    desc: "Sentuhan alam yang bersahaja dengan ilustrasi floral lembut, palet earthy hangat, dan ruang putih lega yang memberi rasa damai.",
    chips: ["Ilustrasi Floral", "Peta Denah Venue", "Buku Doa Tamu"],
    bgClass: "bg-surface",
    imgSrc: "/assets/images/botanical-preview.jpg",
  },
];

const techs = [
  { title: "Privasi Terjaga", desc: "Tautan personal dan kuota privat tanpa bocor." },
  { title: "Responsif Nyaman", desc: "Tampilan presisi di layar ponsel pintar maupun laptop." },
  { title: "Peta & Waktu Terpadu", desc: "Petunjuk venue dan navigasi peta dalam satu ketukan." },
  { title: "Bebas Watermark & Iklan", desc: "Kemewahan tenang murni milik hari bahagia kalian." },
];

export function LandingInvitations() {
  return (
    <section id="undangan" className="bg-subtle py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 space-y-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-sans text-xs font-semibold tracking-wider text-rose uppercase">
              03 / Dari Kalian, Untuk Mereka
            </span>
            <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.9px] text-brand-secondary sm:text-4xl">
              Satu kabar bahagia.
              <br />
              Beragam cara bercerita.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-secondary">
            Setiap pasangan punya ritme dan selera. Pilih tema yang paling mewakili kalian—dari yang
            hangat dan intim, hingga arsitektural dan bernuansa alam.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {pills.map((pill) => (
            <span
              key={pill}
              className="inline-flex items-center gap-2 rounded-full border border-ux-border bg-surface px-3.5 py-1.5 text-xs font-medium text-brand-secondary shadow-xs"
            >
              <Icon name="check" size={13} className="text-emerald-700" />
              <span>{pill}</span>
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="flex flex-col overflow-hidden rounded-card border border-ux-border bg-surface shadow-xs transition hover:shadow-md"
            >
              <div className="relative h-64 w-full bg-ux-dock overflow-hidden">
                <Image src={c.imgSrc} alt="" fill sizes="33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-between text-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase">
                      {c.badge}
                    </span>
                    <span className="font-mono text-[10px] text-white/80">{c.tpl}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl text-white">{c.couple}</h3>
                    <p className="text-[11px] text-white/80 mt-1">{c.venue}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans text-lg font-semibold text-brand-secondary">
                      {c.title}
                    </h4>
                    <span className="rounded-full bg-ux-dock border border-ux-border px-2.5 py-0.5 text-[10px] font-semibold text-secondary">
                      {c.plan}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-secondary">{c.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {c.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-control bg-ux-dock border border-ux-border px-2 py-0.5 text-[10px] text-secondary"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href="/auth/register"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-control border border-ux-border bg-surface py-2.5 text-xs font-semibold text-brand-secondary transition hover:bg-ux-dock"
                  >
                    <span>Pilih Tema Ini</span>
                    <Icon name="arrow-right" size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-card border border-ux-border bg-surface p-6">
          {techs.map((t) => (
            <div key={t.title} className="space-y-1">
              <h5 className="font-sans text-xs font-semibold text-brand-secondary flex items-center gap-2">
                <span className="text-emerald-700">✓</span> {t.title}
              </h5>
              <p className="text-[11px] leading-relaxed text-secondary">{t.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-secondary">
          Pilihan desain undangan dapat digunakan melalui dashboard. Ketersediaan template mengikuti
          paket Free atau Premium yang aktif.
        </p>
      </div>
    </section>
  );
}
