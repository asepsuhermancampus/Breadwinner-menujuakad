"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import type { SeserahanItem } from "../types/seserahan";
import styles from "./seserahan.module.css";

type Props = {
  initialItems: SeserahanItem[];
};

export function SeserahanScreen({ initialItems }: Props) {
  const [items, setItems] = useState<SeserahanItem[]>(initialItems);
  const [filter, setFilter] = useState<"Semua" | "Sudah" | "Belum">("Semua");

  const totalEstimated = useMemo(
    () => items.reduce((sum, item) => sum + item.estimatedCost, 0),
    [items],
  );
  const totalActual = useMemo(
    () => items.filter((i) => i.isBought).reduce((sum, item) => sum + item.actualCost, 0),
    [items],
  );
  const boughtCount = useMemo(() => items.filter((i) => i.isBought).length, [items]);

  const displayedItems = useMemo(() => {
    if (filter === "Sudah") return items.filter((i) => i.isBought);
    if (filter === "Belum") return items.filter((i) => !i.isBought);
    return items;
  }, [items, filter]);

  const handleToggleBought = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextBought = !item.isBought;
        return {
          ...item,
          isBought: nextBought,
          actualCost: nextBought && item.actualCost === 0 ? item.estimatedCost : item.actualCost,
        };
      }),
    );
  };

  const formatIdr = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <main id="main-content" className={styles.container}>
      <header>
        <h1 className="font-sans text-3xl font-semibold text-brand-secondary tracking-[-0.9px]">
          Seserahan, satu per satu
        </h1>
        <p className="text-sm text-secondary">
          Beri makna pada setiap hantaran. Pantau barang, PIC, dan pengeluarannya.
        </p>
      </header>

      <section className={styles.summaryGrid} aria-label="Ringkasan seserahan">
        <article className={styles.summaryCard}>
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            ESTIMASI KESELURUHAN
          </span>
          <span className="font-mono text-xl font-bold text-foreground">
            {formatIdr(totalEstimated)}
          </span>
          <span className="text-xs text-secondary">Alokasi anggaran seserahan</span>
        </article>

        <article className={styles.summaryCard}>
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            SUDAH DIBELI
          </span>
          <span className="font-mono text-xl font-bold text-brand-secondary">
            {boughtCount}/{items.length} barang
          </span>
          <span className="text-xs text-secondary">Progres belanja hantaran</span>
        </article>

        <article className={styles.summaryCard}>
          <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            REALISASI SEMENTARA
          </span>
          <span className="font-mono text-xl font-bold text-emerald-700">
            {formatIdr(totalActual)}
          </span>
          <span className="text-xs text-secondary">Total terbayar saat ini</span>
        </article>
      </section>

      <div
        className="flex gap-1.5 rounded-control bg-ux-dock border border-ux-border p-1 w-fit"
        role="tablist"
      >
        <button
          role="tab"
          aria-selected={filter === "Semua"}
          className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Semua"
              ? "bg-surface text-brand-secondary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Semua")}
        >
          Semua {items.length}
        </button>
        <button
          role="tab"
          aria-selected={filter === "Sudah"}
          className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Sudah"
              ? "bg-surface text-brand-secondary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Sudah")}
        >
          Sudah dibeli {boughtCount}
        </button>
        <button
          role="tab"
          aria-selected={filter === "Belum"}
          className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Belum"
              ? "bg-surface text-brand-secondary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Belum")}
        >
          Belum selesai {items.length - boughtCount}
        </button>
      </div>

      <section className={styles.itemsGrid} aria-label="Kotak seserahan">
        {displayedItems.map((item) => (
          <article key={item.id} className={styles.itemCard}>
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt={item.name}
                width={400}
                height={200}
                className={styles.itemImage}
              />
            ) : (
              <div className={styles.itemImage} />
            )}
            <div className={styles.itemContent}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider">
                    {item.category} · PIC {item.pic}
                  </span>
                  <h3 className="text-base font-semibold text-foreground mt-0.5">{item.name}</h3>
                </div>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={item.isBought}
                    onChange={() => handleToggleBought(item.id)}
                    className="size-4 cursor-pointer rounded border-border text-brand-secondary focus:ring-primary"
                  />
                  <span
                    className={item.isBought ? "font-medium text-emerald-700" : "text-secondary"}
                  >
                    {item.isBought ? "Dibeli" : "Belum"}
                  </span>
                </label>
              </div>

              {item.notes && <p className="text-xs text-secondary leading-relaxed">{item.notes}</p>}

              <div className="mt-auto pt-3 border-t border-border flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted block text-[10px]">Estimasi</span>
                  <span className="font-mono font-medium text-foreground">
                    {formatIdr(item.estimatedCost)}
                  </span>
                </div>
                {item.isBought && (
                  <div className="text-right">
                    <span className="text-emerald-700 block text-[10px]">Realisasi</span>
                    <span className="font-mono font-bold text-emerald-800">
                      {formatIdr(item.actualCost)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
