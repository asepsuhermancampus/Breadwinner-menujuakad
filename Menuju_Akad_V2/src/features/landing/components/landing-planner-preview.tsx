import Link from "next/link";
import { ArrowRight, CheckCircle2, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { quickStats, recentActivities } from "./landing-planner-preview-data";

export function LandingPlannerPreview() {
  return (
    <section className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Kolom Kiri: Narasi Editorial */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles size={12} className="text-primary" />
                <span>Studio Perencana Nyata</span>
              </div>
              <h2 className="mt-3.5 font-sans text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                Segala detail hari bahagia,{" "}
                <span className="font-serif font-normal italic text-forest-neutral">
                  terkoordinasi rapi
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
                Tidak perlu berpindah antara spreadsheet rumit dan tumpukan kertas. Dasbor Menuju Akad
                menyajikan alur berkas nikah, pembagian anggaran vendor, dan konfirmasi kehadiran tamu
                dalam satu tata letak yang menenangkan.
              </p>
            </div>

            {/* Kartu Fitur Mikro */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-surface/80 p-3.5 shadow-xs transition hover:border-primary/40 hover:bg-surface">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-primary">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-secondary">Satu Ruang untuk Berdua</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-secondary">
                    Calon suami dan calon istri memperbarui progres yang sama secara real-time tanpa miskomunikasi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-border/80 bg-surface/80 p-3.5 shadow-xs transition hover:border-primary/40 hover:bg-surface">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-subtle text-primary">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-brand-secondary">Data Privat & Tanpa Iklan</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-secondary">
                    Rencana pernikahan dan catatan anggaran tersimpan aman, bebas distraksi iklan komersial.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-secondary px-6 py-3.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-secondary/90 hover:shadow-sm"
              >
                <span>Masuk ke Dasbor Pratinjau</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Pratinjau Ruang Dasbor Bersama */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl border border-ux-border bg-surface p-6 shadow-sm sm:p-8">
              {/* Header Kartu Dasbor */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ux-border pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-surface bg-emerald-100 font-serif text-xs font-bold text-emerald-900 shadow-xs">
                      S
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-full border-2 border-surface bg-teal-100 font-serif text-xs font-bold text-teal-900 shadow-xs">
                      D
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-sans text-base font-bold text-brand-secondary sm:text-lg">
                        Ruang Sarah & Dimas
                      </h3>
                      <Heart size={14} className="fill-rose/30 text-rose" />
                    </div>
                    <p className="text-xs text-muted">Akad 24 Desember 2026 · H-48 Menuju Akad</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-3 py-1 text-xs font-medium text-emerald-800">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Akun Terhubung</span>
                </div>
              </div>

              {/* 3 Metrik Inti Realistis */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {quickStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex flex-col justify-between rounded-2xl border border-border/80 bg-canvas/60 p-4 transition hover:bg-canvas"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-secondary">
                            <Icon size={14} className="text-primary" />
                            <span className="text-[11px] font-semibold uppercase tracking-wider">
                              {stat.label}
                            </span>
                          </div>
                          <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${stat.badgeClass}`}>
                            {stat.badge}
                          </span>
                        </div>
                        <div className="mt-3 text-base font-bold text-brand-secondary">
                          {stat.value}
                        </div>
                        <div className="mt-0.5 text-[11px] text-muted">{stat.sub}</div>
                      </div>

                      {/* Micro Progress Bar */}
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface border border-border/40">
                        <div
                          className={`h-full rounded-full ${stat.progressColor}`}
                          style={{ width: `${stat.progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Aktivitas Kolaborasi Terkini */}
              <div className="mt-6 border-t border-ux-border pt-5">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-semibold text-secondary uppercase tracking-wider text-[11px]">
                    Aktivitas Kolaborasi Terkini
                  </span>
                  <span className="text-muted text-[11px]">Otomatis tersimpan</span>
                </div>

                <div className="space-y-2.5">
                  {recentActivities.map((act) => (
                    <div
                      key={act.action}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-canvas/40 px-3.5 py-2.5 transition hover:bg-canvas/70"
                    >
                      <div className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${act.avatarBg}`}>
                        {act.initial}
                      </div>
                      <div className="min-w-0 flex-1 text-xs">
                        <span className="font-bold text-brand-secondary">{act.user}</span>{" "}
                        <span className="text-secondary">{act.action}</span>
                      </div>
                      <span className="shrink-0 text-[10px] text-muted">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
