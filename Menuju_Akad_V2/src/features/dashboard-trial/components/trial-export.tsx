"use client";
import { useState } from "react";
import { useTrial } from "./trial-provider";
import { trialReport } from "../domain/trial-export";
import { Button } from "@/components/ui/button";
import styles from "@/features/wedding-kit/components/wedding-kit.module.css";
import account from "@/features/account/components/account.module.css";
const sections = [
  ["guests", "Daftar tamu"],
  ["tasks", "Tugas & persiapan"],
  ["documents", "Dokumen KUA"],
  ["finance", "Anggaran acara"],
  ["calendar", "Kalender"],
  ["rundown", "Rundown"],
  ["seserahan", "Seserahan"],
  ["emergency", "Perlengkapan darurat"],
  ["catering", "Katering"],
] as const;
export function TrialExport() {
  const trial = useTrial(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function open(exporting = false) {
    if (!trial?.snapshot || busy) return;
    const tab = window.open("about:blank", "_blank");
    if (!tab) {
      setError("Izinkan tab baru untuk membuka dokumen cetak.");
      return;
    }
    tab.opener = null;
    setBusy(true);
    try {
      const html = trialReport(trial.snapshot);
      tab.document.open();
      tab.document.write(html);
      tab.document.close();
      if (exporting) {
        if (!(await trial.consumeExport())) {
          tab.close();
          return;
        }
        tab.focus();
        tab.print();
      }
      setError("");
    } catch {
      tab.close();
      setError("Dokumen belum dapat dibuka.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section id="feature-pdf" className="space-y-6">
      <header>
        <h1 className={account.heading}>Wedding Kit</h1>
        <p className={account.description}>
          Ringkasan praktis untuk keluarga, PIC, dan vendor. Siap dibagikan atau dicetak.
        </p>
      </header>
      <div className={styles.sectionsGrid}>
        <section className={styles.panel}>
          <h2 className="text-lg font-semibold">Bagian dalam dokumen kalian</h2>
          <p className="text-sm text-secondary">
            Dokumen berisi rencana yang kalian simpan di browser ini.
          </p>
          <div className="grid gap-2">
            {sections.map(([key, label]) => (
              <div key={key} className={styles.sectionItem}>
                <span className="text-sm">{label}</span>
                <span className="font-mono text-xs text-secondary">
                  {trial?.snapshot?.resources[key]?.length ?? 0} data
                </span>
              </div>
            ))}
          </div>
          <p className="rounded-control bg-ux-dock p-4 text-xs leading-relaxed text-secondary">
            Sisa {5 - (trial?.snapshot?.used.pdf ?? 0)} dari 5 ekspor. Gunakan Cetak pada tab hasil
            lalu Simpan sebagai PDF. Melihat dokumen tidak mengurangi jatah.
          </p>
          <Button disabled={busy || !trial?.snapshot} onClick={() => void open()}>
            Buka dokumen cetak
          </Button>
          <Button
            variant="secondary"
            disabled={busy || !trial?.snapshot}
            onClick={() => void open(true)}
          >
            Cetak / simpan PDF
          </Button>
          {error && <p role="alert">{error}</p>}
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
            <p className="mt-6 text-sm leading-relaxed text-secondary">
              Daftar tamu, persiapan, dokumen, anggaran, dan koordinasi acara dari ruang percobaan
              kalian.
            </p>
            <p className="mt-auto text-xs leading-relaxed text-secondary">
              Buka dokumen cetak untuk melihat seluruh data terbaru. Melihat dokumen tidak
              mengurangi jatah ekspor.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
