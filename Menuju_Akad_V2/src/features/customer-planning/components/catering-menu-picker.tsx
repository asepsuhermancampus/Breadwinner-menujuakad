"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cateringCategories } from "../domain/catering-catalog";
import type { CateringMenu } from "../domain/catering-menu";
import styles from "./catering-form.module.css";
export function CateringMenuPicker({
  selected,
  add,
}: {
  selected: CateringMenu[];
  add: (title: string, category: CateringMenu["category"]) => void;
}) {
  const [category, setCategory] = useState<string>("buffet");
  const active = cateringCategories.find((entry) => entry.id === category)!;
  return (
    <section className={styles.picker} aria-label="Pilihan menu umum">
      <label className={styles.label}>
        Kategori menu
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className={styles.control}
        >
          {cateringCategories.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label}
            </option>
          ))}
        </select>
      </label>
      <p className={styles.hint}>
        Klik menu untuk menambahkannya ke daftar isian. Porsi dan harga bisa disesuaikan.
      </p>
      <div className={styles.suggestions}>
        {active.menus.map((title) => {
          const chosen = selected.some(
            (item) => item.title === title && item.category === active.id,
          );
          return (
            <Button
              key={title}
              size="small"
              variant={chosen ? "primary" : "secondary"}
              disabled={chosen}
              onClick={() => add(title, active.id)}
            >
              {chosen ? "✓ " : "+ "}
              {title}
            </Button>
          );
        })}
      </div>
      <Button variant="ghost" size="small" onClick={() => add("", active.id)}>
        + Menu lainnya
      </Button>
    </section>
  );
}
