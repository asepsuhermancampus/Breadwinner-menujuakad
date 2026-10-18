"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { MoodboardItem, AgreedColor } from "../types/moodboard";
import { SaveInspirationDialog } from "./save-inspiration-dialog";
import styles from "./moodboard.module.css";

type Props = {
  initialItems: MoodboardItem[];
  palette: AgreedColor[];
};

export function MoodboardScreen({ initialItems, palette }: Props) {
  const [items, setItems] = useState<MoodboardItem[]>(initialItems);
  const [filter, setFilter] = useState<string>("Semua");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const displayedItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = filter === "Semua" || item.category === filter;
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, filter, search]);

  return (
    <main id="main-content" className={styles.container}>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Bayangkan hari kalian</h1>
          <p className="text-sm text-secondary">
            Kumpulkan referensi, selaraskan selera, lalu bagikan arahnya ke vendor.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Icon name="plus" size={16} />
          Tambah inspirasi
        </Button>
      </header>

      <section className={styles.paletteCard} aria-labelledby="palette-title">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="palette-title" className="text-sm font-semibold text-foreground">
              Palet yang disepakati
            </h2>
            <p className="text-xs text-secondary">Arah warna dasar dekorasi dan busana</p>
          </div>
          <span className="rounded bg-subtle px-2 py-0.5 text-[10px] font-mono text-secondary">
            v2 quiet luxury
          </span>
        </div>
        <div className={styles.swatchRow}>
          {palette.map((color) => (
            <div
              key={color.hex}
              className={styles.swatch}
              style={{
                backgroundColor: color.hex,
                color: color.hex === "#FBFBF9" ? "#141413" : "#FFFFFF",
              }}
            >
              <span>
                {color.name} ({color.hex})
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2 rounded-control bg-subtle p-1" role="tablist">
          {["Semua", "Dekorasi", "Busana", "Detail"].map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              className={`rounded-control px-3 py-1.5 text-xs font-medium transition ${
                filter === cat
                  ? "bg-surface text-primary shadow-sm"
                  : "text-secondary hover:text-foreground"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-64">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari inspirasi..."
            className="w-full rounded-control border border-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <section className={styles.cardsGrid} aria-label="Koleksi moodboard">
        {displayedItems.map((item) => (
          <article key={item.id} className={styles.card}>
            {item.imageSrc ? (
              <Image
                src={item.imageSrc}
                alt={item.title}
                width={300}
                height={200}
                className={styles.cardImage}
              />
            ) : (
              <div className={styles.cardImage} />
            )}
            <div className="p-3.5 space-y-1">
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider block">
                {item.subtitle}
              </span>
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              {item.notes && <p className="text-xs text-secondary line-clamp-2">{item.notes}</p>}
            </div>
          </article>
        ))}
      </section>

      <SaveInspirationDialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(item) => setItems((prev) => [item, ...prev])}
      />
    </main>
  );
}
