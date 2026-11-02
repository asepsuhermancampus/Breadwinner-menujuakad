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
      "Satu dasbor privat untuk berdua. Catat keputusan, pilihan vendor, dan progres nikah secara otomatis tanpa ada pesan penting yang hilang di chat.",
  },
  {
    id: "kua",
    number: "02",
    title: "Syarat Resmi KUA Kemenag",
    tagline: "Legalitas Terarah",
    description:
      "Panduan berkas nikah resmi Kemenag langkah demi langkah: dari surat kelurahan, persetujuan catin, hingga tes medis tanpa perlu bolak-balik KUA.",
  },
  {
    id: "finansial",
    number: "03",
    title: "Kalkulasi Dana & Tamu Presisi",
    tagline: "Finansial Terkendali",
    description:
      "Hitung otomatis porsi katering buffet dan gubukan sesuai jumlah undangan. Pantau komitmen tabungan bersama dan alokasi biaya vendor secara transparan.",
  },
];

export function LandingValues() {
  return (
    <section id="nilai" className="border-b border-ux-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Editorial Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
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
              className="flex flex-col justify-start p-6 sm:p-7 lg:p-8 xl:p-9"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl font-light text-muted">
                  {pillar.number}
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-secondary uppercase">
                  {pillar.tagline}
                </span>
              </div>

              <h3 className="mt-6 text-base font-bold tracking-tight text-brand-secondary sm:text-lg lg:text-base xl:text-lg 2xl:text-xl">
                {pillar.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-secondary">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
