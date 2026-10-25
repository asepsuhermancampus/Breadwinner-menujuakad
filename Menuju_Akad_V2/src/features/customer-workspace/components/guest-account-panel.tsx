import Link from "next/link";
import styles from "@/features/account/components/account.module.css";
export function GuestAccountPanel({ tab }: { tab: "profile" | "security" }) {
  return (
    <div className={styles.columns}>
      <section className={styles.panel}>
        <h2>{tab === "profile" ? "Profil pribadi" : "Keamanan akun"}</h2>
        <p className={styles.description}>
          {tab === "profile"
            ? "Masuk untuk menyimpan profil dan mengundang pasangan ke ruang perencanaan bersama."
            : "Masuk untuk mengelola password dan menghubungkan akun Google kalian."}
        </p>
        <p className={`${styles.finePrint} mt-4`}>
          Rencana percobaan tetap tersimpan di browser ini. Akun Free memberi akses tanpa batas
          trial.
        </p>
        <Link
          href={`/login?returnTo=${encodeURIComponent(tab === "profile" ? "/account" : "/account/security")}`}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-control bg-primary px-5 text-sm font-semibold text-white"
        >
          Masuk atau daftar
        </Link>
      </section>
      <aside className="rounded-card bg-ux-dock p-6">
        <h2 className="text-sm font-semibold text-primary">Ruang percobaan kalian</h2>
        <p className={`${styles.description} mt-3`}>
          Jelajahi perencanaan, undangan, dan Wedding Kit dari navigasi yang sama.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-flex min-h-11 items-center text-xs font-semibold text-primary"
        >
          Kembali merencanakan ↗
        </Link>
      </aside>
    </div>
  );
}
