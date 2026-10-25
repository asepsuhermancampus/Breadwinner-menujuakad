"use client";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import styles from "@/features/wedding-kit/components/wedding-kit.module.css";
import account from "@/features/account/components/account.module.css";
export function PlanExport() {
  return (
    <section id="feature-pdf" tabIndex={-1} className="space-y-6">
      <header>
        <h1 className={account.heading}>Wedding Kit</h1>
        <p className="text-sm text-secondary">
          Ringkasan praktis untuk keluarga, PIC, dan vendor. Siap dibagikan atau dicetak.
        </p>
      </header>
      <div className={styles.sectionsGrid}>
        <section className={styles.panel}>
          <h2 className="text-lg font-semibold">Bagian dalam dokumen kalian</h2>
          <div className="grid gap-3">
            {["Daftar tamu", "Tugas & persiapan", "Ringkasan dokumen", "Anggaran acara"].map(
              (label) => (
                <div key={label} className={styles.sectionItem}>
                  <span className="text-sm">{label}</span>
                  <Icon name="check" size={18} />
                </div>
              ),
            )}
          </div>
          <p className="rounded-control bg-ux-dock p-4 text-xs leading-relaxed text-secondary">
            Dokumen dibuat dari data terbaru di akun kalian. Periksa data dan kontak sebelum
            membagikannya.
          </p>
          <Link
            href="/api/workspace/export"
            target="_blank"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            <Icon name="download" size={18} /> Buka dokumen cetak
          </Link>
          <p className="text-sm text-secondary">
            Pada tab dokumen, gunakan Cetak (Ctrl+P) lalu pilih Simpan sebagai PDF.
          </p>
        </section>
        <aside className="rounded-card bg-ux-dock p-6">
          <p className="mb-4 text-center font-mono text-xs text-secondary">
            DOKUMEN RENCANA · A4 · BAHASA INDONESIA
          </p>
          <div className={styles.previewDoc}>
            <span className="font-serif text-2xl text-primary">menuju akad</span>
            <div className="border-t border-ux-border pt-8">
              <h2 className="font-serif text-4xl text-primary">Wedding Kit</h2>
              <p className="mt-3 text-sm text-secondary">Ringkasan perencanaan kalian</p>
            </div>
            <ol className="mt-6 grid gap-4 text-sm text-secondary">
              {["Daftar tamu", "Tugas & persiapan", "Ringkasan dokumen", "Anggaran acara"].map(
                (label, index) => (
                  <li key={label} className="flex gap-4 border-b border-ux-border pb-3">
                    <span className="font-mono text-xs">0{index + 1}</span>
                    {label}
                  </li>
                ),
              )}
            </ol>
            <p className="mt-auto text-xs leading-relaxed text-secondary">
              Buka dokumen cetak untuk melihat seluruh data terbaru.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
