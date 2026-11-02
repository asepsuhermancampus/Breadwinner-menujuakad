interface PillarItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
}

const pillars: PillarItem[] = [
  {
    id: "kolaborasi",
    number: "01",
    title: "Satu Ruang, Dua Sudut Pandang",
    tagline: "Kolaborasi Pasangan",
    description:
      "Hubungkan akun calon suami dan istri dalam satu dasbor privat. Setiap keputusan, ide vendor, dan progres tugas tersinkronisasi otomatis tanpa ada pesan penting yang terkubur di chat WhatsApp.",
  },
  {
    id: "kua",
    number: "02",
    title: "Syarat Resmi KUA Kemenag",
    tagline: "Legalitas Terarah",
    description:
      "Panduan runtut dokumen resmi Kemenag di Indonesia: mulai dari surat pengantar nikah kantor desa atau kelurahan, persetujuan kedua mempelai, pengantar RT/RW, tes kesehatan catin, hingga surat rekomendasi nikah antar kecamatan.",
  },
  {
    id: "finansial",
    number: "03",
    title: "Kalkulasi Dana & Tamu Presisi",
    tagline: "Finansial Terkendali",
    description:
      "Simulasikan rasio porsi katering buffet dan gubukan secara akurat berdasarkan jumlah undangan. Pantau komitmen tabungan berdua dan alokasi biaya vendor agar tetap sesuai rencana.",
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

        {/* 3 Pillars Editorial Flow */}
        <div className="mt-16 grid grid-cols-1 divide-y divide-ux-border border-y border-ux-border md:grid-cols-3 md:divide-y-0 md:divide-x">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="flex flex-col justify-start p-8 lg:p-10"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-light text-muted">
                  {pillar.number}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-secondary uppercase">
                  {pillar.tagline}
                </span>
              </div>

              <h3 className="mt-8 text-xl font-bold tracking-tight text-brand-secondary sm:text-2xl">
                {pillar.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
