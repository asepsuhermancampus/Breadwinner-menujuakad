"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { WeddingKitSection } from "../types/wedding-kit";
import styles from "./wedding-kit.module.css";

type Props = {
  initialSections: WeddingKitSection[];
};

export function WeddingKitScreen({ initialSections }: Props) {
  const [sections, setSections] = useState<WeddingKitSection[]>(initialSections);

  const handleToggle = (id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)));
  };

  const selectedCount = sections.filter((s) => s.selected).length;

  return (
    <main id="main-content" className={styles.container}>
      <header>
        <div className="flex items-center gap-2">
          <h1 className="font-serif text-3xl text-foreground">Wedding Kit</h1>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            Maintenance
          </span>
        </div>
        <p className="mt-1 text-sm text-secondary">
          Ringkasan praktis untuk keluarga, PIC, dan vendor. Siap dibagikan atau dicetak.
        </p>
      </header>

      <div className={styles.banner} role="status">
        <Icon name="alert-circle" size={18} className="shrink-0" />
        <div>
          <strong className="block font-semibold">
            Modul Wedding Kit sedang dalam pemeliharaan (Maintenance).
          </strong>
          <p className="text-xs">
            Data pembelian dan hak akses akun Premium kamu tetap aman. Pembuatan dan ekspor dokumen
            PDF cetak sedang disempurnakan dan akan segera kembali aktif.
          </p>
        </div>
      </div>

      <div className={styles.sectionsGrid}>
        <section className={styles.panel} aria-labelledby="section-title">
          <div>
            <span className="text-xs text-primary font-semibold">Termasuk dalam Premium</span>
            <h2 id="section-title" className="text-base font-semibold text-foreground mt-0.5">
              Apa yang ingin disertakan?
            </h2>
          </div>

          <div className="space-y-2">
            {sections.map((section) => (
              <label key={section.id} className={styles.sectionItem}>
                <div>
                  <strong className="block text-sm text-foreground">{section.name}</strong>
                  <span className="text-xs text-secondary">{section.detail}</span>
                </div>
                <input
                  type="checkbox"
                  checked={section.selected}
                  onChange={() => handleToggle(section.id)}
                  className="size-4 cursor-pointer rounded border-border text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>

          <div className="rounded-control bg-subtle p-3 text-xs text-secondary flex items-start gap-2">
            <Icon name="shield" size={16} className="text-primary mt-0.5 shrink-0" />
            <span>
              Salinan KTP, KK, dan dokumen pribadi tidak pernah ikut diekspor. Periksa daftar kontak
              sebelum membagikan PDF.
            </span>
          </div>

          <Button disabled className="w-full">
            Unduh Wedding Kit (PDF Sementara Dinonaktifkan)
          </Button>
        </section>

        <section className={styles.panel} aria-labelledby="preview-title">
          <div className="flex items-center justify-between">
            <h2 id="preview-title" className="text-base font-semibold text-foreground">
              Pratinjau struktur dokumen
            </h2>
            <span className="text-xs font-mono text-secondary">
              {selectedCount} bagian dipilih · A4 · ID
            </span>
          </div>

          <div className={styles.previewDoc}>
            <div className="border-b border-border pb-3 flex justify-between items-end">
              <div>
                <span className="font-serif text-xl font-bold text-primary">menuju akad</span>
                <p className="text-xs text-secondary">Wedding Kit Ringkasan Koordinasi</p>
              </div>
              <span className="text-[10px] font-mono text-muted uppercase">HALAMAN 1 DARI 6</span>
            </div>

            <div className="space-y-3 py-2 text-xs">
              <div className="rounded bg-subtle p-2">
                <strong className="text-foreground">Andi Ramadhan & Risa Pratiwi</strong>
                <p className="text-secondary text-[11px]">14 Februari 2027 · Bumi Samami Bandung</p>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-foreground block">Bagian yang aktif:</span>
                {sections
                  .filter((s) => s.selected)
                  .map((s) => (
                    <div key={s.id} className="flex items-center gap-2 text-secondary">
                      <span className="text-primary font-bold">✓</span>
                      <span>
                        {s.name} ({s.detail})
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-auto border-t border-border pt-2 text-[10px] text-muted text-center">
              Dokumen resmi draf koordinasi keluarga & vendor · Dibuat otomatis oleh Menuju Akad
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
