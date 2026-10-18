"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";

type Props = {
  onApplyReplacement: () => void;
  isApplied?: boolean;
};

export function ItemRejectionView({ onApplyReplacement, isApplied = false }: Props) {
  const [applied, setApplied] = useState(isApplied);

  function handleApply() {
    setApplied(true);
    onApplyReplacement();
  }

  return (
    <div className="p-5 bg-surface rounded-2xl border border-border space-y-4 shadow-sm">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Resolusi Partial Rejection · Sandbox Preset 3
          </span>
          <h3 className="font-bold text-lg text-foreground mt-0.5">
            Satu Item Ditolak, Paket Tetap Aman
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            ORD-SIM-204/v7 · 2 item disetujui, 1 item memerlukan konfirmasi pengganti
          </p>
        </div>
        <span className="px-2.5 py-1 rounded bg-warning-bg text-warning font-mono text-xs font-bold">
          Snapshot v7 → v9
        </span>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl text-xs">
        <table className="w-full text-left">
          <thead className="bg-subtle text-secondary font-semibold border-b border-border">
            <tr>
              <th className="p-3">Item / Vendor</th>
              <th className="p-3">Nilai Kontrak</th>
              <th className="p-3">Keputusan</th>
              <th className="p-3">Keterangan / Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-3 font-semibold text-foreground">Akad · Aru MUA</td>
              <td className="p-3 font-mono">{formatIdr(8000000)}</td>
              <td className="p-3">
                <Status tone="success">Disetujui</Status>
              </td>
              <td className="p-3 text-secondary">Snapshot item tetap utuh</td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-semibold text-foreground">Sehari · Lensa Teduh</td>
              <td className="p-3 font-mono">{formatIdr(15000000)}</td>
              <td className="p-3">
                <Status tone="success">Disetujui</Status>
              </td>
              <td className="p-3 text-secondary">Hold server tervalidasi</td>
            </tr>
            <tr className="border-b border-border bg-danger-bg/20">
              <td className="p-3 font-semibold text-foreground">
                Cypress · Luma Dekor
                <span className="block text-[11px] text-danger mt-0.5">
                  Kru tidak tersedia di 14 Feb
                </span>
              </td>
              <td className="p-3 font-mono text-secondary">{formatIdr(12000000)}</td>
              <td className="p-3">
                <Status tone="danger">Ditolak</Status>
              </td>
              <td className="p-3">
                {applied ? (
                  <span className="text-success font-semibold">
                    ✓ Diganti: Rona Dekor ({formatIdr(12000000)})
                  </span>
                ) : (
                  <span className="text-danger font-medium">Memerlukan pengganti sebanding</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {!applied ? (
        <div className="p-4 bg-canvas rounded-xl border border-primary/30 flex flex-wrap justify-between items-center gap-3">
          <div>
            <div className="text-xs font-bold text-foreground">
              Rekomendasi Pengganti: Rona Dekor
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Cakupan dekorasi sebanding · 14 Feb 2027 tersedia · Nilai sama:{" "}
              <strong>{formatIdr(12000000)}</strong>
            </p>
            <div className="text-[11px] text-muted mt-1">
              Total pesanan tetap <strong>{formatIdr(35000000)}</strong> (DP 30%:{" "}
              {formatIdr(10500000)})
            </div>
          </div>
          <Button variant="primary" size="small" onClick={handleApply}>
            Terapkan Pengganti Rona Dekor (Snapshot v9)
          </Button>
        </div>
      ) : (
        <div className="p-3 bg-success-bg text-success border border-success/30 rounded-control text-xs font-semibold">
          ✓ Pengganti Rona Dekor telah diterapkan. Snapshot kontrak diperbarui ke versi v9. Item
          yang disetujui sebelumnya tidak terganggu.
        </div>
      )}

      <p className="text-[11px] text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
        <strong>Integritas Audit:</strong> Penolakan Luma Dekor tidak membatalkan seluruh pesanan
        paket. Luma tetap tercatat sebagai riwayat penolakan di dalam audit, dan Rona Dekor
        dimasukkan ke dalam draf kontrak baru v9 yang membutuhkan persetujuan ulang.
      </p>
    </div>
  );
}
