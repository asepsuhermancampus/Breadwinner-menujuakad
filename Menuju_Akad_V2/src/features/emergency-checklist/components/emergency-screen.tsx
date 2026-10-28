"use client";
import { SummaryCard } from "@/components/ui/summary-card";
import { useState } from "react";
import type { EmergencyBag } from "../types/emergency";
import styles from "./emergency.module.css";

type Props = {
  initialBags: EmergencyBag[];
};

export function EmergencyScreen({ initialBags }: Props) {
  const [bags, setBags] = useState<EmergencyBag[]>(initialBags);

  const totalItems = bags.reduce((acc, b) => acc + b.items.length, 0);
  const totalReady = bags.reduce((acc, b) => acc + b.items.filter((i) => i.ready).length, 0);
  const pendingCount = totalItems - totalReady;

  const handleToggleItem = (bagId: string, itemId: string) => {
    setBags((prev) =>
      prev.map((b) => {
        if (b.id !== bagId) return b;
        return {
          ...b,
          items: b.items.map((i) => (i.id === itemId ? { ...i, ready: !i.ready } : i)),
        };
      }),
    );
  };

  return (
    <main id="main-content" className={styles.container}>
      <header>
        <h1 className="font-sans text-3xl font-semibold text-brand-secondary tracking-[-0.9px]">
          Perlengkapan darurat Hari-H
        </h1>
        <p className="text-sm text-secondary">
          Siapkan dari sekarang, supaya hari bahagia terasa lebih tenang.
        </p>
      </header>

      <SummaryCard
        label="Barang sudah siap dibawa"
        value={`${totalReady}/${totalItems}`}
        detail={`${pendingCount} belum siap ? Sesuaikan isi tas, PIC, dan tempat penyimpanannya.`}
        ornament={4}
        highlight
      />

      <section className={styles.bagsGrid} aria-label="Daftar tas perlengkapan">
        {bags.map((bag) => {
          const bagReady = bag.items.filter((i) => i.ready).length;
          const bagTotal = bag.items.length;
          return (
            <article key={bag.id} className={styles.bagCard}>
              <div className={styles.bagHeader}>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{bag.name}</h3>
                  <p className="text-xs text-secondary">{bag.pic}</p>
                </div>
                <span className="font-mono text-xs font-medium text-brand-secondary">
                  {bagReady}/{bagTotal} siap
                </span>
              </div>

              <div className={styles.itemList}>
                {bag.items.map((item) => (
                  <label key={item.id} className={styles.itemRow}>
                    <input
                      type="checkbox"
                      checked={item.ready}
                      onChange={() => handleToggleItem(bag.id, item.id)}
                      className="size-4 cursor-pointer rounded border-border text-brand-secondary focus:ring-primary"
                    />
                    <span
                      className={item.ready ? "line-through text-secondary" : "text-foreground"}
                    >
                      {item.name}
                    </span>
                  </label>
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
