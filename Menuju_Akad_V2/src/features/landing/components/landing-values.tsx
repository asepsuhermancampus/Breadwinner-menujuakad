import { CheckSquare, DollarSign, Store, MailCheck } from "lucide-react";

const platformPillars = [
  {
    icon: CheckSquare,
    title: "Perencanaan & Berkas KUA",
    desc: "Checklist tugas pernikahan, syarat berkas nikah KUA lengkap, rundown acara, hingga tas darurat.",
    tag: "Dasbor Siap",
  },
  {
    icon: DollarSign,
    title: "Keuangan & Kalkulator Katering",
    desc: "Buku tabungan bersama, pelacak pos anggaran pengeluaran, dan kalkulator simulasi porsi katering.",
    tag: "Transparan",
  },
  {
    icon: Store,
    title: "Vendor & Rangkai Paket",
    desc: "Katalog vendor terpercaya, daftar vendor tersimpan, dan kemudahan merangkai paket jasa akad.",
    tag: "Terhubung",
  },
  {
    icon: MailCheck,
    title: "Undangan & QR Check-in",
    desc: "Pilihan desain editorial, manajemen kuota RSVP personal, serta scan QR kehadiran tamu di hari H.",
    tag: "Real-time",
  },
];

export function LandingValues() {
  return (
    <section id="tentang" className="border-b border-ux-border bg-surface py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="font-sans text-xs font-semibold tracking-wider text-rose uppercase">
            Fitur Ruang Bersama
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-secondary sm:text-3xl">
            Empat pilar kendali pernikahan dalam satu dasbor
          </h2>
          <p className="mt-2 text-sm text-secondary">
            Semua modul dirancang khusus untuk mempermudah koordinasi berdua dan keluarga besar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {platformPillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-2xl border border-ux-border bg-ux-dock/60 p-5 transition hover:bg-ux-dock"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-brand-secondary">
                      <IconComponent size={20} strokeWidth={2} />
                    </div>
                    <span className="rounded-full bg-surface border border-ux-border px-2 py-0.5 text-[10px] font-semibold text-brand-secondary">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 font-sans text-base font-bold text-brand-secondary">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-secondary">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
