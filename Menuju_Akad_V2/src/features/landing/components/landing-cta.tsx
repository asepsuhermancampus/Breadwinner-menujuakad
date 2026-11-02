import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function LandingCta() {
  return (
    <section className="bg-brand-secondary py-20 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 rounded-card border border-white/15 bg-white/5 p-8 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <span className="font-sans text-xs font-semibold tracking-widest text-emerald-300 uppercase">
              Ruang Privat Berdua
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Hari bahagia dimulai{" "}
              <span className="font-serif font-normal italic text-emerald-200">
                dari langkah pertama
              </span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/90 sm:text-base">
              Buat ruang kalian hari ini. Rapikan setiap detail rencananya bersama, satu per satu.
            </p>
          </div>

          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-control bg-white px-6 py-3.5 text-sm font-semibold text-brand-secondary shadow-md transition hover:bg-neutral-100"
          >
            <span>Mulai gratis bersama</span>
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
