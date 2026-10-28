"use client";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useState, useMemo } from "react";
import { useCommittedList } from "@/hooks/use-committed-list";
import Image from "next/image";
import { CardOrnament } from "@/components/ui/card-ornament";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { Icon } from "@/components/ui/icon";
import type { MoodboardItem, AgreedColor } from "../types/moodboard";
import { SaveInspirationDialog } from "./save-inspiration-dialog";
import styles from "./moodboard.module.css";

type Props = {
  initialItems: MoodboardItem[];
  palette: AgreedColor[];
  onChange?: (items: MoodboardItem[]) => void | Promise<boolean | void>;
};

export function MoodboardScreen({ initialItems, palette, onChange }: Props) {
  const [items, setItems] = useCommittedList(initialItems, onChange);
  const [filter, setFilter] = useUrlTab<string>(
    "tab",
    ["Semua", "Dekorasi", "Busana", "Detail"],
    "Semua",
  );
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState<MoodboardItem | null>(null);

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
    <section className={styles.container}>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <PageHeading
          title="Bayangkan hari kalian"
          description="Kumpulkan referensi, selaraskan selera, lalu bagikan arahnya ke vendor."
        />
        <Button
          onClick={() => {
            setEditing(null);
            setShowAddModal(true);
          }}
        >
          <Icon name="plus" size={16} />
          Tambah inspirasi
        </Button>
      </header>

      <section className={styles.paletteCard} aria-labelledby="palette-title">
        <CardOrnament variant={3} />
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
        <div
          className="flex gap-1.5 rounded-control bg-ux-dock border border-ux-border p-1"
          role="tablist"
        >
          {["Semua", "Dekorasi", "Busana", "Detail"].map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={filter === cat}
              className={`customer-control rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
                filter === cat
                  ? "bg-surface text-brand-secondary shadow-sm font-semibold"
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
            className="customer-control w-full rounded-control border border-ux-border bg-surface px-3 py-1.5 text-xs text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
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
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => {
                    setEditing(item);
                    setShowAddModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => void setItems((prev) => prev.filter((i) => i.id !== item.id))}
                >
                  Hapus
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <SaveInspirationDialog
        key={editing?.id ?? "new"}
        item={editing}
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={(item) => {
          if (
            editing &&
            JSON.stringify(items.find((i) => i.id === editing.id)) !== JSON.stringify(editing)
          )
            return Promise.resolve(false);
          return setItems((prev) =>
            editing ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev],
          );
        }}
      />
    </section>
  );
}
