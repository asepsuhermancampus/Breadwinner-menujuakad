"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, ArrowUpRight, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  category: "semua" | "kolaborasi" | "paket" | "kua";
  categoryLabel: string;
  q: string;
  a: string;
}

const categories = [
  { id: "semua", label: "Semua Tanya Jawab" },
  { id: "kolaborasi", label: "Ruang Berdua" },
  { id: "kua", label: "Syarat KUA & Tamu" },
  { id: "paket", label: "Paket & Biaya" },
] as const;

const faqs: FaqItem[] = [
  {
    id: "free-plan",
    category: "paket",
    categoryLabel: "Paket & Biaya",
    q: "Apakah kami bisa mulai merencanakan secara gratis?",
    a: "Tentu bisa. Paket Free langsung membuka dasbor berdua, checklist berkas pengantar nikah, catatan anggaran awal, dan tema undangan digital dasar tanpa batas waktu kedaluwarsa.",
  },
  {
    id: "couple-sync",
    category: "kolaborasi",
    categoryLabel: "Ruang Berdua",
    q: "Bagaimana cara menghubungkan akun dengan pasangan?",
    a: "Cukup salin tautan undangan privat di dasbor Anda dan kirimkan ke calon suami atau istri. Sekali klik, akun kalian berdua langsung tersinkronisasi dalam satu ruang perencana.",
  },
  {
    id: "kua-guidelines",
    category: "kua",
    categoryLabel: "Syarat KUA & Tamu",
    q: "Apakah panduan berkas KUA sudah sesuai regulasi Kemenag?",
    a: "Ya. Panduan disusun runtut sesuai standar Kemenag: mulai dari surat pengantar kantor desa/kelurahan, persetujuan kedua mempelai, tes kesehatan catin, hingga surat rekomendasi nikah antar kecamatan.",
  },
  {
    id: "lifetime-vs-premium",
    category: "paket",
    categoryLabel: "Paket & Biaya",
    q: "Apa keunggulan paket Lifetime dibanding paket lainnya?",
    a: "Lifetime adalah investasi satu kali bayar selamanya tanpa biaya langganan berulang. Anda mendapatkan akses tanpa batas ke studio undangan kustom, kalkulator katering lanjutan, dan ekspor laporan.",
  },
  {
    id: "guest-qr",
    category: "kua",
    categoryLabel: "Syarat KUA & Tamu",
    q: "Apakah undangan digital bisa dibagikan dengan nama tamu personal?",
    a: "Bisa. Setiap tamu mendapatkan tautan personal dengan sapaan khusus, batas kuota kehadiran (pax), dan kode QR check-in unik yang dapat dipindai panitia di meja resepsi.",
  },
  {
    id: "privacy-safety",
    category: "kolaborasi",
    categoryLabel: "Ruang Berdua",
    q: "Apakah data rencana pernikahan kami aman dan privat?",
    a: "Sangat aman. Menuju Akad 100% bebas dari iklan pihak ketiga. Seluruh rincian keuangan, nomor kontak tamu, dan dokumen hanya dapat diakses oleh Anda dan pasangan yang terhubung.",
  },
];

export function LandingFaq() {
  const [activeCategory, setActiveCategory] = useState<string>("semua");
  const [openId, setOpenId] = useState<string | null>("free-plan");

  const filteredFaqs =
    activeCategory === "semua" ? faqs : faqs.filter((faq) => faq.category === activeCategory);

  return (
    <section id="faq" className="border-t border-ux-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Kolom Kiri: Header Editorial & Kartu Bantuan */}
          <div className="space-y-8 lg:col-span-5">
            <div>
              <span className="font-sans text-xs font-semibold tracking-widest text-secondary uppercase">
                Tanya Jawab
              </span>
              <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
                Pertanyaan umum,{" "}
                <span className="font-serif font-normal italic text-forest-neutral">
                  jawaban jelas
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
                Kenali alur, fasilitas, dan keamanan ruang persiapan pernikahan kalian sebelum
                melangkah bersama.
              </p>
            </div>

            {/* Helpdesk Card */}
            <div className="rounded-2xl border border-ux-border bg-canvas/60 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-surface border border-ux-border text-brand-secondary">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-brand-secondary">
                    Punya pertanyaan lain?
                  </h3>
                  <span className="text-xs text-secondary">Tim kami siap membantu kalian</span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-secondary">
                Butuh konsultasi seputar alur KUA atau pilihan paket yang tepat? Hubungi tim pendamping kami.
              </p>
              <div className="mt-4 pt-3 border-t border-ux-border/60">
                <Link
                  href="https://wa.me/6281234567890?text=Halo%20Tim%20Menuju%20Akad,%20saya%20ingin%20bertanya%20seputar%20persiapan%20pernikahan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-secondary transition hover:text-forest-neutral"
                >
                  <MessageCircle size={14} className="text-forest-neutral" />
                  <span>Konsultasi via WhatsApp</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Slicing Filter Kategori & Accordion Modern */}
          <div className="space-y-6 lg:col-span-7">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    cat.id === activeCategory
                      ? "bg-brand-secondary text-white shadow-xs"
                      : "bg-canvas border border-ux-border text-secondary hover:text-foreground hover:bg-canvas/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Modern Accordion Cards */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                      isOpen
                        ? "border-brand-secondary/30 bg-canvas shadow-xs"
                        : "border-ux-border bg-surface hover:border-ux-border/90 hover:bg-canvas/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
                    >
                      <div className="space-y-1">
                        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">
                          {faq.categoryLabel}
                        </span>
                        <h4 className="font-sans text-sm font-bold text-brand-secondary sm:text-base">
                          {faq.q}
                        </h4>
                      </div>
                      <span
                        className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                          isOpen
                            ? "rotate-180 border-brand-secondary/20 bg-brand-secondary/10 text-brand-secondary"
                            : "border-ux-border bg-canvas text-secondary"
                        }`}
                      >
                        <ChevronDown size={15} />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-ux-border/60 px-5 pb-5 pt-3.5 sm:px-6 sm:pb-6 text-xs leading-relaxed text-secondary sm:text-sm">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
