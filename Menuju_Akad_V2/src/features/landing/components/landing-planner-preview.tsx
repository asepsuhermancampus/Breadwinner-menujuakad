import { CheckCircle2, Clock, ShieldCheck, Heart, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const activityLogs = [
  {
    author: "Sarah",
    role: "Mempelai Wanita",
    avatarBg: "bg-emerald-100 text-emerald-800",
    action: "Menandai 4 berkas KUA (N1, N2, N4) selesai diverifikasi kelurahan",
    time: "Baru saja",
  },
  {
    author: "Dimas",
    role: "Mempelai Pria",
    avatarBg: "bg-amber-100 text-amber-800",
    action: "Mencatat konfirmasi DP vendor katering dan alokasi 450 porsi",
    time: "2 jam lalu",
  },
  {
    author: "Sarah & Dimas",
    role: "Ruang Bersama",
    avatarBg: "bg-rose-100 text-rose-800",
    action: "Memilih tema undangan digital Editorial Light untuk disebarkan",
    time: "Kemarin",
  },
];

export function LandingPlannerPreview() {
  return (
    <section className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Sisi Kiri: Narasi Solusi Berdua */}
          <div className="space-y-6 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-ux-border bg-surface px-3 py-1 text-xs font-semibold text-brand-secondary">
              <Sparkles size={13} className="text-rose" />
              <span>Pusat Kendali Kolaborasi</span>
            </div>

            <h2 className="font-sans text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl">
              Tidak ada lagi catatan terpencar di chat WhatsApp
            </h2>

            <p className="text-base leading-relaxed text-secondary">
              Setiap keputusan, pembayaran vendor, dan perkembangan berkas tercatat rapi secara
              real-time. Kalian berdua selalu berada di halaman yang sama tanpa saling menduga.
            </p>

            <div className="space-y-3 pt-2 text-sm text-secondary">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong className="text-foreground">Satu akun untuk berdua</strong> — undang
                  pasangan dengan satu tautan undangan instan.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong className="text-foreground">Riwayat aktivitas transparan</strong> — pantau
                  tugas yang baru saja diselesaikan pasangan.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="shrink-0 text-emerald-600 mt-0.5" />
                <span>
                  <strong className="text-foreground">Privasi penuh terjamin</strong> — data rencana
                  hanya dapat diakses oleh kalian berdua.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-control bg-primary px-5 py-3 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover"
              >
                <span>Eksplorasi Dasbor Kalian</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Sisi Kanan: Realistic Window App Workspace */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-ux-border bg-surface shadow-xl">
              {/* Browser Window Title Bar */}
              <div className="flex items-center justify-between border-b border-ux-border bg-ux-dock px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-red-400/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="rounded-md bg-surface border border-ux-border px-4 py-0.5 font-mono text-[11px] text-muted">
                  menujuakad.com/dashboard/sarah-dimas
                </span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Tersinkronisasi</span>
                </div>
              </div>

              {/* Workspace Body */}
              <div className="p-6 space-y-5">
                {/* Workspace Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ux-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200">
                      <Heart size={18} className="fill-emerald-600 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-sans text-lg font-bold text-brand-secondary">
                        Ruang Sarah & Dimas
                      </h3>
                      <span className="text-xs text-secondary">
                        Hari H: 14 Februari 2027 · Akad & Resepsi
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800">
                    Kesiapan 75%
                  </span>
                </div>

                {/* Collaborative Activity Stream */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                      Aktivitas Terbaru Pasangan
                    </span>
                    <span className="text-[11px] text-muted">Diperbarui otomatis</span>
                  </div>

                  <div className="space-y-2.5">
                    {activityLogs.map((log) => (
                      <div
                        key={log.action}
                        className="flex items-start gap-3 rounded-xl border border-ux-border bg-ux-dock/40 p-3 text-xs"
                      >
                        <div
                          className={`flex size-7 shrink-0 items-center justify-center rounded-full font-bold text-[11px] ${log.avatarBg}`}
                        >
                          {log.author[0]}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground">{log.author}</span>
                            <span className="text-[10px] text-muted">{log.time}</span>
                          </div>
                          <p className="text-secondary leading-relaxed">{log.action}</p>
                        </div>
                      </div>
                    ))}
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
