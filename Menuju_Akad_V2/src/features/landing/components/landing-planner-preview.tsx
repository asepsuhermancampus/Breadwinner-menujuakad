import { CheckCircle2, FileText, Wallet, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const plannerBenefits = [
  {
    num: "01",
    title: "Checklist & Kesiapan KUA Terpadu",
    desc: "Pantau berkas syarat nikah dari N1 hingga rekomendasi nikah tanpa cemas ada dokumen tertinggal.",
  },
  {
    num: "02",
    title: "Transparansi Anggaran Berdua",
    desc: "Simulasi biaya vendor dan porsi katering agar rencana pengeluaran tetap seimbang dan terukur.",
  },
  {
    num: "03",
    title: "Buku Tamu Digital & QR Check-in",
    desc: "Kelola kuota RSVP tamu undangan dan sambut kehadiran mereka di lokasi akad dengan pemindaian QR instan.",
  },
];

export function LandingPlannerPreview() {
  return (
    <section className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 max-w-2xl">
          <span className="font-sans text-xs font-semibold tracking-wider text-rose uppercase">
            01 / Pratinjau Dasbor
          </span>
          <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.9px] text-brand-secondary sm:text-4xl">
            Semua persiapan akad,
            <br />
            tertata rapi di satu tempat.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-secondary">
            Replika nyata dasbor yang akan kalian gunakan berdua: dari kelengkapan berkas KUA,
            alokasi dana vendor, hingga konfirmasi kehadiran tamu.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Kolom Kiri: Poin Manfaat */}
          <div className="space-y-8 lg:col-span-5">
            {plannerBenefits.map((b) => (
              <div key={b.num} className="border-l-2 border-ux-border pl-5">
                <span className="font-mono text-xs font-semibold text-rose">{b.num}</span>
                <h3 className="mt-1 font-sans text-lg font-semibold text-brand-secondary">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{b.desc}</p>
              </div>
            ))}

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-secondary hover:text-primary transition"
              >
                <span>Coba langsung dasbor interaktif</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Replika Dasbor Nyata Customer */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-card border border-ux-border bg-surface shadow-md">
              {/* Header Bar Ruang Bersama */}
              <div className="flex items-center justify-between border-b border-ux-border bg-ux-dock px-5 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-secondary">menuju akad</span>
                  <span className="text-secondary">·</span>
                  <span className="text-secondary">Ruang Sarah & Dimas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-emerald-800">Paket Lifetime</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Greeting & Tanggal Akad */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ux-border pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-secondary">
                      MINGGU, 14 FEBRUARI 2027
                    </span>
                    <h3 className="font-sans text-xl font-semibold text-brand-secondary">
                      Selamat datang, Sarah & Dimas.
                    </h3>
                  </div>
                  <span className="rounded-full bg-ux-dock border border-ux-border px-3 py-1 font-mono text-xs font-semibold text-brand-secondary">
                    Akad & Resepsi
                  </span>
                </div>

                {/* 4 Metrik Riil Dashboard */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-control bg-ux-dock/60 border border-ux-border p-3">
                    <span className="flex items-center gap-1 text-[11px] text-secondary">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      Checklist
                    </span>
                    <span className="font-mono text-sm font-bold text-brand-secondary block mt-1">
                      18/24
                    </span>
                    <span className="text-[10px] text-muted">6 tugas tersisa</span>
                  </div>
                  <div className="rounded-control bg-ux-dock/60 border border-ux-border p-3">
                    <span className="flex items-center gap-1 text-[11px] text-secondary">
                      <FileText size={12} className="text-emerald-600" />
                      Berkas KUA
                    </span>
                    <span className="font-mono text-sm font-bold text-brand-secondary block mt-1">
                      8/8
                    </span>
                    <span className="text-[10px] text-emerald-700">Lengkap</span>
                  </div>
                  <div className="rounded-control bg-ux-dock/60 border border-ux-border p-3">
                    <span className="flex items-center gap-1 text-[11px] text-secondary">
                      <Wallet size={12} className="text-emerald-600" />
                      Anggaran
                    </span>
                    <span className="font-mono text-sm font-bold text-brand-secondary block mt-1">
                      85 Jt
                    </span>
                    <span className="text-[10px] text-muted">Terkendali</span>
                  </div>
                  <div className="rounded-control bg-ux-dock/60 border border-ux-border p-3">
                    <span className="flex items-center gap-1 text-[11px] text-secondary">
                      <Users size={12} className="text-emerald-600" />
                      Tamu RSVP
                    </span>
                    <span className="font-mono text-sm font-bold text-brand-secondary block mt-1">
                      450
                    </span>
                    <span className="text-[10px] text-emerald-700">92% Hadir</span>
                  </div>
                </div>

                {/* Prioritas Langkah Minggu Ini */}
                <div className="rounded-control bg-ux-dock/50 border border-ux-border p-4 space-y-2.5">
                  <span className="font-sans text-xs font-semibold text-brand-secondary block">
                    Prioritas langkah berikutnya
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-md bg-surface p-2.5 border border-ux-border">
                      <span className="text-foreground">Verifikasi berkas N1 & N4 di kelurahan</span>
                      <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-semibold">
                        KUA Siap
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md bg-surface p-2.5 border border-ux-border">
                      <span className="text-foreground">Konfirmasi rundown dengan vendor dokumentasi</span>
                      <span className="rounded bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-semibold">
                        Jadwal
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
