import Link from "next/link";
import styles from "@/features/account/components/account.module.css";
import { accountTabs, type AccountTab } from "../config/account-tabs";
export function GuestAccountPanel({ tab }: { tab: Exclude<AccountTab, "plans"> }) {
  const active = accountTabs.find((item) => item.id === tab)!;
  const copy = {
    profile: [
      "Profil pribadi",
      "Masuk untuk menyimpan profil dan mengundang pasangan ke ruang perencanaan bersama.",
    ],
    security: [
      "Keamanan akun",
      "Masuk untuk mengelola password dan menghubungkan akun Google kalian.",
    ],
    domain: [
      "Custom domain",
      "Masuk untuk mengelola alamat undangan kalian. Custom domain tersedia untuk pemilik ruang dengan paket Lifetime.",
    ],
    support: [
      "Prioritas bantuan",
      "Masuk untuk mengirim permintaan bantuan. Paket Lifetime mendapatkan antrean prioritas.",
    ],
  }[tab];
  return (
    <div className={styles.columns}>
      <section className={styles.panel}>
        <h2>{copy[0]}</h2>
        <p className={styles.description}>{copy[1]}</p>
        <p className={`${styles.finePrint} mt-4`}>
          Rencana percobaan tetap tersimpan di browser ini. Akun Free memberi akses tanpa batas
          trial.
        </p>
        <Link
          href={`/login?returnTo=${encodeURIComponent(active.href)}`}
          className="customer-control mt-6 inline-flex items-center justify-center rounded-control bg-primary font-semibold text-on-primary"
        >
          Masuk atau daftar
        </Link>
      </section>
      <aside className="rounded-card bg-ux-dock p-6">
        <h2 className="text-sm font-semibold text-brand-secondary">Ruang percobaan kalian</h2>
        <p className={`${styles.description} mt-3`}>
          Jelajahi perencanaan, undangan, dan Wedding Kit dari navigasi yang sama.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex min-h-11 items-center text-xs font-semibold text-brand-secondary"
        >
          Kembali merencanakan ↗
        </Link>
      </aside>
    </div>
  );
}
