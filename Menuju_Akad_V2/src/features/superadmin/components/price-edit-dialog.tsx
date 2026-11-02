"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type {
  PlanPricingItem,
  PlanPricingAuditEntry,
} from "@/features/superadmin/types/pricing";

const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

export function PriceEditDialog({
  plan,
  open,
  onClose,
  onSaved,
}: {
  plan: PlanPricingItem | null;
  open: boolean;
  onClose: () => void;
  onSaved: (data: { pricing: PlanPricingItem[]; audit: PlanPricingAuditEntry[]; message: string }) => void;
}) {
  const [newAmount, setNewAmount] = useState<number>(plan?.amount ?? 0);
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!plan) return null;

  const presets =
    plan.planId === "premium"
      ? [99000, 129000, 149000, 179000, 199000]
      : [249000, 299000, 349000, 399000, 499000];

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newAmount <= 0) {
      setError("Harga paket harus lebih besar dari 0.");
      return;
    }
    if (newAmount === plan?.amount) {
      setError("Harga baru sama dengan harga yang sedang aktif.");
      return;
    }
    if (reason.trim().length < 3) {
      setError("Alasan penyesuaian harga wajib diisi (minimal 3 karakter).");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/superadmin/pricing", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan?.planId,
          amount: newAmount,
          reason: reason.trim(),
          version: plan?.version ?? 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Gagal memperbarui harga paket.");
      }
      onSaved(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan sistem.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      title={`Atur Harga Paket ${plan.label}`}
      onClose={() => {
        if (!saving) onClose();
      }}
    >
      <form onSubmit={handleSave} className="space-y-5 text-xs text-foreground">
        <div>
          <div className="flex items-center justify-between text-secondary">
            <span>Harga Aktif Saat Ini:</span>
            <span className="font-mono font-bold text-foreground">{formatRupiah(plan.amount)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-secondary">
            <span>Harga Bawaan Sistem:</span>
            <span className="font-mono text-muted">{formatRupiah(plan.defaultAmount)}</span>
          </div>
        </div>

        <div>
          <label htmlFor="newAmount" className="block font-semibold">
            Harga Baru (Rp)
          </label>
          <input
            id="newAmount"
            type="number"
            step="1000"
            min="10000"
            max="100000000"
            value={newAmount || ""}
            onChange={(e) => setNewAmount(Number(e.target.value))}
            className="mt-1 w-full rounded-control border border-ux-border bg-canvas/60 px-3.5 py-2.5 font-mono text-sm font-bold text-brand-secondary focus:border-primary focus:outline-hidden"
            placeholder="Contoh: 149000"
            required
            disabled={saving}
          />
          <p className="mt-1 text-[11px] text-secondary">
            Pratinjau tampilan: <strong className="text-foreground">{formatRupiah(newAmount || 0)}</strong>
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-muted">Pilihan cepat:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setNewAmount(preset)}
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono transition ${
                  newAmount === preset
                    ? "border-primary bg-primary text-on-primary font-semibold"
                    : "border-ux-border bg-subtle text-secondary hover:border-primary/50"
                }`}
              >
                {formatRupiah(preset)}
                {preset === plan.defaultAmount ? " (Bawaan)" : ""}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="reason" className="block font-semibold">
            Alasan Penyesuaian Harga <span className="text-danger">*</span>
          </label>
          <textarea
            id="reason"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-1 w-full rounded-control border border-ux-border bg-canvas/60 px-3 py-2 text-xs focus:border-primary focus:outline-hidden"
            placeholder="Contoh: Promo spesial awal tahun, penyesuaian biaya operasional..."
            required
            disabled={saving}
          />
        </div>

        {error && (
          <div role="alert" className="rounded-control border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 border-t border-ux-border/60 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Menyimpan…" : "Simpan Perubahan Harga"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
