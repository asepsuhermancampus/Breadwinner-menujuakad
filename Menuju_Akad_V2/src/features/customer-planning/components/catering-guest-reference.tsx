import Link from "next/link";
import styles from "./catering-form.module.css";
export function CateringGuestReference({ count, estimate }: { count: number; estimate: number }) {
  return (
    <div className={styles.estimate}>
      <p>
        Daftar tamu saat ini: <strong>{count.toLocaleString("id-ID")} orang</strong>.
      </p>
      <p>
        Estimasi perhitungan saat ini: <strong>{estimate.toLocaleString("id-ID")} porsi</strong>,
        termasuk cadangan.
      </p>
      {count === 0 && (
        <p>
          Belum ada daftar tamu.{" "}
          <Link href="/planner/guests" className="text-primary underline">
            Isi daftar tamu
          </Link>{" "}
          terlebih dahulu, atau langsung isi porsi sendiri.
        </p>
      )}
      <p>
        Pilih estimasi atau porsi manual untuk setiap menu. Jumlah yang disimpan mengikuti pesanan
        Anda.
      </p>
    </div>
  );
}
