"use client";

import { Button } from "@/components/ui/button";
import type { InvitationTheme } from "../types/studio";

type Props = {
  activeTheme: InvitationTheme;
  draftTheme: InvitationTheme;
  onSelectTheme: (theme: InvitationTheme) => void;
};

export function ThemeGallery({ activeTheme, draftTheme, onSelectTheme }: Props) {
  const themes: Array<{
    id: InvitationTheme;
    title: string;
    description: string;
    previewBg: string;
    previewText: string;
  }> = [
    {
      id: "editorial",
      title: "Editorial Light",
      description: "Foto lapang · serif lembut · putih hangat",
      previewBg: "#FBFBF9",
      previewText: "#141413",
    },
    {
      id: "cypress",
      title: "Cypress Modern",
      description: "Hijau cypress · struktur kontemporer",
      previewBg: "#1E3F32",
      previewText: "#FFFFFF",
    },
    {
      id: "monochrome",
      title: "Monochrome Type",
      description: "Tipografi tegas · tanpa foto cover",
      previewBg: "#141413",
      previewText: "#FFFFFF",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary">
        Mengganti tema akan menyimpan draf baru. Undangan publik yang aktif tidak berubah sampai
        Anda mempublikasikannya.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((t) => {
          const isDraftSelected = draftTheme === t.id;
          const isCurrentlyActive = activeTheme === t.id;

          return (
            <div
              key={t.id}
              className={`p-4 rounded-xl border transition-all ${
                isDraftSelected
                  ? "border-primary ring-2 ring-primary/20 bg-surface"
                  : "border-border bg-surface hover:border-primary/50"
              }`}
            >
              <div
                className="h-40 rounded-lg p-3 flex flex-col justify-between mb-3 border border-border"
                style={{ background: t.previewBg, color: t.previewText }}
              >
                <div className="text-[10px] uppercase tracking-widest opacity-70">
                  The Wedding of
                </div>
                <div className="font-serif text-lg text-center">Andi & Risa</div>
                <div className="text-[10px] text-center opacity-70">
                  14 · 02 · 2027 · Bumi Samami
                </div>
              </div>

              <div className="font-bold text-foreground text-sm">{t.title}</div>
              <div className="text-xs text-secondary mt-0.5">{t.description}</div>

              <div className="mt-3 flex items-center justify-between">
                {isCurrentlyActive && (
                  <span className="text-[11px] font-semibold text-success bg-success-bg px-2 py-0.5 rounded">
                    ✓ Tema Aktif (v3)
                  </span>
                )}
                <Button
                  variant={isDraftSelected ? "primary" : "secondary"}
                  size="small"
                  onClick={() => onSelectTheme(t.id)}
                  className="text-xs"
                >
                  {isDraftSelected ? "✓ Terpilih di Draf" : "Gunakan untuk Draf"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
