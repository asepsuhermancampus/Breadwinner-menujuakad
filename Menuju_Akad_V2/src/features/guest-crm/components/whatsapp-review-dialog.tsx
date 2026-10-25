"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { WaRecipientSnapshot } from "../types/guest";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirmDispatch: () => { success: boolean; error?: string } | void;
  quota?: number;
  snapshot?: WaRecipientSnapshot;
};

const defaultSnapshot: WaRecipientSnapshot = {
  totalSelected: 14,
  eligibleCount: 10,
  excludedCount: 4,
  excludedReasons: [
    "2 undangan sudah pernah terkirim sebelumnya",
    "1 tamu belum memberikan izin komunikasi WhatsApp",
    "1 nomor telepon belum valid",
  ],
};

export function WhatsappReviewDialog({
  open,
  onClose,
  onConfirmDispatch,
  quota = 100,
  snapshot = defaultSnapshot,
}: Props) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");

  const remainingAfter = Math.max(0, quota - snapshot.eligibleCount);
  const isQuotaInsufficient = quota < snapshot.eligibleCount;
  const cannotDispatch = !acknowledged || snapshot.eligibleCount === 0 || isQuotaInsufficient;

  function handleConfirm() {
    if (isQuotaInsufficient) {
      setError(`Kuota tidak mencukupi untuk mengirim ${snapshot.eligibleCount} pesan.`);
      return;
    }
    if (snapshot.eligibleCount <= 0) {
      setError("Tidak ada penerima yang memenuhi syarat untuk dikirim.");
      return;
    }
    const result = onConfirmDispatch();
    if (result && !result.success) {
      setError(result.error || "Gagal mengirim pesan.");
      return;
    }
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} title="Tinjauan Pengiriman WhatsApp">
      <div className="space-y-4">
        {error && (
          <div className="p-2 text-xs text-danger bg-danger-bg rounded" role="alert">
            {error}
          </div>
        )}
        <div className="p-3 bg-surface border border-border rounded-control">
          <div className="text-sm font-bold text-foreground">
            Kirim ke {snapshot.eligibleCount} Undangan?
          </div>
          <div className="text-xs text-secondary mt-1">
            {snapshot.totalSelected} dipilih ·{" "}
            <span className="text-success font-semibold">
              {snapshot.eligibleCount} memenuhi syarat
            </span>{" "}
            ·{" "}
            <span className="text-warning font-semibold">
              {snapshot.excludedCount} dikecualikan
            </span>
          </div>
        </div>

        <div className="text-xs space-y-2 border-t border-b border-border py-3">
          <div className="flex justify-between">
            <span className="text-secondary">Template Pesan</span>
            <span className="font-medium text-foreground">Undangan pernikahan · v1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Penerima Siap Kirim</span>
            <span className="font-semibold text-primary">{snapshot.eligibleCount} undangan</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Kuota Pesan Terpakai</span>
            <span className="font-mono font-bold text-foreground">
              {quota} → {remainingAfter} pesan
            </span>
          </div>
        </div>

        {snapshot.excludedCount > 0 && (
          <div className="p-3 bg-warning-bg border border-warning/30 rounded-control space-y-1.5">
            <div className="text-xs font-bold text-warning">
              {snapshot.excludedCount} Undangan Dikecualikan:
            </div>
            <ul className="text-xs text-secondary list-disc pl-4 space-y-0.5">
              {snapshot.excludedReasons.map((reason, idx) => (
                <li key={idx}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary leading-relaxed">
          <strong>Perhatian:</strong> Izin diperiksa ulang saat pengiriman. Penerima yang tidak lagi
          memenuhi syarat dicatat sebagai dikecualikan, bukan tetap dikirim. Kuota berkurang hanya
          setelah antrean diterima.
        </div>

        <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5"
          />
          <span>Saya sudah meninjau penerima dan persetujuan komunikasi secara teliti.</span>
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" disabled={cannotDispatch} onClick={handleConfirm}>
            Kirim {snapshot.eligibleCount} Pesan Sekarang
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
