"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";

const faqs = [
  {
    q: "Apakah bisa mulai secara gratis?",
    a: "Bisa. Paket Free membantu kalian mulai menata checklist, catatan anggaran, dan undangan dasar. Upgrade hanya saat membutuhkan dukungan tambahan.",
  },
  {
    q: "Bagaimana merencanakan bersama pasangan?",
    a: "Buat workspace pasangan, lalu ajak pasangan bergabung. Kalian dapat membagi tugas dan melihat rencana dalam ruang yang sama.",
  },
  {
    q: "Apa bedanya Premium dan Lifetime?",
    a: "Premium mengikuti periode berlangganan. Lifetime memberi akses Premium tanpa kedaluwarsa. Ketersediaan fitur tetap mengikuti rilis layanan.",
  },
  {
    q: "Apakah semua fitur langsung terbuka saat upgrade?",
    a: "Hanya fitur yang tersedia dan termasuk paket kalian. Fitur yang segera hadir atau dalam pemeliharaan tetap mengikuti status layanan.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-ux-border bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="font-sans text-xs font-semibold tracking-wider text-rose uppercase">
              05 / Sebelum Melangkah
            </span>
            <h2 className="mt-3 font-sans text-3xl font-semibold tracking-[-0.9px] text-brand-secondary sm:text-4xl">
              Pertanyaan?
              <br />
              Kita bahas.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              Kenali dulu ruangnya.
              <br />
              Mulai saat kalian siap.
            </p>
          </div>

          <div className="space-y-4 lg:col-span-7">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.q}
                  className="rounded-card border border-ux-border bg-ux-dock/40 overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-sans text-base font-semibold text-brand-secondary">
                      {faq.q}
                    </span>
                    <span className="ml-4 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface border border-ux-border text-brand-secondary">
                      <Icon name={isOpen ? "x" : "plus"} size={16} />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm leading-relaxed text-secondary border-t border-ux-border/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
