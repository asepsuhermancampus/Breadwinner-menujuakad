import Image from "next/image";
import {
  StepCard,
  StepOneVisual,
  StepTwoVisual,
  StepThreeVisual,
} from "./landing-workflow-cards";

const workflowSteps = [
  {
    num: "01",
    category: "Kolaborasi",
    title: "Buat Ruang Bersama",
    desc: "Mulai gratis dan undang pasangan untuk menyatukan visi, anggaran, dan daftar checklist dalam satu ruang privat.",
    chips: ["Sinkronisasi Berdua", "Checklist Kesiapan"],
    visual: <StepOneVisual />,
  },
  {
    num: "02",
    category: "Perencanaan",
    title: "Kelola Rencana & Biaya",
    desc: "Bagi tugas keluarga, atur rincian vendor, dan hitung estimasi pengeluaran secara terukur tanpa kejutan biaya.",
    chips: ["Pelacak Anggaran", "Manajemen Tamu"],
    visual: <StepTwoVisual />,
  },
  {
    num: "03",
    category: "Publikasi",
    title: "Bagikan Undangan Digital",
    desc: "Pilih desain editorial eksklusif, cantumkan cerita bahagia, dan pantau kehadiran tamu via konfirmasi RSVP.",
    chips: ["QR Check-in Akad", "Konfirmasi RSVP"],
    visual: <StepThreeVisual />,
  },
];

export function LandingWorkflow() {
  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-brand-secondary py-20 text-white lg:py-28"
    >
      {/* Background Floral Ornaments */}
      <Image
        src="/assets/finance/ornaments/flower-1.svg"
        alt=""
        width={260}
        height={260}
        className="pointer-events-none absolute -left-10 -top-10 size-56 opacity-[0.14] invert brightness-150 select-none md:size-72"
        aria-hidden="true"
      />
      <Image
        src="/assets/finance/ornaments/flower-2.svg"
        alt=""
        width={260}
        height={260}
        className="pointer-events-none absolute -right-10 -top-10 size-56 opacity-[0.14] invert brightness-150 select-none md:size-72"
        aria-hidden="true"
      />
      <Image
        src="/assets/finance/ornaments/flower-3.svg"
        alt=""
        width={220}
        height={220}
        className="pointer-events-none absolute -bottom-10 -left-10 size-48 opacity-[0.12] invert brightness-150 select-none md:size-64"
        aria-hidden="true"
      />
      <Image
        src="/assets/finance/ornaments/flower-4.svg"
        alt=""
        width={220}
        height={220}
        className="pointer-events-none absolute -bottom-10 -right-10 size-48 opacity-[0.12] invert brightness-150 select-none md:size-64"
        aria-hidden="true"
      />

      {/* Ambient Lighting Orbs */}
      <div
        className="pointer-events-none absolute -left-36 top-1/4 size-96 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-36 bottom-1/4 size-96 rounded-full bg-champagne/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tiga langkah mudah,{" "}
            <span className="font-serif font-normal italic text-emerald-200">
              terencana sempurna.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100/75 sm:text-base">
            Dari perencanaan berdua hingga menyambut kehadiran para tamu di hari pernikahan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {workflowSteps.map((step) => (
            <StepCard
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
      </div>
    </section>
  );
}
