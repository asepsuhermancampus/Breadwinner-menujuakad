"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Icon } from "@/components/ui/icon";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-ux-border bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo variant="cypress" width={36} height={17} />
          <span className="font-sans text-xl font-semibold tracking-tight text-primary">
            menuju akad<span className="text-rose">.</span>
          </span>
        </Link>

        <nav
          aria-label="Navigasi publik"
          className="hidden items-center gap-8 text-sm font-medium text-secondary md:flex"
        >
          <a href="#tentang" className="transition-colors hover:text-foreground">
            Tentang
          </a>
          <a href="#cara-kerja" className="transition-colors hover:text-foreground">
            Cara kerja
          </a>
          <a href="#undangan" className="transition-colors hover:text-foreground">
            Undangan
          </a>
          <a href="#paket" className="transition-colors hover:text-foreground">
            Paket
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>Mulai gratis</span>
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
