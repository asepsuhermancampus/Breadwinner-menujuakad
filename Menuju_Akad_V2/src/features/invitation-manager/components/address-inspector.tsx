"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { activeInvitationUrl, slugSuggestion } from "@/features/invitation-manager/domain/slug";
import type { SlugCheckResult } from "../types/manager";

export function AddressInspector({
  open,
  onClose,
  slug,
  result,
  onDraftSlug,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  slug: string;
  result: SlugCheckResult | null;
  onDraftSlug: (slug: string) => void;
  onSave: () => void;
}) {
  const available = result?.status === "AVAILABLE";
  return (
    <Dialog open={open} onClose={onClose} title="Alamat undangan" side>
      <div className="flex min-h-[70vh] flex-col gap-4 text-sm">
        <div>
          <p className="text-[10px] font-bold tracking-widest text-muted">ALAMAT AKTIF</p>
          <p className="font-mono text-sm font-semibold text-foreground">{activeInvitationUrl}</p>
        </div>

        <label className="grid gap-1.5">
          <span className="text-xs font-semibold text-foreground">Usulan slug baru</span>
          <input
            value={slug}
            onChange={(e) => onDraftSlug(e.target.value)}
            className="min-h-11 rounded-control border border-ux-control-border bg-surface px-3 text-sm text-foreground"
            aria-invalid={Boolean(result && result.status !== "AVAILABLE")}
          />
        </label>

        {result?.status === "TAKEN" && (
          <div className="rounded-control border border-warning/40 bg-warning-bg p-3">
            <p className="text-xs font-bold text-warning">Slug belum tersedia</p>
            <p className="mt-1 text-xs text-secondary">
              Gunakan alamat lain. Kami tidak menampilkan identitas pemilik alamat tersebut.
            </p>
            <Button
              size="small"
              variant="secondary"
              className="mt-2"
              onClick={() => onDraftSlug(slugSuggestion)}
            >
              Gunakan {slugSuggestion}
            </Button>
            <p className="mt-2 text-[11px] font-semibold text-success">
              ✓ Saran tersedia pada pratinjau ini
            </p>
          </div>
        )}
        {result?.status === "INVALID" && (
          <p className="rounded-control border border-danger/30 bg-danger-bg p-3 text-xs text-danger">
            {result.reason}
          </p>
        )}
        {available && (
          <p className="rounded-control border border-success/30 bg-success-bg p-3 text-xs font-semibold text-success">
            ✓ {result.slug} tersedia pada pratinjau ini
          </p>
        )}

        <div className="rounded-control border border-border bg-canvas p-3">
          <p className="text-xs font-bold text-foreground">Alamat aktif tetap aman</p>
          <p className="mt-1 text-xs text-secondary">
            Mengubah draf tidak mengubah tautan yang sudah dibagikan. Alamat baru ditinjau lagi saat
            publikasi; tautan personal tamu tetap terpisah.
          </p>
        </div>

        <div className="flex-1" />

        <div className="border-t border-border pt-3">
          <Button className="w-full" disabled={!available} onClick={onSave}>
            Simpan draf alamat
          </Button>
          {!available && (
            <p className="mt-2 text-[11px] text-muted">Pilih slug yang tersedia terlebih dahulu.</p>
          )}
        </div>
      </div>
    </Dialog>
  );
}
