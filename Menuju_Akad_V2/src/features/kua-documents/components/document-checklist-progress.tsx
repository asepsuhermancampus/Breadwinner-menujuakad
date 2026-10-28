import { SummaryCard } from "@/components/ui/summary-card";
import styles from "./document-checklist.module.css";
export function DocumentChecklistProgress({
  complete,
  total,
}: {
  complete: number;
  total: number;
}) {
  const percent = total ? Math.round((complete / total) * 100) : 0;
  return (
    <section aria-label="Progres kelengkapan berkas" className={styles.progress}>
      <SummaryCard
        label="Progres kelengkapan berkas"
        value={`${percent}%`}
        detail={`${complete} dari ${total} berkas dicentang`}
        ornament={2}
        highlight
      />
      <progress value={complete} max={total || 1} aria-label="Berkas yang sudah dicentang" />
      <p>Checklist ini adalah catatan mandiri, bukan verifikasi kelengkapan oleh KUA.</p>
    </section>
  );
}
