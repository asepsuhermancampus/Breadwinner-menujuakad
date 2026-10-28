"use client";
import Link from "next/link";
import { Field } from "@/components/ui/field";
import type { CateringEstimate } from "./use-catering-estimate";
import styles from "./catering-basis.module.css";
import layout from "./catering-basis-layout.module.css";
import { integerValue } from "@/lib/integer-input";
const number = (value: number) => value.toLocaleString("id-ID");
export function CateringBasis({
  estimate,
  guestError,
  guestsLoading,
}: {
  estimate: CateringEstimate;
  guestError: string;
  guestsLoading: boolean;
}) {
  const { input, manual, setInput, result, automatic, setUseGuests, summary } = estimate;
  function field(key: keyof typeof manual, label: string, hint: string) {
    return (
      <Field
        key={key}
        label={label}
        hint={hint}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="0"
        value={manual[key] || ""}
        onChange={(event) =>
          setInput({
            ...manual,
            [key]: integerValue(event.target.value, key.endsWith("Percent") ? 100 : 100000),
          })
        }
      />
    );
  }
  return (
    <section className={`${styles.panel} ${layout.wide}`} aria-label="Dasar perhitungan katering">
      <header className={styles.heading}>
        <h2>Dasar perhitungan</h2>
        <p>Mulai dari jumlah tamu, lalu sesuaikan kebutuhan sajian.</p>
      </header>
      <div className={styles.step} data-catering-step>
        <h3>
          <span>01</span> Jumlah tamu
        </h3>
        {summary.guests > 0 ? (
          <label className={styles.source}>
            <input
              type="checkbox"
              checked={automatic}
              onChange={(event) => setUseGuests(event.target.checked)}
            />
            <span>
              Gunakan daftar tamu otomatis
              <small>
                {number(summary.invitations)} undangan dengan kuota {number(summary.guests)} orang.
              </small>
            </span>
          </label>
        ) : (
          <p className={styles.explanation}>
            {guestsLoading
              ? "Memuat daftar tamu. Anda tetap bisa mengisi jumlahnya sendiri."
              : guestError
                ? "Daftar tamu belum dapat dimuat. Isi jumlah undangan untuk melanjutkan."
                : "Belum ada daftar tamu. Isi jumlah undangan dan perkiraan orang per undangan."}
          </p>
        )}
        {automatic ? (
          <div className={styles.guestCount}>
            <span>Tamu dari daftar undangan</span>
            <strong>
              {number(summary.guests)} <small>orang</small>
            </strong>
          </div>
        ) : (
          <div className={styles.fields} data-catering-fields>
            {field("invitations", "Jumlah undangan", "Jumlah undangan yang akan dibagikan.")}
            {field("multiplier", "Orang per undangan", "Contoh: 2 orang untuk setiap undangan.")}
          </div>
        )}
        <Link href="/planner/guests" className={styles.guestLink}>
          Kelola daftar tamu →
        </Link>
      </div>
      <div className={styles.step} data-catering-step>
        <h3>
          <span>02</span> Cadangan tamu
        </h3>
        {field(
          "bufferPercent",
          "Tambahan cadangan (%)",
          `Tambahan ${number(result.bufferPax)} orang dari ${number(result.totalBaseGuests)} perkiraan tamu.`,
        )}
      </div>
      <div className={styles.step} data-catering-step>
        <h3>
          <span>03</span> Pembagian sajian
        </h3>
        <div className={styles.fields} data-catering-fields>
          {field(
            "buffetPercent",
            "Alokasi prasmanan (%)",
            `Prasmanan adalah hidangan utama yang diambil sendiri. Estimasi: ${number(result.buffetPax)} porsi.`,
          )}
          {field(
            "stallDishesCount",
            "Jumlah menu gubukan",
            `Sajian terpisah seperti bakso atau sate. Estimasi tiap menu: ${number(result.stallPax)} porsi.`,
          )}
        </div>
        <p className={styles.explanation}>
          Gubukan dihitung dari sisa {100 - input.buffetPercent}% estimasi tamu, dikalikan jumlah
          jenis menunya.
        </p>
      </div>
      <footer className={styles.result}>
        <div>
          <span>Perkiraan tamu</span>
          <strong>{number(result.totalBaseGuests)} orang</strong>
        </div>
        <div>
          <span>Tambahan cadangan · {input.bufferPercent}%</span>
          <strong>+ {number(result.bufferPax)} orang</strong>
        </div>
        <div className={styles.resultTotal}>
          <span>Total untuk perhitungan</span>
          <strong>{number(result.totalWithBuffer)} orang</strong>
        </div>
        <p>Angka ini adalah perkiraan. Sesuaikan pesanan akhir dengan vendor katering.</p>
      </footer>
    </section>
  );
}
