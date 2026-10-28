"use client";
import { useUrlTab } from "@/hooks/use-url-tab";

import { SummaryCard } from "@/components/ui/summary-card";
import { Icon } from "@/components/ui/icon";
import type { PlanningViewProps } from "../domain/planning-view";
import styles from "./planning.module.css";
const money = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
export function PlanningChecklist({
  kind,
  items,
  edit,
  remove,
  toggle,
}: PlanningViewProps & { kind: "emergency" | "seserahan" }) {
  const [filter, setFilter] = useUrlTab<string>(
    "tab",
    kind === "emergency"
      ? ["Semua", "equipment", "contact"]
      : ["Semua", "Sudah dibeli", "Belum selesai"],
    "Semua",
  );
  const ready = items.filter((i) => "completed" in i && i.completed).length;
  const gifts = items.filter((i) => "quantity" in i);
  const visible = items.filter(
    (i) =>
      filter === "Semua" ||
      (kind === "emergency"
        ? "category" in i && i.category === filter
        : Boolean("completed" in i && i.completed) === (filter === "Sudah dibeli")),
  );
  const actions = (item: (typeof items)[number]) => (
    <div className={styles.actions}>
      <button onClick={() => edit(item)}>Edit</button>
      <button data-delete onClick={() => remove(item)}>
        Hapus
      </button>
    </div>
  );
  return (
    <div className={styles.stack}>
      {kind === "seserahan" ? (
        <div className={styles.stats}>
          <SummaryCard
            label="Estimasi keseluruhan"
            value={money(gifts.reduce((sum, i) => sum + i.quantity * i.unitCost, 0))}
            ornament={1}
            highlight
          />
          <SummaryCard
            label="Sudah dibeli"
            value={`${ready}/${items.length} barang`}
            ornament={2}
          />
          <SummaryCard
            label="Nilai barang dibeli"
            value={money(
              gifts.filter((i) => i.completed).reduce((sum, i) => sum + i.quantity * i.unitCost, 0),
            )}
            ornament={3}
          />
        </div>
      ) : (
        <SummaryCard
          label="Barang sudah siap dibawa"
          value={`${ready}/${items.length}`}
          detail={`${items.length - ready} belum siap. Sesuaikan perlengkapan dan kontak penting untuk hari kalian.`}
          ornament={4}
          highlight
        />
      )}
      <div
        className={
          kind === "emergency"
            ? "grid grid-cols-1 gap-6 md:grid-cols-[200px_minmax(0,1fr)]"
            : styles.stack
        }
      >
        <div className={styles.tabs} role="tablist" aria-label="Filter barang">
          {(kind === "emergency"
            ? ["Semua", "equipment", "contact"]
            : ["Semua", "Sudah dibeli", "Belum selesai"]
          ).map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
            >
              {value === "equipment"
                ? "Perlengkapan"
                : value === "contact"
                  ? "Kontak penting"
                  : value}
            </button>
          ))}
        </div>
        {kind === "emergency" ? (
          <div className={styles.card}>
            {visible.map((item) => (
              <div key={item.id} className={styles.check}>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean("completed" in item && item.completed)}
                    onChange={() => toggle(item)}
                  />
                  <span>
                    {item.title}
                    {"phone" in item && item.phone && <small>{item.phone}</small>}
                    {item.notes && <small>{item.notes}</small>}
                  </span>
                </label>
                {actions(item)}
              </div>
            ))}
            {!visible.length && (
              <p className={styles.empty}>Ayo siapkan perlengkapan pertama kalian.</p>
            )}
          </div>
        ) : (
          <div className={styles.cards}>
            {visible.map((item) => (
              <article key={item.id} className={styles.item}>
                <div className={styles.art}>
                  <Icon name="gift" size={32} />
                </div>
                <div className={styles.itemBody}>
                  <label className="flex min-h-11 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean("completed" in item && item.completed)}
                      onChange={() => toggle(item)}
                    />
                    <h2>{item.title}</h2>
                  </label>
                  {item.notes && (
                    <p className="text-xs text-secondary whitespace-pre-wrap">{item.notes}</p>
                  )}
                  {"quantity" in item && (
                    <div className={styles.row}>
                      <span className="text-xs text-secondary">
                        {item.quantity} × {money(item.unitCost)}
                      </span>
                      <strong className="font-mono text-xs">
                        {money(item.quantity * item.unitCost)}
                      </strong>
                    </div>
                  )}
                  {actions(item)}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {!visible.length && kind === "seserahan" && (
        <p className={styles.empty}>Belum ada barang seserahan pada filter ini.</p>
      )}
    </div>
  );
}
