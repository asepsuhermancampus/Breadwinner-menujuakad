"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { planningSchemas, type PlanningItem, type PlanningKind } from "../domain/planning-resource";
import { planningFields } from "../domain/planning-fields";
export function PlanningForm({
  kind,
  item,
  save,
  cancel,
}: {
  kind: PlanningKind;
  item?: PlanningItem | undefined;
  save: (item: PlanningItem) => Promise<boolean>;
  cancel: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, unknown>>(() => ({
    ...item,
    title: item?.title ?? "",
    notes: item?.notes ?? "",
    category: "category" in (item ?? {}) ? (item as { category: string }).category : "equipment",
  }));
  const [error, setError] = useState(""),
    [pending, setPending] = useState(false);
  return (
    <form
      className="grid gap-4 rounded-card border border-ux-border bg-surface p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        if (pending) return;
        const result = planningSchemas[kind].safeParse({
          ...draft,
          id: item?.id ?? crypto.randomUUID(),
        });
        if (!result.success) {
          setError(result.error.issues[0]?.message ?? "Periksa isian.");
          return;
        }
        setPending(true);
        try {
          if (!(await save(result.data)))
            setError("Belum tersimpan. Periksa batas percobaan atau perubahan di tab lain.");
        } finally {
          setPending(false);
        }
      }}
    >
      <h2 className="font-semibold">{item ? "Edit data" : "Tambah data"}</h2>
      <label className="grid gap-1 text-sm">
        Nama
        <input
          required
          maxLength={160}
          value={String(draft.title ?? "")}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      {kind === "emergency" && (
        <label className="grid gap-1 text-sm">
          Kategori
          <select
            value={String(draft.category)}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            className="rounded-control border border-ux-border bg-canvas p-3"
          >
            <option value="equipment">Perlengkapan</option>
            <option value="contact">Kontak penting</option>
          </select>
        </label>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {planningFields[kind].map((f) => (
          <label key={f.key} className="grid gap-1 text-sm">
            {f.label}
            <input
              required={f.type !== "text"}
              type={f.type}
              step={f.type === "number" ? 1 : undefined}
              min={f.type === "number" ? 0 : undefined}
              maxLength={160}
              value={String(draft[f.key] ?? "")}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value,
                })
              }
              className="rounded-control border border-ux-border bg-canvas p-3"
            />
          </label>
        ))}
      </div>
      <label className="grid gap-1 text-sm">
        Catatan
        <textarea
          maxLength={2000}
          value={String(draft.notes ?? "")}
          onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
          className="rounded-control border border-ux-border bg-canvas p-3"
        />
      </label>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button type="button" variant="secondary" disabled={pending} onClick={cancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
