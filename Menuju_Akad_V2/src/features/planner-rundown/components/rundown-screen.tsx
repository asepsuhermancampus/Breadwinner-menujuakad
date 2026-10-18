"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { RundownItem } from "../types/rundown";
import { RundownGeneratorDialog } from "./rundown-generator-dialog";
import styles from "./rundown.module.css";

type Props = {
  initialItems: RundownItem[];
};

export function RundownScreen({ initialItems }: Props) {
  const [items, setItems] = useState<RundownItem[]>(initialItems);
  const [showGenerator, setShowGenerator] = useState(false);

  return (
    <main id="main-content" className={styles.container}>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans text-3xl font-semibold text-primary tracking-[-0.9px]">
              Rundown acara
            </h1>
            <span className="rounded-full bg-ux-dock border border-ux-border px-2.5 py-0.5 text-xs text-secondary font-mono">
              14 Feb 2027 · WIB
            </span>
          </div>
          <p className="mt-1 text-sm text-secondary">
            Jadwal yang jelas untuk keluarga, panitia, dan seluruh vendor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setShowGenerator(true)}>
            <Icon name="refresh" size={15} />
            Pengaturan generator
          </Button>
        </div>
      </header>

      <div className="flex items-center justify-between rounded-card border border-ux-border bg-surface px-4 py-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          <strong className="text-foreground">Draf v4 · jadwal selaras</strong>
        </div>
        <span className="text-secondary">● 3 layanan vendor tercatat (MUA, KUA, Dokumentasi)</span>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className="w-32">Waktu (WIB)</th>
              <th>Kegiatan</th>
              <th>Sumber</th>
              <th>PIC</th>
              <th>Durasi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={item.isAnchor ? styles.anchorRow : undefined}>
                <td className="font-mono text-xs font-semibold text-foreground">
                  {item.startTime} – {item.endTime}
                </td>
                <td className="font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.isAnchor && (
                      <span className="rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 uppercase">
                        Kunci Sakral
                      </span>
                    )}
                  </div>
                </td>
                <td className="text-xs text-secondary">{item.source}</td>
                <td>
                  <span className="rounded-control bg-subtle px-2 py-0.5 text-xs text-secondary">
                    {item.pic}
                  </span>
                </td>
                <td className="font-mono text-xs text-secondary">{item.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RundownGeneratorDialog
        open={showGenerator}
        onClose={() => setShowGenerator(false)}
        onApply={(updated) => setItems(updated)}
        currentItems={items}
      />
    </main>
  );
}
