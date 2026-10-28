"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Icon } from "@/components/ui/icon";

export function LandingNav() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const abort = new AbortController();
    const refresh = () => {
      void fetch("/api/auth/session", { cache: "no-store", signal: abort.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then((session) => setAuthenticated(Boolean(session?.user?.email)))
        .catch(() => {
          if (!abort.signal.aborted) setAuthenticated(false);
        });
    };
    refresh();
    window.addEventListener("focus", refresh);
    const channel =
      typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("next-auth") : null;
    channel?.addEventListener("message", refresh);
    return () => {
      abort.abort();
      window.removeEventListener("focus", refresh);
      channel?.close();
    };
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-ux-border bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo variant="cypress" width={36} height={17} />
          <span className="font-sans text-xl font-semibold tracking-tight text-brand-secondary">
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

        <div className="flex items-center gap-3">
          {authenticated === null ? (
            <span role="status" className="text-xs">
              Memuat sesi?
            </span>
          ) : authenticated ? (
            <Link
              href="/dashboard"
              className="rounded-control bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-brand-secondary transition-colors hover:text-primary-hover"
              >
                Masuk
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-control bg-primary px-4 py-2.5 text-xs font-semibold text-on-primary shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span>Coba dashboard gratis</span>
                <Icon name="arrow-right" size={14} />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
