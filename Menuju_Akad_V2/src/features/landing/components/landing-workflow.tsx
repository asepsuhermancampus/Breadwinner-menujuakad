import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
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
    title: "Mulai Berdua",
    desc: "Satukan target akad dalam satu ruang privat tanpa ada kesepakatan atau ide yang tercecer di obrolan chat.",
    chips: ["Tautan Pasangan Instan", "Sinkronisasi Otomatis"],
    visual: <MasterStepOneVisual />,
  },
  {
    num: "02",
    category: "Berkas & Biaya",
    title: "Syarat KUA & Anggaran",
    desc: "Pantau kelengkapan dokumen Kemenag dan hitung porsi katering serta vendor dalam alokasi dana bersama yang transparan.",
    chips: ["Panduan Berkas KUA", "Kalkulator Katering"],
    visual: <MasterStepTwoVisual />,
  },
  {
    num: "03",
    category: "Tamu & Acara",
    title: "Undangan & Meja Resepsi",
    desc: "Sebarkan undangan digital dengan tema pilihan dan sambut kehadiran keluarga lewat pemindaian QR di meja resepsi.",
    chips: ["Undangan Digital", "Buku Tamu QR Resepsi"],
    visual: <MasterStepThreeVisual />,
  },
];

export function LandingWorkflow() {
  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-brand-secondary py-16 text-white lg:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Botanical Flower SVG di Pojok Bawah Kiri (Non-interactive) */}
        <div className="pointer-events-none absolute -bottom-40 -left-6 z-0 origin-bottom-left rotate-12 select-none opacity-20 sm:-bottom-44 sm:-left-8 sm:rotate-15">
          <Image
            src="/assets/landing/vectors-flower-1.svg"
            alt=""
            width={360}
            height={486}
            className="h-auto w-64 select-none sm:w-80 lg:w-96"
            aria-hidden="true"
          />
        </div>

        {/* Header Section */}
        <div className="relative z-10 mx-auto mb-10 max-w-4xl text-center sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            <Sparkles size={12} className="text-emerald-300" />
            <span>Alur Terencana Menuju Akad</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl sm:whitespace-nowrap">
            Tiga babak sederhana,{" "}
            <span className="font-serif font-normal italic text-emerald-200">
              terencana sempurna
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-emerald-100/80 sm:text-sm">
            Dari menyatukan visi berdua, memenuhi syarat legalitas Kemenag dan alokasi vendor,
            hingga menyambut para tamu dengan scan QR di hari pernikahan.
          </p>
        </div>

        {/* 3 Master Cards Berimbang & Padat */}
        <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-7">
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

        {/* Bottom Assurance Strip Kompak */}
        <div className="relative z-10 mt-10 flex flex-col items-center justify-between gap-3.5 rounded-2xl border border-white/15 bg-white/[0.05] p-4.5 backdrop-blur-md sm:flex-row sm:px-6">
          <div className="flex items-center gap-2.5 text-xs text-emerald-100/90">
            <ShieldCheck size={16} className="text-emerald-300 shrink-0" />
            <span>Tersedia di paket Free & Lifetime · 100% bebas iklan pihak ketiga</span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-brand-secondary shadow-md transition hover:bg-neutral-100 hover:shadow-lg"
          >
            <span>Mulai Ruang Bersama Gratis</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
