"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
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
  onClose,
}: {
  item: BasicInvitation;
  premium: boolean;
  trial: boolean;
  workspaceId: string;
  save: (item: BasicInvitation) => Promise<boolean>;
  remove?: () => Promise<boolean>;
  onClose?: () => void;
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
  const form = (
    <form
      className="grid gap-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (pending) return;
        if (JSON.stringify(base) !== JSON.stringify(item)) {
          setError("Undangan berubah di tab lain. Salin draf kalian lalu muat ulang data terbaru.");
          return;
        }
        setError("");
        setPending(true);
        try {
          if (await save(draft)) {
            setBase(draft);
            onClose?.();
          } else setError("Undangan belum tersimpan. Draf tetap tersedia; coba simpan kembali.");
        } catch {
          setError("Undangan belum tersimpan. Draf tetap tersedia; coba simpan kembali.");
        } finally {
          setPending(false);
        }
      }}
    >
      <fieldset disabled={pending} className="grid min-w-0 gap-3 border-0 p-0">
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
            onChange={(e) =>
              setDraft({ ...draft, template: e.target.value as "basic" | "premium" })
            }
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
        {remove && (
          <button
            type="button"
            disabled={pending}
            className="customer-control justify-self-start text-danger underline"
            onClick={async () => {
              setPending(true);
              try {
                if (await remove()) onClose?.();
                else setError("Undangan belum dihapus. Silakan coba lagi.");
              } catch {
                setError("Undangan belum dihapus. Silakan coba lagi.");
              } finally {
                setPending(false);
              }
            }}
          >
            Hapus undangan
          </button>
        )}
        {onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
        )}
      </fieldset>
    </form>
  );
  return onClose ? (
    <Dialog
      open
      title={remove ? "Kelola undangan" : "Tambah undangan"}
      onClose={() => {
        if (!pending) onClose();
      }}
    >
      {form}
    </Dialog>
  ) : (
    form
  );
}
