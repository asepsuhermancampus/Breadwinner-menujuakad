import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function LandingCta() {
  return (
    <section className="bg-primary py-20 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-8 rounded-card border border-white/15 bg-white/5 p-8 sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-xl space-y-3">
            <span className="font-sans text-xs font-semibold tracking-wider text-[#D4C6A8] uppercase">
              Untuk Hari Yang Tak Terulang
            </span>
            <h2 className="font-sans text-3xl font-semibold tracking-[-0.9px] text-white sm:text-4xl">
              Hari bahagia dimulai
              <br />
              dari langkah kecil.
            </h2>
            <p className="text-sm leading-relaxed text-[#E2E8E0]">
              Buat ruang kalian hari ini. Rapikan rencananya, satu per satu.
            </p>
          </div>

          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-control bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-md transition hover:bg-neutral-100"
          >
            <span>Mulai gratis bersama</span>
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
