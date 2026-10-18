"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import type { ExpenseItem } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";

type Props = {
  expense: ExpenseItem | null;
  onClose: () => void;
};

export function ExpenseInspector({ expense, onClose }: Props) {
  if (!expense) return null;

  return (
    <Dialog open={Boolean(expense)} onClose={onClose} title="Detail Pembayaran & Jejak Audit" side>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-xs font-semibold text-primary">{expense.id}</span>
            <h3 className="font-semibold text-foreground text-base mt-0.5">{expense.title}</h3>
            <span className="text-xs text-secondary">{expense.date}</span>
          </div>
          <span
            className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
              expense.status === "lunas"
                ? "bg-success-bg text-success"
                : "bg-warning-bg text-warning"
            }`}
          >
            {expense.status}
          </span>
        </div>

        <div className="rounded-card bg-ux-dock p-4 border border-border flex flex-col gap-1">
          <span className="text-xs text-secondary">Nominal Pembayaran</span>
          <strong className="font-mono text-2xl text-primary font-semibold">
            {formatRupiah(expense.amount)}
          </strong>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-secondary block">Kategori Anggaran</span>
            <strong className="text-foreground text-sm font-medium">{expense.category}</strong>
          </div>
          <div>
            <span className="text-secondary block">Dibayar Oleh (Payer)</span>
            <strong className="text-foreground text-sm font-medium">{expense.paidBy}</strong>
          </div>
          <div>
            <span className="text-secondary block">Sumber Pendanaan</span>
            <strong className="text-foreground text-sm font-medium">
              {expense.fundingScope === "event_fund"
                ? `Dana Acara (${expense.accountName || "Rekening Acara"})`
                : "Pribadi Eksternal (Tidak memotong kas acara)"}
            </strong>
          </div>
          <div>
            <span className="text-secondary block">Dicatat Oleh (Recorder)</span>
            <strong className="text-foreground text-sm font-medium">{expense.recordedBy}</strong>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-4 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-secondary tracking-wider">
            Lampiran Bukti Transaksi
          </span>
          <div className="flex items-center justify-between rounded-control bg-ux-dock p-2.5 border border-border text-xs">
            <div className="flex items-center gap-2">
              <Icon name="link" size={16} className="text-primary" />
              <span className="font-medium text-foreground">
                {expense.proofName || "bukti-pembayaran.pdf"}
              </span>
            </div>
            <span className="text-[11px] text-secondary">Terverifikasi</span>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-4 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase text-secondary tracking-wider">
            Jejak Audit & Integritas
          </span>
          <ul className="text-xs text-secondary space-y-1.5 list-disc pl-4">
            <li>Versi catatan: v{expense.version}</li>
            <li>Idempotency & integritas terjamin, tidak dapat diedit tanpa jejak pembalikan</li>
            <li>Status rekening: debit alokasi terkonfirmasi</li>
          </ul>
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <Button variant="ghost" onClick={onClose} className="min-h-11 px-4">
            Tutup
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
