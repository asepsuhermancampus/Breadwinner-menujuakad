"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, ArrowUpRight, CheckCircle2, HeartHandshake } from "lucide-react";
import { editorialFaqs } from "./landing-faq-data";

export function LandingFaq() {
  const [openId, setOpenId] = useState<string | null>("couple-sync");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="border-t border-ux-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center mb-14 lg:mb-16">
          <span className="font-sans text-xs font-semibold tracking-widest text-secondary uppercase">
            Tanya Jawab & Bantuan
          </span>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-brand-secondary sm:text-4xl lg:text-5xl">
            Pertanyaan umum,{" "}
            <span className="font-serif font-normal italic text-forest-neutral">
              jawaban jelas
            </span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-secondary sm:text-base">
            Kenali bagaimana Menuju Akad mempermudah persiapan pernikahan yang sebelumnya rumit dan
            manual menjadi teratur dalam satu ruang terpadu.
          </p>
        </div>

        {/* 2 Equal Columns: List FAQ di Kiri & Konsultasi WhatsApp di Kanan */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-12">
          {/* Kolom Kiri: Minimalist Hairline Editorial Accordion */}
          <div className="flex flex-col justify-between rounded-3xl border border-ux-border bg-canvas/30 p-6 sm:p-8">
            <div className="divide-y divide-ux-border">
              {editorialFaqs.slice(0, 5).map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div key={faq.id} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-3 text-left group"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="font-serif text-sm font-light text-muted shrink-0 w-5 pt-0.5">
                          {faq.num}
                        </span>
                        <h3 className="font-sans text-sm sm:text-[15px] font-semibold text-brand-secondary group-hover:text-forest-neutral transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                      <span
                        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center text-secondary transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-brand-secondary" : ""
                        }`}
                      >
                        <ChevronDown size={15} />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pt-2.5 pb-2 pl-8 pr-4 text-xs leading-relaxed text-secondary sm:text-sm">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Kolom Kanan: Card Pendampingan & Konsultasi WhatsApp (Ukuran Sama / Equal Height) */}
          <div className="flex flex-col justify-between rounded-3xl border border-ux-border bg-canvas/70 p-6 sm:p-8 lg:p-9 shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-surface border border-ux-border text-brand-secondary">
                  <HeartHandshake size={20} />
                </div>
                <span className="rounded-full border border-ux-border bg-surface px-3 py-1 text-[11px] font-semibold tracking-wider text-secondary uppercase">
                  Pendampingan Khusus
                </span>
              </div>

              <h3 className="mt-6 font-sans text-xl sm:text-2xl font-bold tracking-tight text-brand-secondary">
                Punya pertanyaan atau skenario khusus untuk pernikahanmu?
              </h3>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-secondary">
                Setiap pernikahan memiliki keunikan tersendiri—mulai dari alur berkas rekomendasi nikah
                beda kota, penyesuaian porsi katering keluarga, hingga tata kelola anggaran. Tim kami
                siap berdiskusi langsung bersama kalian.
              </p>

              <div className="mt-6 space-y-2.5 border-t border-ux-border/60 pt-5 text-xs text-secondary">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-forest-neutral shrink-0" />
                  <span>Konsultasi langsung dengan tim manusia (bukan bot otomatis)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-forest-neutral shrink-0" />
                  <span>Panduan bebas biaya seputar alur KUA dan kalkulasi dana vendor</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-forest-neutral shrink-0" />
                  <span>Rekomendasi solusi yang langsung dapat diterapkan di dasbor berdua</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-ux-border/60">
              <Link
                href="https://wa.me/6281234567890?text=Halo%20Tim%20Menuju%20Akad,%20saya%20ingin%20konsultasi%20seputar%20persiapan%20pernikahan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-control bg-brand-secondary px-5 py-3.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-secondary/90"
              >
                <MessageCircle size={15} />
                <span>Mulai Konsultasi via WhatsApp</span>
                <ArrowUpRight size={14} />
              </Link>
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Aktif setiap hari · Respons cepat tim pendamping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
