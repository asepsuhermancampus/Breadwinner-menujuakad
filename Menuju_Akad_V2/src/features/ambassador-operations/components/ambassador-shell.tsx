"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { Icon } from "@/components/ui/icon";

type AmbassadorShellProps = {
  children: ReactNode;
  email: string;
};

export function AmbassadorShell({ children, email }: AmbassadorShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-foreground antialiased selection:bg-brand-secondary/20">
      <header className="sticky top-0 z-40 border-b border-ux-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/ba" className="flex items-center gap-2.5" aria-label="Menuju Akad Ambassador">
              <BrandLogo variant="cypress" width={32} height={16} className="h-auto shrink-0" />
              <span className="font-heading text-sm font-semibold tracking-tight text-foreground">
                Menuju Akad
              </span>
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/20 bg-warning-bg px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase text-warning">
              <span className="size-1.5 rounded-full bg-warning" aria-hidden="true" />
              Mitra Ambassador · Gold
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-foreground">Sinta Larasati</p>
              <p className="text-[11px] text-secondary">{email || "sinta@ambassador.id"}</p>
            </div>
            <Link
              href="/account"
              className="inline-flex size-9 items-center justify-center rounded-control border border-ux-border bg-canvas text-secondary transition-colors hover:bg-subtle hover:text-foreground"
              aria-label="Pengaturan akun"
              title="Pengaturan akun"
            >
              <Icon name="settings" size={16} />
            </Link>
            <Link
              href="/api/auth/signout"
              className="inline-flex size-9 items-center justify-center rounded-control border border-ux-border bg-canvas text-secondary transition-colors hover:bg-danger-bg hover:text-danger"
              aria-label="Keluar sesi"
              title="Keluar sesi"
            >
              <Icon name="logout" size={16} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-card border border-ux-border bg-surface p-6 shadow-xs sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

