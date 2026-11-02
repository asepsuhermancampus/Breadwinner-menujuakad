import { Users, FileCheck2, Calculator } from "lucide-react";

interface PillarItem {
  id: string;
  number: string;
  icon: typeof Users;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
}

const pillars: PillarItem[] = [
  {
    id: "kolaborasi",
    number: "01",
    icon: Users,
    title: "Satu Ruang, Dua Sudut Pandang",
    tagline: "Kolaborasi Pasangan",
    description:
      "Hubungkan akun calon suami dan istri dalam satu dasbor privat. Setiap keputusan, ide vendor, dan progres tugas tersinkronisasi otomatis tanpa ada pesan penting yang terkubur di chat WhatsApp.",
    highlights: ["Akun berdua tersinkron", "Riwayat pembaruan transparan", "Privasi 100% terjaga"],
  },
  {
    id: "kua",
    number: "02",
    icon: FileCheck2,
    title: "Syarat Resmi KUA Kemenag",
    tagline: "Legalitas Terarah",
    description:
      "Panduan runtut syarat administrasi nikah di Indonesia: dari formulir N1 Kelurahan, N2, N4, surat pengantar RT/RW, tes kesehatan Elsimil, hingga berkas rekomendasi nikah antar kecamatan.",
    highlights: ["Sesuai standar Kemenag RI", "Checklist berkas bertahap", "Tanpa bolak-balik KUA"],
  },
  {
    id: "finansial",
    number: "03",
    icon: Calculator,
    title: "Kalkulasi Dana & Tamu Presisi",
    tagline: "Finansial Terkendali",
    description:
      "Simulasikan rasio porsi katering buffet dan gubukan secara akurat berdasarkan jumlah undangan. Pantau komitmen tabungan berdua dan alokasi biaya vendor agar tetap sesuai rencana.",
    highlights: ["Kalkulator katering otomatis", "Komitmen tabungan bersama", "Rekap tamu & RSVP real-time"],
  },
];

export function LandingValues() {
  return (
    <section id="nilai" className="border-b border-ux-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Editorial Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-sans text-xs font-semibold tracking-widest text-secondary uppercase">
            Pondasi Ketenangan
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
            Tiga pilar ketenangan{" "}
            <span className="font-serif font-normal italic text-forest-neutral">
              menuju hari bahagia
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
            Bukan sekadar buku catatan biasa. Menuju Akad dirancang khusus untuk memandu calon
            pengantin di Indonesia melalui tahapan legal, finansial, dan teknis acara secara tenang
            dan teratur.
          </p>
        </div>

        {/* 3 Pillars Flow */}
        <div className="mt-16 grid grid-cols-1 divide-y divide-ux-border border-y border-ux-border md:grid-cols-3 md:divide-y-0 md:divide-x">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="flex flex-col justify-between p-8 lg:p-10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-light text-muted">
                      {pillar.number}
                    </span>
                    <span className="text-[11px] font-semibold tracking-wider text-secondary uppercase">
                      {pillar.tagline}
                    </span>
                  </div>

                  <div className="mt-8 flex size-11 items-center justify-center rounded-xl bg-canvas border border-ux-border text-brand-secondary">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-brand-secondary">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-secondary">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-ux-border/60 pt-6">
                  <span className="block text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2.5">
                    Fasilitas Utama
                  </span>
                  <ul className="space-y-1.5 text-xs text-foreground font-medium">
                    {pillar.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-brand-secondary/60 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
