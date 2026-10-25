"use client";
import { DocumentEditForm } from "./document-edit-form";
import { useCommittedList } from "@/hooks/use-committed-list";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
      <h1 className="text-3xl font-semibold">
        {finance ? "Catatan anggaran" : "Checklist dokumen"}
      </h1>
      {!finance && (
        <p className="text-sm text-secondary">
          Template persiapan dapat diedit. Sesuaikan persyaratan dengan KUA setempat.
        </p>
      )}
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
        className="flex flex-wrap gap-3 rounded-card border border-ux-border bg-surface p-5"
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
        <label className="grid flex-1 gap-1 text-sm">
          {finance ? "Nama anggaran" : "Nama dokumen"}
          <input
            required
            maxLength={160}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-control border border-ux-border bg-canvas p-3"
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
        <Button type="submit">Tambah</Button>
      </form>
      {items.length === 0 && (
        <p className="text-sm text-secondary">Belum ada catatan. Mulai dari kebutuhan kalian.</p>
      )}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center gap-3 rounded-card border border-ux-border bg-surface p-4"
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
            <span className="flex-1">
              {item.title}
              {item.notes && <small className="block text-secondary">{item.notes}</small>}
            </span>
            {!finance && (
              <button className="text-sm underline" onClick={() => setEditing(item)}>
                Edit
              </button>
            )}
            {finance && <span>Rp {(item.amount ?? 0).toLocaleString("id-ID")}</span>}
            <button
              className="text-xs text-danger underline"
              onClick={() => update(items.filter((n) => n.id !== item.id))}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
