import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import {
  MasterStepCard,
  MasterStepOneVisual,
  MasterStepTwoVisual,
  MasterStepThreeVisual,
} from "./landing-workflow-cards";

const masterSteps = [
  {
    num: "01",
    category: "Ruang Bersama",
    title: "Mulai Bersama Pasangan",
    desc: "Daftar gratis lalu undang pasanganmu ke satu dasbor privat. Satukan target tanggal akad tanpa ada catatan tercecer di chat.",
    chips: ["Tautan Pasangan Instan", "Sinkronisasi Otomatis"],
    visual: <MasterStepOneVisual />,
  },
  {
    num: "02",
    category: "Berkas & Biaya",
    title: "Kelola Berkas & Anggaran",
    desc: "Pantau syarat nikah KUA resmi (N1, N2, N4), hitung simulasi porsi katering otomatis, dan catat komitmen tabungan berdua secara transparan.",
    chips: ["Checklist Berkas KUA", "Kalkulator Katering"],
    visual: <MasterStepTwoVisual />,
  },
  {
    num: "03",
    category: "Tamu & Acara",
    title: "Undangan & Meja Resepsi",
    desc: "Pilih desain undangan eksklusif, pantau rekap RSVP tamu secara otomatis, dan kelola kehadiran cepat dengan pemindaian QR di lokasi akad.",
    chips: ["Undangan Digital", "Buku Tamu QR Resepsi"],
    visual: <MasterStepThreeVisual />,
  },
];

export function LandingWorkflow() {
  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-brand-secondary py-20 text-white lg:py-28"
    >
      {/* Botanical Flower SVG di Pojok Bawah Kiri dimiringkan ke kanan */}
      <div className="pointer-events-none absolute -bottom-16 -left-12 z-0 origin-bottom-left rotate-12 select-none opacity-20 sm:-bottom-20 sm:-left-16 sm:rotate-15">
        <Image
          src="/assets/landing/vectors-flower-1.svg"
          alt=""
          width={360}
          height={486}
          className="h-auto w-64 select-none sm:w-80 lg:w-96"
          aria-hidden="true"
        />
      </div>

      {/* Subtle Ambient Lighting Orbs */}
      <div
        className="pointer-events-none absolute -left-36 top-1/4 size-96 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-36 bottom-1/4 size-96 rounded-full bg-champagne/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header Section Master */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-white/[0.08] px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-200 uppercase backdrop-blur-md">
            <Sparkles size={12} className="text-amber-300" />
            <span>Alur Terencana Menuju Akad</span>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Satu ruang berdua,{" "}
            <span className="font-serif font-normal italic text-emerald-200">
              terencana sempurna.
            </span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Dari menyelaraskan visi dan berkas KUA, kalkulasi dana vendor, hingga membagikan
            undangan digital dan menyambut tamu dengan scan QR di hari pernikahan.
          </p>
        </div>

        {/* 3 Master Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {masterSteps.map((step) => (
            <MasterStepCard
              key={step.num}
              num={step.num}
              category={step.category}
              title={step.title}
              desc={step.desc}
              chips={step.chips}
              visual={step.visual}
            />
          ))}
        </div>

        {/* Bottom Action Strip */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5 text-xs text-emerald-100/90">
            <ShieldCheck size={16} className="text-emerald-300" />
            <span>Tersedia di paket Free & Lifetime · 100% bebas iklan pihak ketiga</span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-control bg-white px-5 py-2.5 text-xs font-semibold text-brand-secondary shadow-md transition hover:bg-neutral-100"
          >
            <span>Mulai Ruang Bersama Gratis</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
