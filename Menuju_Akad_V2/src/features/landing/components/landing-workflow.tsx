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
    category: "Babak Pertama",
    title: "Mulai Bersama Pasangan",
    desc: "Buat ruang privat berdua dan sepakati tanggal target akad. Selaraskan seluruh rencana awal dalam satu genggaman.",
    chips: ["Tautan Pasangan Instan", "Target Tanggal Akad"],
    visual: <StepOneVisual />,
  },
  {
    num: "02",
    category: "Babak Kedua",
    title: "Eksekusi Berkas & Vendor",
    desc: "Penuhi syarat nikah KUA tanpa cemas, bagi tanggung jawab keluarga, dan kunci kesepakatan vendor acara secara transparan.",
    chips: ["Verifikasi KUA", "Simulasi Katering & Biaya"],
    visual: <StepTwoVisual />,
  },
  {
    num: "03",
    category: "Babak Ketiga",
    title: "Sambut Hari Pernikahan",
    desc: "Sebarkan undangan digital personal, rekap konfirmasi kehadiran tamu secara otomatis, dan kelola check-in cepat di meja resepsi.",
    chips: ["Undangan Digital", "Buku Tamu QR Meja Resepsi"],
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
            Tiga babak perjalanan,{" "}
            <span className="font-serif font-normal italic text-emerald-200">
              menuju hari bahagia.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Alur praktis yang membimbing kalian berdua dari hari pertama perencanaan hingga menyambut tamu di hari akad nikah.
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
