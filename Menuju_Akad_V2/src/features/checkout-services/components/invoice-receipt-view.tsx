"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { DisputeSubmissionDialog } from "./dispute-submission-dialog";

export function InvoiceReceiptView() {
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Tanda Terima Resmi & Jadwal Termin
          </span>
          <h1 className="text-2xl font-bold text-foreground mt-0.5">
            Invoice & Receipt: INV-SIM-204-01
          </h1>
          <p className="text-xs text-secondary mt-0.5">
            Pesanan: <strong>ORD-SIM-204</strong> · Terverifikasi 25 Okt 2026, 10.50 WIB
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="small"
            className="text-xs border-danger text-danger hover:bg-danger-bg"
            onClick={() => setDisputeOpen(true)}
          >
            Ajukan Sengketa Terarah…
          </Button>
        </div>
      </div>

      {disputeSubmitted && (
        <div className="p-3 bg-warning-bg text-warning border border-warning/40 rounded-control text-xs font-semibold">
          ✓ Permohonan sengketa untuk item Lensa Teduh telah diterima dan diteruskan ke tim mediasi
          kepatuhan.
        </div>
      )}

      {/* Official Receipt Card */}
      <div className="p-6 bg-surface rounded-2xl border-2 border-primary/20 space-y-4 shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-2 pb-3 border-b border-border">
          <div>
            <div className="text-xs font-bold text-foreground">
              BUKTI PEMBAYARAN UANG MUKA (DP 30%)
            </div>
            <div className="font-mono text-xs text-secondary mt-0.5">
              Receipt No: RCPT-SIM-204-01 · Provider: KlikQRIS (SETTLED)
            </div>
          </div>
          <Status tone="success">DP Lunas Terverifikasi</Status>
        </div>

        <div className="overflow-x-auto border border-border rounded-xl text-xs">
          <table className="w-full text-left">
            <thead className="bg-subtle text-secondary font-semibold border-b border-border">
              <tr>
                <th className="p-3">Item Layanan</th>
                <th className="p-3">Nilai Kontrak</th>
                <th className="p-3">DP Dibayar</th>
                <th className="p-3">Status Escrow</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold text-foreground">Aru MUA · Akad</td>
                <td className="p-3 font-mono">{formatIdr(8000000)}</td>
                <td className="p-3 font-mono text-primary font-bold">{formatIdr(2400000)}</td>
                <td className="p-3 text-secondary">Ditahan aman di escrow</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold text-foreground">Lensa Teduh · Foto</td>
                <td className="p-3 font-mono">{formatIdr(15000000)}</td>
                <td className="p-3 font-mono text-primary font-bold">{formatIdr(4500000)}</td>
                <td className="p-3 text-secondary">Ditahan aman di escrow</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 font-semibold text-foreground">Rona Dekor · Cypress</td>
                <td className="p-3 font-mono">{formatIdr(12000000)}</td>
                <td className="p-3 font-mono text-primary font-bold">{formatIdr(3600000)}</td>
                <td className="p-3 text-secondary">Ditahan aman di escrow</td>
              </tr>
              <tr className="bg-canvas font-bold">
                <td className="p-3 text-foreground">Total Diterima (DP 30%)</td>
                <td className="p-3 font-mono text-sm text-foreground">{formatIdr(35000000)}</td>
                <td className="p-3 font-mono text-sm text-primary">{formatIdr(10500000)}</td>
                <td className="p-3 text-success">Lunas Masuk Rekening Escrow</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-canvas rounded-xl border border-border space-y-3">
          <div className="text-xs font-bold text-foreground uppercase tracking-wider">
            Jadwal Sisa Pembayaran (Sisa Rp 24.500.000)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="font-semibold text-secondary">Termin 2 · 40%</div>
              <div className="font-mono text-sm font-bold text-foreground mt-0.5">
                {formatIdr(14000000)}
              </div>
              <div className="text-[11px] text-muted mt-0.5">Jatuh tempo 15 Januari 2027</div>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <div className="font-semibold text-secondary">Pelunasan Akhir · 30%</div>
              <div className="font-mono text-sm font-bold text-foreground mt-0.5">
                {formatIdr(10500000)}
              </div>
              <div className="text-[11px] text-muted mt-0.5">Jatuh tempo 07 Februari 2027</div>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-secondary leading-relaxed bg-subtle p-3 rounded-control border border-border">
          <strong>Perhatian:</strong> Pembayaran DP bukan berarti kontrak lunas sepenuhnya. Sisa
          pembayaran {formatIdr(24500000)} wajib diselesaikan sesuai jadwal termin di atas. Dana DP
          ditahan di rekening penampung aman dan dilepas ke saldo siap cair vendor setelah
          konfirmasi pekerjaan selesai.
        </p>
      </div>

      <DisputeSubmissionDialog
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        onSubmitted={() => setDisputeSubmitted(true)}
      />
    </div>
  );
}
