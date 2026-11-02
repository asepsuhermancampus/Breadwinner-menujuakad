"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MessageCircle, ArrowUpRight } from "lucide-react";
import { editorialFaqs } from "./landing-faq-data";

export function LandingFaq() {
  const [openId, setOpenId] = useState<string | null>("couple-sync");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="border-t border-ux-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Centered Editorial Header */}
        <div className="mx-auto max-w-3xl text-center">
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
            Kenali bagaimana Menuju Akad mempermudah tahapan pernikahan yang sebelumnya rumit dan manual
            menjadi teratur dalam satu ruang terpadu.
          </p>
        </div>

        {/* Minimalist Hairline Editorial Accordion */}
        <div className="mx-auto mt-14 max-w-3xl divide-y divide-ux-border border-y border-ux-border">
          {editorialFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 py-5 sm:py-6 text-left group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="font-serif text-sm sm:text-base font-light text-muted shrink-0 w-6 pt-0.5">
                      {faq.num}
                    </span>
                    <h3 className="font-sans text-base sm:text-lg font-semibold tracking-tight text-brand-secondary group-hover:text-forest-neutral transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <span
                    className={`mt-1 flex size-6 shrink-0 items-center justify-center text-secondary transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-secondary" : ""
                    }`}
                  >
                    <ChevronDown size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6 pl-10 pr-6 sm:pl-10 text-sm leading-relaxed text-secondary sm:text-[15px]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing Helpdesk Ribbon */}
        <div className="mx-auto mt-12 max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-ux-border bg-canvas/60 p-5 sm:px-7">
          <div className="text-center sm:text-left">
            <span className="block text-xs font-semibold text-brand-secondary">
              Masih memiliki pertanyaan seputar rencana pernikahan kalian?
            </span>
            <span className="text-[11px] text-secondary">
              Tim pendamping kami siap membantu memberikan panduan via WhatsApp.
            </span>
          </div>

          <Link
            href="https://wa.me/6281234567890?text=Halo%20Tim%20Menuju%20Akad,%20saya%20ingin%20konsultasi%20seputar%20persiapan%20pernikahan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-control bg-brand-secondary px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-brand-secondary/90 shrink-0"
          >
            <MessageCircle size={14} />
            <span>Konsultasi WhatsApp</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
