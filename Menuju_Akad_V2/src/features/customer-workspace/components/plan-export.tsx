"use client";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PageHeading } from "@/components/ui/page-heading";
import { CardOrnament } from "@/components/ui/card-ornament";
import { WeddingKitPreview } from "@/features/wedding-kit/components/wedding-kit-preview";
import styles from "@/features/wedding-kit/components/wedding-kit.module.css";
import { useFeatureAvailability } from "./feature-availability-context";
const sections = ["Daftar tamu", "Tugas & persiapan", "Ringkasan dokumen", "Anggaran acara"];
export function PlanExport({
  showHeading = true,
  tasksAvailable = true,
  documentsAvailable = true,
  guestsAvailable = true,
  financeAvailable = true,
}: {
  showHeading?: boolean;
  tasksAvailable?: boolean;
  documentsAvailable?: boolean;
  guestsAvailable?: boolean;
  financeAvailable?: boolean;
}) {
  const latest = useFeatureAvailability();
  const effectiveTasks = latest?.tasks ?? tasksAvailable;
  const effectiveDocuments = latest?.documents ?? documentsAvailable;
  const effectiveGuests = latest?.guests ?? guestsAvailable;
  const effectiveFinance = latest?.finance ?? financeAvailable;
  const visibleSections = sections.filter(
    (label) =>
      (effectiveTasks || label !== "Tugas & persiapan") &&
      (effectiveGuests || label !== "Daftar tamu") &&
      (effectiveFinance || label !== "Anggaran acara") &&
      (effectiveDocuments || label !== "Ringkasan dokumen"),
  );
  return (
    <section id="feature-pdf" tabIndex={-1} className="space-y-6">
      {showHeading && (
        <PageHeading
          title="Ringkasan untuk dibagikan"
          description="Ringkasan praktis untuk keluarga, PIC, dan vendor. Siap dibagikan atau dicetak."
        />
      )}
      <div className={styles.sectionsGrid}>
        <section className={styles.panel}>
          <CardOrnament variant={2} />
          <h2 className="text-lg font-semibold">Bagian dalam dokumen kalian</h2>
          <div className="grid gap-3">
            {visibleSections.map((label) => (
              <div key={label} className={styles.sectionItem}>
                <span className="text-sm">{label}</span>
                <Icon name="check" size={18} />
              </div>
            ))}
          </div>
          <p className="rounded-control bg-ux-dock p-4 text-xs leading-relaxed text-secondary">
            Dokumen dibuat dari data terbaru di akun kalian. Periksa data dan kontak sebelum
            membagikannya.
          </p>
          <Link
            href="/api/workspace/export"
            target="_blank"
            className="customer-control inline-flex items-center justify-center gap-2 rounded-control bg-primary font-semibold text-on-primary"
          >
            <Icon name="download" size={18} /> Buka dokumen cetak
          </Link>
          <p className="text-sm text-secondary">
            Pada tab dokumen, gunakan Cetak (Ctrl+P) lalu pilih Simpan sebagai PDF.
          </p>
        </section>
        <WeddingKitPreview
          sections={visibleSections}
          footer="Buka dokumen cetak untuk melihat seluruh data terbaru."
        />
      </div>
    </section>
  );
}
