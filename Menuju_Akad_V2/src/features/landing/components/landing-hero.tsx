"use client";

import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-brand-secondary py-24 text-white lg:py-32">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/auth-editorial.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(270deg, rgba(18, 45, 36, 0.96) 0%, rgba(23, 57, 46, 0.88) 35%, rgba(22, 54, 44, 0.6) 64%, rgba(22, 54, 44, 0.35) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-champagne/30 bg-brand-secondary/40 px-3.5 py-1.5 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-200" />
            <span className="font-sans text-xs font-semibold tracking-wider text-emerald-200 uppercase">
              Wedding Planner & Undangan Digital
            </span>
          </div>

          <h1 className="font-sans text-4xl leading-[1.1] font-semibold tracking-[-1.5px] text-white sm:text-5xl lg:text-6xl">
            Rencana besar.
            <br />
            Langkah kecil.
            <br />
            <span className="text-emerald-200">Selalu berdua.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Dari checklist pertama hingga undangan yang berkesan. Menuju Akad membantu kalian
            merencanakan hari istimewa—lebih rapi, lebih tenang, bersama.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 rounded-control bg-white px-6 py-3 text-sm font-semibold text-[#141413] shadow-md transition hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span>Mulai gratis</span>
              <Icon name="arrow-right" size={16} />
            </Link>

            <a
              href="#cara-kerja"
              className="inline-flex items-center gap-2 rounded-control border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Icon name="check" size={16} />
              <span>Lihat cara kerjanya</span>
            </a>
          </div>

          <p className="text-xs text-white/70">
            Mulai dengan paket Free. Upgrade saat kalian siap.
          </p>
        </div>
      </div>
    </section>
  );
}
