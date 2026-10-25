"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export type BasicInvitation = {
  id: string;
  title: string;
  template: "basic" | "premium";
  groom?: string;
  bride?: string;
  date?: string;
  venue?: string;
  published?: boolean;
};
export function InvitationEditor({
  item,
  premium,
  trial,
  workspaceId,
  save,
  remove,
}: {
  item: BasicInvitation;
  premium: boolean;
  trial: boolean;
  workspaceId: string;
  save: (item: BasicInvitation) => Promise<boolean>;
  remove: () => Promise<boolean>;
}) {
  const [draft, setDraft] = useState(item),
    [pending, setPending] = useState(false);
  const [base, setBase] = useState(item),
    [error, setError] = useState("");
  if (
    JSON.stringify(base) !== JSON.stringify(item) &&
    JSON.stringify(draft) === JSON.stringify(base)
  ) {
    setBase(item);
    setDraft(item);
  }
  return (
    <form
      className="grid gap-3 rounded-card border border-ux-border bg-surface p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (JSON.stringify(base) !== JSON.stringify(item)) {
          setError("Undangan berubah di tab lain. Salin draf kalian lalu muat ulang data terbaru.");
          return;
        }
        setError("");
        setPending(true);
        try {
          if (await save(draft)) setBase(draft);
        } finally {
          setPending(false);
        }
      }}
    >
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {(
        [
          ["title", "Judul undangan"],
          ["groom", "Nama pertama"],
          ["bride", "Nama pasangan"],
          ["date", "Tanggal acara"],
          ["venue", "Tempat acara"],
        ] as const
      ).map(([field, label]) => (
        <label key={field} className="grid gap-1 text-sm">
          {label}
          <input
            required={field === "title"}
            maxLength={field === "title" ? 160 : 2000}
            className="rounded-control border border-ux-border bg-canvas p-3"
            value={draft[field] ?? ""}
            onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
          />
        </label>
      ))}
      <label className="grid gap-1 text-sm">
        Template
        <select
          className="rounded-control border border-ux-border p-3"
          value={draft.template}
          onChange={(e) => setDraft({ ...draft, template: e.target.value as "basic" | "premium" })}
        >
          <option value="basic">Dasar</option>
          <option value="premium" disabled={!premium}>
            Premium
          </option>
        </select>
      </label>
      {trial ? (
        <p className="text-xs text-secondary">Draf lokal. Masuk untuk memublikasikan undangan.</p>
      ) : (
        <label className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={draft.published ?? false}
            onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
          />
          Publikasikan undangan
        </label>
      )}
      <Button type="submit" disabled={pending}>
        Simpan undangan
      </Button>
      {!trial && item.published && (
        <Link
          href={`/invitation/${item.id}?workspace=${encodeURIComponent(workspaceId)}`}
          target="_blank"
          className="text-sm underline"
        >
          Lihat undangan publik
        </Link>
      )}
      <button
        type="button"
        disabled={pending}
        className="justify-self-start text-xs text-danger underline"
        onClick={async () => {
          setPending(true);
          try {
            await remove();
          } finally {
            setPending(false);
          }
        }}
      >
        Hapus undangan
      </button>
    </form>
  );
}
