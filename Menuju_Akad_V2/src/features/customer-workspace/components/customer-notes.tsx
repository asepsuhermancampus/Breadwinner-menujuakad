"use client";
import { DocumentEditForm } from "./document-edit-form";
import { useCommittedList } from "@/hooks/use-committed-list";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHeading } from "@/components/ui/page-heading";
import styles from "./customer-documents.module.css";
type Note = { id: string; title: string; completed?: boolean; amount?: number; notes?: string };
export function CustomerNotes({
  initial,
  finance,
  onChange,
}: {
  initial: Note[];
  finance: boolean;
  onChange: (items: Note[]) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState<Note | null>(null);
  const [items, setItems] = useCommittedList(initial, onChange),
    [title, setTitle] = useState(""),
    [amount, setAmount] = useState("");
  async function update(next: Note[]) {
    return await setItems(next);
  }
  return (
    <section className="space-y-5">
      <PageHeading
        key={finance ? "finance" : "documents"}
        title={finance ? "Catatan anggaran" : "Checklist dokumen"}
        description={
          finance
            ? "Catat kebutuhan dan nominal anggaran acara kalian."
            : "Template persiapan dapat diedit. Sesuaikan persyaratan dengan KUA setempat."
        }
      />
      {editing && (
        <DocumentEditForm
          key={editing.id}
          item={editing}
          cancel={() => setEditing(null)}
          save={async (next) => {
            if (JSON.stringify(items.find((i) => i.id === editing.id)) !== JSON.stringify(editing))
              return false;
            return update(items.map((i) => (i.id === next.id ? next : i)));
          }}
        />
      )}
      {finance && (
        <p className="text-sm text-secondary">
          Total tercatat: Rp{" "}
          {items.reduce((sum, item) => sum + (item.amount ?? 0), 0).toLocaleString("id-ID")}
        </p>
      )}
      <form
        className={
          finance
            ? "flex flex-wrap gap-3 rounded-card border border-ux-border bg-surface p-5"
            : styles.create
        }
        onSubmit={async (e) => {
          e.preventDefault();
          if (!title.trim()) return;
          const saved = await update([
            ...items,
            {
              id: crypto.randomUUID(),
              title: title.trim(),
              ...(finance ? { amount: Number(amount) } : { completed: false }),
            },
          ]);
          if (!saved) return;
          setTitle("");
          setAmount("");
        }}
      >
        {!finance && (
          <div className={styles.intro}>
            <span className={styles.documentIcon}>
              <Icon name="file-text" size={20} />
            </span>
            <div>
              <h2>Tambah dokumen</h2>
              <p>Lengkapi checklist dengan berkas yang kalian butuhkan.</p>
            </div>
          </div>
        )}
        <label className={finance ? "grid flex-1 gap-1 text-sm" : styles.field}>
          {finance ? "Nama anggaran" : "Nama dokumen"}
          <input
            required
            maxLength={160}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={
              finance ? "rounded-control border border-ux-border bg-canvas p-3" : styles.input
            }
            placeholder={finance ? undefined : "Contoh: Surat rekomendasi nikah"}
            aria-describedby={finance ? undefined : "document-name-help"}
          />
        </label>
        {finance && (
          <label className="grid gap-1 text-sm">
            Nominal (Rp)
            <input
              required
              type="number"
              min="0"
              max="1000000000000"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-control border border-ux-border bg-canvas p-3"
            />
          </label>
        )}
        <Button type="submit" className={finance ? undefined : styles.add}>
          {!finance && <Icon name="plus" size={18} />}Tambah
        </Button>
        {!finance && (
          <p id="document-name-help" className={styles.helper}>
            Nama berkas bisa disesuaikan dengan persyaratan KUA setempat.
          </p>
        )}
      </form>
      {items.length === 0 && (
        <p className="text-sm text-secondary">Belum ada catatan. Mulai dari kebutuhan kalian.</p>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={
              finance
                ? "flex flex-wrap items-center gap-3 rounded-card border border-ux-border bg-surface p-4"
                : styles.row
            }
          >
            {!finance && (
              <input
                type="checkbox"
                aria-label={`Selesai ${item.title}`}
                checked={item.completed ?? false}
                onChange={() =>
                  update(
                    items.map((n) => (n.id === item.id ? { ...n, completed: !n.completed } : n)),
                  )
                }
              />
            )}
            <span className={finance ? "flex-1" : styles.details}>
              {item.title}
              {item.notes && <small className="block text-secondary">{item.notes}</small>}
            </span>
            {!finance && (
              <button
                type="button"
                className={styles.action}
                aria-label={`Edit ${item.title}`}
                title={`Edit ${item.title}`}
                onClick={() => setEditing(item)}
              >
                <Icon name="pencil" size={17} />
              </button>
            )}
            {finance && <span>Rp {(item.amount ?? 0).toLocaleString("id-ID")}</span>}
            <button
              type="button"
              className={
                finance ? "text-xs text-danger underline" : `${styles.action} ${styles.remove}`
              }
              aria-label={finance ? undefined : `Hapus ${item.title}`}
              title={finance ? undefined : `Hapus ${item.title}`}
              onClick={() => update(items.filter((n) => n.id !== item.id))}
            >
              {finance ? "Hapus" : <Icon name="trash" size={17} />}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
