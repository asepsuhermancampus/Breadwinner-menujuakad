"use client";

import { useState } from "react";
import { themeComparisonRows } from "@/features/invitation-manager/content/manager-content";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { guestExperienceContent } from "@/features/guest-experience/content/experience-content";

export function ThemeComparePanel({ onUseEditorial }: { onUseEditorial: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  return (
    <section className="grid gap-4" aria-label="Bandingkan tema">
      <div className="grid gap-4 md:grid-cols-2">
        {(["Editorial Light", "Cypress Modern"] as const).map((name, i) => (
          <div key={name} className="overflow-hidden rounded-card border border-border bg-surface">
            <img
              src={`/assets/images/editorial-${i + 4}.png`}
              alt={`Pratinjau tema ${name}`}
              className="h-56 w-full object-cover"
            />
            <div className="grid gap-2 p-4">
              <p className="font-serif text-2xl leading-tight text-foreground">
                Andi
                <br />
                &amp; Risa
              </p>
              <p className="font-mono text-xs tracking-widest text-secondary">14 · 02 · 2027</p>
              <p className="text-xs font-bold text-foreground">{name}</p>
              <Button
                size="small"
                variant="secondary"
                className="w-fit"
                onClick={() => setPreview(name)}
              >
                Lihat demo tema
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <table className="w-full text-left text-xs">
          <tbody>
            {themeComparisonRows.map((row, i) => (
              <tr key={row.aspect} className={i > 0 ? "border-t border-border" : undefined}>
                <th scope="row" className="p-3 font-semibold text-secondary">
                  {row.aspect}
                </th>
                <td className="p-3 text-foreground">{row.editorial}</td>
                <td className="p-3 text-foreground">{row.cypress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-secondary">
          Memilih tema menyimpan draf baru; konten, jawaban RSVP, dan tautan personal tidak direset.
        </p>
        <Button size="small" onClick={onUseEditorial}>
          Gunakan Editorial Light
        </Button>
      </div>
      <Dialog
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={`Demo ${preview ?? "tema"}`}
      >
        <div
          className={`grid gap-4 rounded-card p-5 text-center ${preview === "Cypress Modern" ? "bg-primary text-white" : "bg-canvas text-foreground"}`}
        >
          <img
            src={guestExperienceContent.gallery[0]!.src}
            alt={guestExperienceContent.gallery[0]!.alt}
            className="h-48 w-full rounded-card object-cover"
          />
          <h3 className="whitespace-pre-line font-serif text-4xl">
            {guestExperienceContent.heading}
          </h3>
          <p className="text-xs">{guestExperienceContent.eventNote.body}</p>
          <p className="text-xs">
            Pratinjau tema memakai konten dan jawaban RSVP yang sama. Memilih demo belum mengubah
            draf atau undangan aktif.
          </p>
        </div>
      </Dialog>
    </section>
  );
}
