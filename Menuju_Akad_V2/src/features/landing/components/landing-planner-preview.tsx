import { Icon } from "@/components/ui/icon";

const benefits = [
  {
    num: "01",
    title: "Langkah yang jelas",
    desc: "Tentukan prioritas, tanggal, dan siapa yang mengerjakan tugas berikutnya.",
  },
  {
    num: "02",
    title: "Rencana yang disepakati",
    desc: "Bagi peran dan bicarakan anggaran dalam konteks acara yang sama.",
  },
  {
    num: "03",
    title: "Detail tetap terlihat",
    desc: "Dari dokumen hingga rundown, simpan hal penting tanpa catatan terpencar.",
  },
];

export function LandingPlannerPreview() {
  return (
    <section className="bg-canvas py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-14 max-w-2xl">
          <span className="font-sans text-xs font-semibold tracking-wider text-rose uppercase">
            01 / Ruang untuk Merencanakan
          </span>
          <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.9px] text-primary sm:text-4xl">
            Tahu yang perlu dilakukan.
            <br />
            Lebih tenang melangkah.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-secondary">
            Satukan tugas, anggaran, dan daftar tamu. Supaya obrolan kalian bukan lagi “sudah sampai
            mana?”, tetapi “selanjutnya, kita apa?”.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-5">
            {benefits.map((b) => (
              <div key={b.num} className="border-l-2 border-ux-border pl-5">
                <span className="font-mono text-xs font-semibold text-rose">{b.num}</span>
                <h3 className="mt-1 font-sans text-lg font-semibold text-primary">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-secondary">{b.desc}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-card border border-ux-border bg-surface shadow-md">
              <div className="flex items-center justify-between border-b border-ux-border bg-ux-dock px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-primary text-xs">menuju akad</span>
                  <span className="text-secondary text-xs">·</span>
                  <span className="text-xs text-secondary">Rencana kita</span>
                </div>
                <div className="flex items-center -space-x-1.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#E9EBDD] font-mono text-[10px] font-bold text-primary">
                    A
                  </span>
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#F4E6DC] font-mono text-[10px] font-bold text-rose">
                    R
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ux-border pb-4">
                  <div>
                    <span className="font-mono text-[10px] text-secondary">
                      MINGGU, 25 OKTOBER 2026
                    </span>
                    <h4 className="font-sans text-xl font-semibold text-primary">
                      Selamat pagi, Andi & Risa.
                    </h4>
                  </div>
                  <span className="rounded-full bg-ux-dock border border-ux-border px-3 py-1 font-mono text-xs font-semibold text-primary">
                    14 Feb 2027
                  </span>
                </div>

                <div className="flex gap-2 border-b border-ux-border pb-3 text-xs">
                  <span className="font-semibold text-primary border-b-2 border-primary pb-3 -mb-3">
                    Ringkasan
                  </span>
                  <span className="text-secondary px-3">Checklist</span>
                  <span className="text-secondary px-3">Anggaran</span>
                  <span className="text-secondary px-3">Tamu</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-3 rounded-control bg-ux-dock/60 border border-ux-border p-3.5">
                    <p className="font-sans text-xs font-semibold text-primary">
                      Langkah kecil minggu ini
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-secondary">
                        <span className="flex items-center gap-2">
                          <span className="text-emerald-700">✓</span> Diskusikan konsep acara
                        </span>
                        <span className="text-[10px] text-muted">Bersama</span>
                      </div>
                      <div className="flex items-center justify-between text-secondary">
                        <span className="flex items-center gap-2">
                          <span className="text-emerald-700">✓</span> Survei tempat akad
                        </span>
                        <span className="text-[10px] text-muted">Risa</span>
                      </div>
                      <div className="flex items-center justify-between font-medium text-primary">
                        <span className="flex items-center gap-2">
                          <span className="text-muted">○</span> Lengkapi daftar tamu
                        </span>
                        <span className="text-[10px] text-secondary">Andi</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 rounded-control bg-ux-dock/60 border border-ux-border p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="font-sans text-xs font-semibold text-primary">Anggaran kita</p>
                      <span className="text-[10px] text-secondary">Tercatat. Terkendali.</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-secondary mb-1">
                          <span>Venue</span>
                          <span>70%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-ux-border">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: "70%" }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] text-secondary mb-1">
                          <span>Busana</span>
                          <span>40%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-ux-border">
                          <div
                            className="h-1.5 rounded-full bg-champagne"
                            style={{ width: "40%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-control bg-[#F3F6EE] border border-ux-border px-3.5 py-2.5 text-xs text-primary">
                  <Icon name="check" size={14} className="text-emerald-700" />
                  <span>Risa menandai survei tempat akad selesai.</span>
                </div>
              </div>

              <div className="border-t border-ux-border bg-ux-dock px-5 py-2 text-right">
                <span className="text-[11px] text-secondary">Atur rencana kalian di dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
