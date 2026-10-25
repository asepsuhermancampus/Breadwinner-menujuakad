"use client";
import { useState } from "react";
import { Field } from "@/components/ui/field";
import { calculateCatering } from "@/features/catering/utils/calculator";
import type { PlanningViewProps } from "../domain/planning-view";
import original from "@/features/catering/components/catering.module.css";
import styles from "./planning.module.css";
export function PlanningCatering({ items, edit, remove }: PlanningViewProps) {
  const [input, setInput] = useState({
    invitations: 0,
    multiplier: 2,
    bufferPercent: 10,
    buffetPercent: 60,
    stallDishesCount: 4,
  });
  const result = calculateCatering(input);
  const menus = items.filter((item) => "portions" in item);
  const fields = [
    ["invitations", "Jumlah undangan"],
    ["multiplier", "Orang / undangan"],
    ["bufferPercent", "Buffer cadangan (%)"],
    ["buffetPercent", "Alokasi buffet (%)"],
    ["stallDishesCount", "Jumlah menu gubukan"],
  ] as const;
  return (
    <div className={styles.stack}>
      <div className={original.calculatorGrid}>
        <section className={original.card}>
          <h2 className="text-sm font-semibold">Dasar perhitungan</h2>
          {fields.map(([key, label]) => (
            <Field
              key={key}
              label={label}
              type="number"
              min={0}
              max={key.endsWith("Percent") ? 100 : 100000}
              value={input[key]}
              onChange={(e) =>
                setInput({
                  ...input,
                  [key]: Math.max(
                    0,
                    Math.min(key.endsWith("Percent") ? 100 : 100000, Number(e.target.value) || 0),
                  ),
                })
              }
            />
          ))}
          <div className={styles.notice}>
            <strong>Rumus yang dipakai</strong>
            <p className="font-mono mt-2">
              {input.invitations} × {input.multiplier} = {result.totalBaseGuests}
              <br />+ buffer {input.bufferPercent}% = {result.totalWithBuffer} tamu
            </p>
            <p className="mt-2">Estimasi ini bukan jaminan jumlah tamu yang datang.</p>
          </div>
        </section>
        <section className={original.card}>
          <h2 className="text-sm font-semibold">Estimasi tamu termasuk cadangan</h2>
          <p className="font-mono text-4xl font-semibold text-primary">
            {result.totalWithBuffer.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-secondary">+{result.bufferPax} pax buffer</p>
          <h3 className="text-sm font-semibold">Pembagian buffet & gubukan</h3>
          <dl className={styles.stats}>
            <div>
              <dt>Buffet utama</dt>
              <dd>{result.buffetPax}</dd>
            </div>
            <div>
              <dt>Total gubukan</dt>
              <dd>{result.stallPortionsTotal}</dd>
            </div>
            <div>
              <dt>Total sajian</dt>
              <dd>{result.totalPortions}</dd>
            </div>
          </dl>
          <p className={styles.notice}>
            Orang tidak sama dengan porsi. Satu tamu dapat menikmati beberapa sajian gubukan. Simpan
            kebutuhan menu melalui tombol Menu katering.
          </p>
        </section>
      </div>
      <section className={styles.card}>
        <div className={styles.row}>
          <h2 className="text-sm font-semibold">Menu katering tersimpan</h2>
          <span className="font-mono text-sm">
            Rp {menus.reduce((sum, i) => sum + i.portions * i.unitCost, 0).toLocaleString("id-ID")}
          </span>
        </div>
        {menus.map((item) => (
          <div key={item.id} className={styles.check}>
            <div className="flex-1">
              <strong>{item.title}</strong>
              <small>
                {item.portions} porsi × Rp {item.unitCost.toLocaleString("id-ID")}
              </small>
              {item.notes && <small>{item.notes}</small>}
            </div>
            <div className={styles.actions}>
              <button onClick={() => edit(item)}>Edit</button>
              <button data-delete onClick={() => remove(item)}>
                Hapus
              </button>
            </div>
          </div>
        ))}
        {!menus.length && <p className={styles.empty}>Belum ada menu tersimpan.</p>}
      </section>
    </div>
  );
}
