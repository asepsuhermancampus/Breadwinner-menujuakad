"use client";
import { SummaryCard } from "@/components/ui/summary-card";
import { Field } from "@/components/ui/field";
import type { PlanningViewProps } from "../domain/planning-view";
import type { CateringEstimate } from "./use-catering-estimate";
import { CateringSavedMenus } from "./catering-saved-menus";
import catering from "./planning-catering.module.css";
import styles from "./planning.module.css";
export function PlanningCatering({
  items,
  edit,
  remove,
  estimate,
  guestError,
  guestsLoading,
}: PlanningViewProps & {
  estimate: CateringEstimate;
  guestError: string;
  guestsLoading: boolean;
}) {
  const { input, manual, setInput, result, automatic, setUseGuests, summary } = estimate;
  const fields = [
    ["invitations", "Jumlah undangan"],
    ["multiplier", "Orang / undangan"],
    ["bufferPercent", "Buffer cadangan (%)"],
    ["buffetPercent", "Alokasi buffet (%)"],
    ["stallDishesCount", "Jumlah menu gubukan"],
  ] as const;
  return (
    <div className={styles.stack}>
      <div className={catering.summaries}>
        <SummaryCard
          label="Estimasi tamu"
          value={result.totalWithBuffer.toLocaleString("id-ID")}
          detail={`Termasuk ${result.bufferPax.toLocaleString("id-ID")} tamu cadangan`}
          ornament={1}
          highlight
        />
        <SummaryCard
          label="Buffet utama"
          value={result.buffetPax.toLocaleString("id-ID")}
          detail={`${input.buffetPercent}% dari estimasi tamu`}
          ornament={2}
        />
        <SummaryCard
          label="Porsi gubukan"
          value={result.stallPortionsTotal.toLocaleString("id-ID")}
          detail={`${input.stallDishesCount} variasi sajian`}
          ornament={3}
        />
        <SummaryCard
          label="Total sajian"
          value={result.totalPortions.toLocaleString("id-ID")}
          detail="Porsi buffet dan gubukan"
          ornament={4}
          highlight
        />
      </div>
      <div className={catering.content}>
        <section
          className={`${styles.card} ${styles.stack}`}
          aria-label="Dasar perhitungan katering"
        >
          <h2 className="text-sm font-semibold">Dasar perhitungan</h2>
          {summary.guests > 0 ? (
            <div className={styles.notice}>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={automatic}
                  onChange={(event) => setUseGuests(event.target.checked)}
                />
                Gunakan daftar tamu otomatis
              </label>
              <p className="mt-2">
                {summary.invitations.toLocaleString("id-ID")} undangan ·{" "}
                {summary.guests.toLocaleString("id-ID")} orang berdasarkan kuota di CRM Tamu.
              </p>
            </div>
          ) : (
            <p className={styles.notice}>
              {guestsLoading
                ? "Memuat daftar tamu. Jumlah tetap bisa diisi manual."
                : guestError
                  ? "Daftar tamu belum dapat dimuat. Isi jumlah undangan secara manual untuk melanjutkan."
                  : "Belum ada daftar tamu. Isi jumlah undangan di bawah atau tambahkan tamu melalui CRM Tamu."}
            </p>
          )}
          <div className={catering.fields}>
            {fields
              .filter(([key]) => !automatic || (key !== "invitations" && key !== "multiplier"))
              .map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  type="number"
                  min={0}
                  max={key.endsWith("Percent") ? 100 : 100000}
                  value={manual[key]}
                  onChange={(event) =>
                    setInput({
                      ...manual,
                      [key]: Math.max(
                        0,
                        Math.min(
                          key.endsWith("Percent") ? 100 : 100000,
                          Number(event.target.value) || 0,
                        ),
                      ),
                    })
                  }
                />
              ))}
          </div>
          <div className={styles.notice}>
            <strong>Rumus yang dipakai</strong>
            <p className="font-mono mt-2">
              {automatic
                ? `${summary.guests.toLocaleString("id-ID")} orang dari daftar tamu`
                : `${input.invitations} × ${input.multiplier} = ${result.totalBaseGuests}`}
              <br />+ cadangan {input.bufferPercent}% ={" "}
              {result.totalWithBuffer.toLocaleString("id-ID")} tamu
            </p>
            <p className="mt-2">Estimasi ini bukan jaminan jumlah tamu yang datang.</p>
          </div>
        </section>
        <CateringSavedMenus items={items} edit={edit} remove={remove} />
      </div>
    </div>
  );
}
