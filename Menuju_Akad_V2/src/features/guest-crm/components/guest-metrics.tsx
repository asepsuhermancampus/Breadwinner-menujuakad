import type { GuestInvitation } from "../types/guest";
import { calculateGuestMetrics } from "../utils/guest-filter";
import styles from "./guest-crm.module.css";

export function GuestMetrics({ guests }: { guests: GuestInvitation[] }) {
  const m = calculateGuestMetrics(guests);

  return (
    <div className="space-y-3">
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{m.totalInvitations}</div>
          <div className={styles.statLabel}>Undangan (Maks. {m.totalQuota} orang)</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {m.attendingInvitations}{" "}
            <span className="text-sm font-normal text-secondary">/ {m.attendingPeople} orang</span>
          </div>
          <div className={styles.statLabel}>Konfirmasi Hadir</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{m.declinedInvitations}</div>
          <div className={styles.statLabel}>Berhalangan Hadir</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{m.pendingInvitations}</div>
          <div className={styles.statLabel}>Belum Menjawab</div>
        </div>
      </div>
      <p className="text-xs text-secondary bg-subtle px-3 py-2 rounded-control border border-border">
        <strong>Pemberitahuan:</strong> Kuota = maksimal orang yang diundang. Hadir = jumlah orang
        yang dikonfirmasi hadir, bukan jumlah lembar undangan.
      </p>
    </div>
  );
}
