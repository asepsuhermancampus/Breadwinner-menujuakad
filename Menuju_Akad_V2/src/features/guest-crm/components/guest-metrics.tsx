import type { GuestInvitation } from "../types/guest";
import { calculateGuestMetrics } from "../utils/guest-filter";
import { SummaryCard } from "@/components/ui/summary-card";
import styles from "./guest-crm.module.css";

export function GuestMetrics({ guests }: { guests: GuestInvitation[] }) {
  const m = calculateGuestMetrics(guests);

  return (
    <div className="space-y-3">
      <div className={styles.statsGrid}>
        <SummaryCard
          label="Undangan"
          value={m.totalInvitations}
          detail={`Maks. ${m.totalQuota} orang`}
          highlight
        />
        <SummaryCard
          label="Konfirmasi hadir"
          value={m.attendingInvitations}
          detail={`${m.attendingPeople} orang dikonfirmasi hadir`}
          ornament={2}
        />
        <SummaryCard
          label="Berhalangan hadir"
          value={m.declinedInvitations}
          detail="Undangan yang tidak hadir"
          ornament={3}
        />
        <SummaryCard
          label="Belum menjawab"
          value={m.pendingInvitations}
          detail="Undangan menunggu konfirmasi"
          ornament={4}
        />
      </div>
      <p className="text-xs text-secondary bg-subtle px-3 py-2 rounded-control border border-border">
        <strong>Pemberitahuan:</strong> Kuota = maksimal orang yang diundang. Hadir = jumlah orang
        yang dikonfirmasi hadir, bukan jumlah lembar undangan.
      </p>
    </div>
  );
}
