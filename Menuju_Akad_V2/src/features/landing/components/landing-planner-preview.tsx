import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, ShieldCheck, FileText, Utensils, QrCode } from "lucide-react";

const quickStats = [
  {
    icon: FileText,
    label: "Berkas KUA",
    value: "8 / 8 Lengkap",
    sub: "Pengantar Desa & Tes Medis Siap",
  },
  {
    icon: Utensils,
    label: "Alokasi Katering",
    value: "Rp 85.000.000",
    sub: "600 Buffet · 1.200 Gubukan",
  },
  {
    icon: QrCode,
    label: "Tamu & Undangan",
    value: "450 Tamu Terdata",
    sub: "Buku Tamu QR Siaga",
  },
];

const recentActivities = [
  {
    user: "Sarah",
    note: "Menandai surat pengantar nikah kelurahan dan hasil tes kesehatan selesai.",
    time: "Baru saja",
  },
  {
    user: "Dimas",
    note: "Mengonfirmasi DP vendor katering dan rasio 300 undangan (600 pax).",
    time: "1 jam lalu",
  },
];

export function LandingPlannerPreview() {
  return (
    <section className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              {/* Kolom Kiri: Narasi Editorial */}
              <div className="space-y-6 lg:col-span-5">
                <div>
                  <span className="font-sans text-xs font-semibold tracking-widest text-secondary uppercase">
                    Studio Perencana Nyata
                  </span>
                  <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
                    Segala detail hari bahagia,{" "}
                    <span className="font-serif font-normal italic text-forest-neutral">
                      terkoordinasi rapi
                    </span>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
                    Tidak perlu berpindah antara spreadsheet rumit dan tumpukan kertas. Dasbor Menuju Akad
                    menyajikan alur berkas Kemenag, pembagian anggaran vendor, dan daftar kehadiran tamu
                    dalam satu tata letak yang menenangkan.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-sm text-secondary">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-700" />
                    <span>
                      <strong className="text-foreground">Satu ruang untuk berdua:</strong> Calon suami
                      dan calon istri memperbarui progres yang sama tanpa miskomunikasi.
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={17} className="mt-0.5 shrink-0 text-emerald-700" />
                    <span>
                      <strong className="text-foreground">Data tersimpan aman & privat:</strong> Bebas
                      iklan komersial yang mengganggu fokus persiapan pernikahan kalian.
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-control bg-brand-secondary px-5 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-secondary/90"
                  >
                    <span>Masuk ke Dasbor Pratinjau</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

                {/* Kolom Kanan: Pratinjau Ruang Dasbor Bersama */}
                <div className="lg:col-span-7">
                  <div className="rounded-3xl border border-ux-border bg-surface p-6 shadow-sm sm:p-8">
                    {/* Header Kartu Dasbor */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ux-border pb-6">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-canvas border border-ux-border text-brand-secondary font-serif text-sm font-semibold">
                          <Heart size={16} className="fill-rose/30 text-rose" />
                        </div>
                        <div>
                          <h3 className="font-sans text-base font-bold text-brand-secondary sm:text-lg">
                            Ruang Sarah & Dimas
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                        <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span>Akun Terhubung</span>
                      </div>
                    </div>

                              {/* 3 Metrik Inti Realistis */ }
                              < div className = "mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3" >
                              {
                                quickStats.map((stat) => {
                                  const Icon = stat.icon;
                                  return (
                                    <div
                                      key={stat.label}
                                      className="rounded-2xl border border-ux-border bg-canvas/60 p-4 text-left"
                                    >
                                      <div className="flex items-center gap-2 text-secondary">
                                        <Icon size={14} />
                                        <span className="text-[11px] font-semibold uppercase tracking-wider">
                                          {stat.label}
                                        </span>
                                      </div>
                                      <div className="mt-2 text-sm font-bold text-brand-secondary">
                                        {stat.value}
                                      </div>
                                      <div className="mt-0.5 text-[11px] text-muted">{stat.sub}</div>
                                    </div>
                  );
                              })}
                      </div>

                        {/* Catatan Kolaborasi Terkini */}
                        <div className="mt-6 border-t border-ux-border pt-5">
                          <div className="flex items-center justify-between mb-3 text-xs">
                            <span className="font-semibold text-secondary uppercase tracking-wider text-[11px]">
                              Riwayat Kolaborasi Terbaru
                            </span>
                            <span className="text-muted text-[11px]">Otomatis tersimpan</span>
                          </div>

              <div className="space-y-2.5">
                {recentActivities.map((act) => (
                  <div
                    key={act.note}
                    className="flex items-start gap-3 rounded-xl border border-ux-border/70 bg-canvas/30 px-3.5 py-2.5 text-xs"
                  >
                    <span className="font-bold text-brand-secondary shrink-0">{act.user}:</span>
                    <span className="text-secondary flex-1 leading-relaxed">{act.note}</span>
                    <span className="text-[10px] text-muted shrink-0">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section >
  );
}
