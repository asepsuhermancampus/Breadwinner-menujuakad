"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  giftAccountsFixture,
  guestGiftsTexts,
} from "@/features/guest-experience/content/experience-content";

export function GiftsSection({ onBack }: { onBack: () => void }) {
  const t = guestGiftsTexts;
  return (
    <section className="grid gap-5 px-5 py-6" aria-label="Hadiah opsional">
      <button
        type="button"
        onClick={onBack}
        className="flex w-fit items-center gap-1.5 text-xs font-semibold text-secondary hover:text-foreground"
      >
        ← Kembali
      </button>

      <header className="grid gap-2 text-center">
        <h2 className="whitespace-pre-line font-serif text-4xl leading-tight text-foreground">
          {t.heading}
        </h2>
        <p className="text-xs text-secondary">{t.intro}</p>
      </header>

      <div className="rounded-card border border-warning/40 bg-warning-bg p-4">
        <p className="flex items-center gap-1.5 text-xs font-bold text-warning">
          <Icon name="info" size={14} /> {t.moduleNote.title}
        </p>
        <p className="mt-1 text-xs text-secondary">{t.moduleNote.body}</p>
      </div>

      <div className="grid gap-3">
        {giftAccountsFixture.map((acc) => (
          <div
            key={acc.bank}
            className="flex items-center justify-between rounded-card border border-border bg-surface p-4"
          >
            <div>
              <p className="text-sm font-bold text-foreground">{acc.bank}</p>
              <p className="text-xs text-secondary">{acc.recipient}</p>
              <p className="font-mono text-sm text-foreground">{acc.maskedAccount}</p>
            </div>
            <Button variant="secondary" size="small">
              Salin nomor contoh
            </Button>
          </div>
        ))}
      </div>

      <div className="rounded-card border border-border bg-canvas p-4">
        <p className="text-xs font-bold text-foreground">{t.transferNote.title}</p>
        <p className="mt-1 text-xs text-secondary">{t.transferNote.body}</p>
      </div>

      <Button variant="secondary" className="w-full">
        Minta alamat pengiriman
      </Button>
      <p className="text-center text-[11px] text-muted">{t.shippingPrivacy}</p>
    </section>
  );
}
