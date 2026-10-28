"use client";
import { Field } from "@/components/ui/field";
import type { CateringMenu } from "../domain/catering-menu";
import { cateringCategories } from "../domain/catering-catalog";
import styles from "./catering-form.module.css";
export function CateringMenuFields({
  value,
  change,
}: {
  value: CateringMenu;
  change: (value: CateringMenu) => void;
}) {
  const patch = (next: Partial<CateringMenu>) => change({ ...value, ...next });
  const packaged = value.mode === "package";
  return (
    <div className={styles.stack}>
      <Field
        label={packaged ? "Nama paket" : "Nama menu"}
        required
        maxLength={160}
        value={value.title}
        onChange={(event) => patch({ title: event.target.value })}
      />
      <Field
        label="Nama vendor (opsional)"
        maxLength={160}
        value={value.vendor ?? ""}
        onChange={(event) => patch({ vendor: event.target.value })}
      />
      {packaged ? (
        <label className={styles.label}>
          Perhitungan harga
          <select
            className={styles.control}
            value={value.pricing ?? "total"}
            onChange={(event) => patch({ pricing: event.target.value as "total" | "per-person" })}
          >
            <option value="total">Total harga paket</option>
            <option value="per-person">Harga per tamu</option>
          </select>
        </label>
      ) : (
        <label className={styles.label}>
          Kategori
          <select
            className={styles.control}
            value={value.category ?? "other"}
            onChange={(event) =>
              patch({ category: event.target.value as CateringMenu["category"] })
            }
          >
            {cateringCategories.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className={styles.columns}>
        <Field
          label={packaged ? "Jumlah tamu paket" : "Porsi"}
          type="number"
          required
          min={1}
          max={100000}
          step={1}
          value={value.portions || ""}
          onChange={(event) => patch({ portions: Number(event.target.value) })}
        />
        <Field
          label={
            packaged
              ? value.pricing === "per-person"
                ? "Harga per tamu (Rp)"
                : "Total harga paket (Rp)"
              : "Biaya per porsi (Rp)"
          }
          inputMode="numeric"
          required
          value={value.unitCost ? value.unitCost.toLocaleString("id-ID") : ""}
          onChange={(event) => patch({ unitCost: Number(event.target.value.replace(/\D/g, "")) })}
          placeholder="0"
        />
      </div>
      {packaged && (
        <label className={styles.label}>
          Daftar menu dalam paket
          <textarea
            className={styles.control}
            rows={3}
            maxLength={2000}
            value={value.includedMenus ?? ""}
            placeholder="Contoh: nasi putih, ayam kecap, bakso, es krim, air mineral"
            onChange={(event) => patch({ includedMenus: event.target.value })}
          />
        </label>
      )}
      <label className={styles.label}>
        Catatan (opsional)
        <textarea
          className={styles.control}
          rows={2}
          maxLength={2000}
          value={value.notes ?? ""}
          onChange={(event) => patch({ notes: event.target.value })}
        />
      </label>
    </div>
  );
}
