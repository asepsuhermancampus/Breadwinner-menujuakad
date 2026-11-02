"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, ArrowUpRight, HelpCircle } from "lucide-react";
import { faqCategories, landingFaqs } from "./landing-faq-data";

export function LandingFaq() {
  const [activeCategory, setActiveCategory] = useState<string>("kolaborasi");
  const [openId, setOpenId] = useState<string | null>("sync-problem");

  const currentFaqs = landingFaqs.filter((faq) => faq.category === activeCategory);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const firstFaq = landingFaqs.find((f) => f.category === catId);
    setOpenId(firstFaq ? firstFaq.id : null);
  };

  return (
    <section id="faq" className="border-t border-ux-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Kolom Kiri: Header & Card Konsultasi (Jangkar Bawah) */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
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
                Kenali bagaimana Menuju Akad mempermudah tahapan yang sebelumnya rumit dan manual
                menjadi teratur dalam satu ruang.
              </p>
            </div>

            {/* Helpdesk Card */}
            <div className="rounded-2xl border border-ux-border bg-canvas/70 p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-ux-border text-brand-secondary">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-bold text-brand-secondary">
                    Punya pertanyaan lain?
                  </h3>
                  <span className="text-xs text-secondary">Tim pendamping kami siap membantu</span>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-secondary">
                Butuh konsultasi seputar berkas KUA atau paket yang tepat? Hubungi tim pendamping kami.
              </p>
              <div className="mt-4 pt-3 border-t border-ux-border/60">
                <Link
                  href="https://wa.me/6281234567890?text=Halo%20Tim%20Menuju%20Akad,%20saya%20ingin%20konsultasi%20seputar%20persiapan%20pernikahan"
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

          {/* Kolom Kanan: Slicing Per Kategori (Selaras Seline dengan Card Kiri) */}
          <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
            {/* Filter Kategori Interaktif (Tanpa Semua Tanya Jawab) */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
              {faqCategories.map((cat) => {
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? "bg-brand-secondary text-white shadow-xs"
                        : "bg-canvas border border-ux-border text-secondary hover:text-foreground hover:bg-canvas/80"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* 3 Accordion Cards Per Kategori (Tinggi Terkontrol Seline) */}
            <div className="space-y-2.5">
              {currentFaqs.map((faq) => {
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
                      className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6"
                    >
                      <h4 className="font-sans text-sm font-bold text-brand-secondary sm:text-[15px]">
                        {faq.q}
                      </h4>
                      <span
                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 ${
                          isOpen
                            ? "rotate-180 border-brand-secondary/20 bg-brand-secondary/10 text-brand-secondary"
                            : "border-ux-border bg-canvas text-secondary"
                        }`}
                      >
                        <ChevronDown size={14} />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-ux-border/60 px-5 pb-4 pt-3 sm:px-6 sm:pb-5 text-xs leading-relaxed text-secondary sm:text-[13px]">
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
