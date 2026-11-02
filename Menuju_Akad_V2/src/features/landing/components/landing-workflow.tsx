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
    category: "Ruang Bersama",
    title: "Buat Ruang Bersama",
    desc: "Daftar gratis lalu undang pasanganmu. Satukan checklist tugas, kelengkapan berkas KUA, dan persiapan akad dalam satu dasbor yang tersinkronisasi otomatis.",
    chips: ["Sinkronisasi Berdua", "Kesiapan Berkas KUA"],
    visual: <StepOneVisual />,
  },
  {
    num: "02",
    category: "Anggaran & Tugas",
    title: "Kelola Rencana & Biaya",
    desc: "Catat alokasi anggaran pernikahan, simulasi kebutuhan porsi katering, dan bagi tanggung jawab tugas keluarga secara transparan tanpa takut overbudget.",
    chips: ["Pelacak Anggaran", "Kalkulator Katering"],
    visual: <StepTwoVisual />,
  },
  {
    num: "03",
    category: "Tamu & Undangan",
    title: "Bagikan Undangan Digital",
    desc: "Pilih desain undangan eksklusif, lengkapi cerita bahagia kalian, dan pantau tamu yang konfirmasi hadir langsung dari ponsel dengan scan QR check-in.",
    chips: ["Undangan Digital", "Buku Tamu & QR Check-in"],
    visual: <StepThreeVisual />,
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

      {/* Subtle Ambient Depth Lighting */}
      <div
        className="pointer-events-none absolute -left-36 top-1/4 size-96 rounded-full bg-emerald-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-36 bottom-1/4 size-96 rounded-full bg-champagne/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tiga langkah mudah,{" "}
            <span className="font-serif font-normal italic text-emerald-200">
              terencana sempurna.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Dari perencanaan berdua di dasbor hingga menyambut kehadiran para tamu di hari akad nikah.
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
