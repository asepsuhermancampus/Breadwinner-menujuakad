"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { OnboardingStep } from "../contracts";

const steps = [
  ["profile", "Profil kalian"],
  ["events", "Rencana acara"],
  ["partner", "Undang pasangan"],
] as const;

export function OnboardingLayout({
  step,
  children,
  onNavigate,
}: {
  step: OnboardingStep;
  children: ReactNode;
  onNavigate: (step: OnboardingStep) => void;
}) {
  const [help, setHelp] = useState(false);
  const active = step === "profile" ? 0 : step === "events" ? 1 : 2;
  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <header className="flex min-h-20 items-center justify-between gap-3 border-b border-ux-border px-5 md:px-12">
        <Link
          href="/onboarding/profile"
          onClick={(event) => {
            event.preventDefault();
            onNavigate("profile");
          }}
          className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.6px] text-brand-secondary md:text-2xl"
        >
          <BrandLogo variant="cypress" width={38} height={18} />
          <span>menuju akad</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-6">
          <span className="font-mono text-xs text-secondary">{active + 1} / 3</span>
          <Button variant="ghost" className="text-xs" onClick={() => setHelp(true)}>
            Butuh bantuan?
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1136px] space-y-7 px-5 pt-6 pb-12 md:px-12">
        <nav
          aria-label="Langkah onboarding"
          className="rounded-control bg-ux-dock border border-ux-border p-1.5"
        >
          <ol className="grid grid-cols-3 gap-1.5">
            {steps.map(([key, label], index) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => onNavigate(key)}
                  aria-current={index === active ? "step" : undefined}
                  className={cn(
                    "flex min-h-11 w-full items-center justify-center gap-2 rounded-control px-2 py-2 text-xs font-medium md:gap-2.5 md:px-4 md:text-[13px] transition-all",
                    index === active
                      ? "bg-surface text-brand-secondary shadow-sm font-semibold"
                      : "text-secondary hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px]",
                      index === active
                        ? "bg-foreground text-on-primary"
                        : "bg-primary/8 text-brand-secondary",
                    )}
                  >
                    {index < active ? "✓" : `0${index + 1}`}
                  </span>
                  <span className="hidden min-[480px]:inline">{label}</span>
                  <span className="min-[480px]:hidden">
                    {["Profil", "Acara", "Pasangan"][index]}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
        {children}
      </main>
      <Dialog open={help} onClose={() => setHelp(false)} title="Mulai rencana kalian">
        <div className="space-y-4 text-sm leading-7 text-secondary">
          <p>
            Isi profil, pilih acara, lalu undang pasangan. Nama orang tua dan detail acara bisa
            dilengkapi nanti.
          </p>
          <p>
            Versi ini adalah preview internal. Draf dan tautan pasangan hanya bekerja dalam simulasi
            lokal pada perangkat ini.
          </p>
          <Button onClick={() => setHelp(false)}>Mengerti</Button>
        </div>
      </Dialog>
    </div>
  );
}
