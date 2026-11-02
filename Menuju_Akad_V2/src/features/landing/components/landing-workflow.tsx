import { Users, SlidersHorizontal, Sparkles, Check } from "lucide-react";

const steps = [
  {
    num: "01",
    tag: "LANGKAH 01",
    title: "Buat Ruang Bersama",
    desc: "Mulai gratis dan undang pasangan untuk menyusun seluruh persiapan di satu dasbor terpadu.",
    icon: Users,
    chips: ["Sinkronisasi Berdua", "Checklist Kesiapan"],
  },
  {
    num: "02",
    tag: "LANGKAH 02",
    title: "Kelola Rencana & Biaya",
    desc: "Bagi tugas, hitung simulasi anggaran pernikahan, dan kelola daftar tamu secara presisi.",
    icon: SlidersHorizontal,
    chips: ["Pelacak Anggaran", "Manajemen Tamu"],
  },
  {
    num: "03",
    tag: "LANGKAH 03",
    title: "Bagikan Undangan Digital",
    desc: "Pilih desain editorial eksklusif, lengkapi cerita bahagia, dan pantau konfirmasi kehadiran.",
    icon: Sparkles,
    chips: ["QR Check-in", "Konfirmasi RSVP"],
  },
];

export function LandingWorkflow() {
  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-brand-secondary py-20 text-white lg:py-28"
    >
      <div
        className="pointer-events-none absolute -left-40 top-0 size-96 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 size-96 rounded-full bg-champagne/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-white/[0.06] px-3.5 py-1 text-xs font-semibold tracking-wider text-emerald-200 uppercase backdrop-blur-xs">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Alur Praktis Menuju Akad
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tiga langkah mudah,{" "}
            <span className="font-serif font-normal italic text-emerald-200">
              terencana sempurna.
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Dari perencanaan berdua hingga menyambut kehadiran tamu di hari pernikahan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.num}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[0.07] hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <span className="font-serif text-3xl font-medium tracking-tight text-emerald-300/90">
                      {step.num}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-200 transition-colors group-hover:bg-emerald-400/20 group-hover:text-emerald-100">
                      <IconComponent size={19} strokeWidth={1.75} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-5">
                    <span className="text-[11px] font-bold tracking-wider text-emerald-300 uppercase">
                      {step.tag}
                    </span>
                    <h3 className="mt-1 text-lg font-bold text-white tracking-tight sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-white/75 sm:text-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                  {step.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-emerald-100/90"
                    >
                      <Check size={11} className="text-emerald-300" aria-hidden="true" />
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-8 text-xs text-white/70 sm:gap-10">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Mulai Tanpa Biaya
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Data Tersinkronisasi Otomatis
          </span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-300" />
            Akses Fleksibel Kapan Saja
          </span>
        </div>
      </div>
    </section>
  );
}
