import { Icon } from "@/components/ui/icon";

const steps = [
  {
    num: "01",
    title: "Buka ruang kalian",
    desc: "Buat akun, isi detail acara, lalu ajak pasangan masuk ke rencana yang sama.",
  },
  {
    num: "02",
    title: "Atur satu per satu",
    desc: "Bagi tugas, catat anggaran, dan rapikan daftar tamu sesuai ritme kalian.",
  },
  {
    num: "03",
    title: "Bagikan kabar bahagia",
    desc: "Pilih tampilan undangan, lengkapi cerita, dan sambut konfirmasi kehadiran.",
  },
];

export function LandingWorkflow() {
  return (
    <section id="cara-kerja" className="bg-primary py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 max-w-2xl">
          <span className="font-sans text-xs font-semibold tracking-wider text-[#D4C6A8] uppercase">
            02 / Satu Langkah, Lalu Berikutnya
          </span>
          <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.9px] text-white sm:text-4xl">
            Satu langkah kecil.
            <br />
            Semakin dekat ke hari bahagia.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#DEE5DE]">
            Buat akun, rapikan rencana, lalu bagikan undangan. Tidak harus selesai sekaligus.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.num}
              className="flex flex-col justify-between rounded-card border border-white/15 bg-white/5 p-8 backdrop-blur-sm transition hover:bg-white/10"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-mono text-2xl font-bold text-[#D4C6A8]">{s.num}</span>
                  <div className="flex size-8 items-center justify-center rounded-full bg-white/10 text-[#D4C6A8]">
                    <Icon name="arrow-right" size={14} />
                  </div>
                </div>
                <h3 className="mt-6 font-sans text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#DEE5DE]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
