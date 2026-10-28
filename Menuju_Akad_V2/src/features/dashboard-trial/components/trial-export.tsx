"use client";
import { useState } from "react";
import { useTrial } from "./trial-provider";
import { trialReport } from "../domain/trial-export";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { CardOrnament } from "@/components/ui/card-ornament";
import { WeddingKitPreview } from "@/features/wedding-kit/components/wedding-kit-preview";
import styles from "@/features/wedding-kit/components/wedding-kit.module.css";
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
export function TrialExport({ showHeading = true }: { showHeading?: boolean }) {
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
  if (!trial?.snapshot && !trial?.error) {
    return <PageSkeleton variant="cards" label="Memuat Wedding Kit" />;
  }
  return (
    <section id="feature-pdf" className="space-y-6">
      {showHeading && (
        <PageHeading
          title="Wedding Kit"
          description="Ringkasan praktis untuk keluarga, PIC, dan vendor. Siap dibagikan atau dicetak."
        />
      )}
      {trial?.error && <p role="alert">{trial.error}</p>}
      {trial?.snapshot && (
        <div className={styles.sectionsGrid}>
          <section className={styles.panel}>
            <CardOrnament variant={2} />
            <h2 className="text-lg font-semibold">Bagian dalam dokumen kalian</h2>
            <p className="text-sm text-secondary">
              Dokumen berisi rencana yang kalian simpan di browser ini.
            </p>
            <div className="grid gap-2">
              {sections.map(([key, label]) => (
                <div key={key} className={styles.sectionItem}>
                  <span className="text-sm">{label}</span>
                  <span className="font-mono text-xs text-secondary">
                    {trial?.snapshot?.resources[key]?.filter(
                      (row) => key !== "documents" || !(row as { archived?: boolean }).archived,
                    ).length ?? 0}{" "}
                    data
                  </span>
                </div>
              ))}
            </div>
            <p className="rounded-control bg-ux-dock p-4 text-xs leading-relaxed text-secondary">
              Sisa {5 - (trial?.snapshot?.used.pdf ?? 0)} dari 5 ekspor. Gunakan Cetak pada tab
              hasil lalu Simpan sebagai PDF. Melihat dokumen tidak mengurangi jatah.
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
          <WeddingKitPreview
            sections={sections.map(([, label]) => label)}
            description="Daftar tamu, persiapan, dokumen, anggaran, dan koordinasi acara dari ruang percobaan kalian."
            footer="Buka dokumen cetak untuk melihat seluruh data terbaru. Melihat dokumen tidak mengurangi jatah ekspor."
          />
        </div>
      )}
    </section>
  );
}
