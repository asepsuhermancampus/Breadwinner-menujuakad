"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { AllocationAccount, ExpenseItem } from "../types/finance";
import { type CsvRowItem, parseCsvRows } from "../utils/csv-helpers";
import { formatRupiah } from "../utils/finance-calc";
import { CsvPreviewTable } from "./csv-preview-table";

type Props = {
  open: boolean;
  onClose: () => void;
  accounts?: AllocationAccount[];
  onImportComplete: (
    newExpenses: Omit<ExpenseItem, "id">[],
  ) => { success?: boolean; error?: string } | void;
};

const initialSampleCsv = `tanggal;keterangan;nominal;kategori;pembayar
24 Okt 2026;Transport survei;500.000;Transportasi & lainnya;Andi
24 Okt 2026;Cetak undangan;750.000;Undangan;Risa
25 Okt 2026;Sampel souvenir;250.000;Souvenir;Andi
32 Okt 2026;Parkir survei;150.000;Transportasi & lainnya;Andi
05 Okt 2026;DP Venue Bumi Samami;15.000.000;Venue;Bersama`;

export function CsvImportWizard({ open, onClose, accounts = [], onImportComplete }: Props) {
  const step = 3; // review step for instant validation
  const [rows, setRows] = useState<CsvRowItem[]>(() => parseCsvRows(initialSampleCsv));
  const [fundingScope, setFundingScope] = useState<"event_fund" | "external_private">("event_fund");
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || "acc-1");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFixDate = (rowNumber: number) => {
    setRows((prev) =>
      prev.map((r) =>
        r.rowNumber === rowNumber
          ? {
              ...r,
              date: "24 Okt 2026",
              status: "valid",
              statusMessage: "Valid (Diperbaiki)",
              selected: true,
            }
          : r,
      ),
    );
  };

  const handleToggleSelect = (rowNumber: number) => {
    setRows((prev) =>
      prev.map((r) => (r.rowNumber === rowNumber ? { ...r, selected: !r.selected } : r)),
    );
  };

  const selectedRows = rows.filter((r) => r.selected && r.status === "valid");
  const totalSelected = selectedRows.reduce((s, r) => s + r.amount, 0);

  const handleConfirm = () => {
    const targetAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];
    if (
      fundingScope === "event_fund" &&
      targetAccount &&
      targetAccount.currentBalance < totalSelected
    ) {
      setErrorMessage(
        `Saldo ${targetAccount.name} tidak mencukupi untuk impor total ${formatRupiah(totalSelected)}. Pengoperasian dibatalkan.`,
      );
      return;
    }
    const toImport: Omit<ExpenseItem, "id">[] = selectedRows.map((r) => ({
      title: r.description,
      category: r.category,
      amount: r.amount,
      paidBy: (r.paidBy as "Andi" | "Risa" | "Bersama") || "Andi",
      fundingScope,
      accountId: fundingScope === "event_fund" ? targetAccount?.id : undefined,
      accountName:
        fundingScope === "event_fund" && targetAccount
          ? `${targetAccount.bank} ${targetAccount.maskedNumber}`
          : "Pribadi Eksternal",
      date: r.date,
      status: "lunas",
      proofName: "bukti-impor.csv",
      recordedBy: "Import CSV",
      version: 1,
    }));

    const res = onImportComplete(toImport);
    if (res && typeof res === "object" && !res.success) {
      setErrorMessage(res.error || "Gagal mengimpor pengeluaran.");
      return;
    }
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} title="Impor Data Pengeluaran CSV">
      <div className="flex flex-col gap-4 p-5 max-w-2xl text-xs">
        <div>
          <h3 className="font-semibold text-foreground text-sm">
            Pratinjau pengeluaran.csv ({rows.length} baris)
          </h3>
          <p className="text-secondary mt-0.5">
            Tidak ada data yang disimpan sebelum konfirmasi eksplisit Anda.
          </p>
        </div>

        {errorMessage && (
          <div className="rounded-control bg-danger/10 border border-danger/30 p-2.5 text-danger text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <div className="flex items-center gap-2 border-b border-border pb-3">
          <span className="font-semibold text-primary">
            Langkah {step} dari 3: Tinjau & Bandingkan
          </span>
          <span className="ml-auto text-secondary">
            {rows.filter((r) => r.status === "valid").length} valid ·{" "}
            {rows.filter((r) => r.status === "invalid_date").length} perbaikan ·{" "}
            {rows.filter((r) => r.status === "duplicate").length} duplikat
          </span>
        </div>

        <CsvPreviewTable
          rows={rows}
          onToggleSelect={handleToggleSelect}
          onFixDate={handleFixDate}
        />

        <div className="rounded-card bg-ux-dock p-3 border border-border flex flex-col gap-2">
          <span className="font-semibold text-foreground">Pemetaan Sumber Pendanaan Riil:</span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="importSource"
                checked={fundingScope === "event_fund"}
                onChange={() => setFundingScope("event_fund")}
                className="accent-primary"
              />
              <span>Dana Acara (Saldo kas berkurang {formatRupiah(totalSelected)})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="importSource"
                checked={fundingScope === "external_private"}
                onChange={() => setFundingScope("external_private")}
                className="accent-primary"
              />
              <span>Pribadi Eksternal (Kas acara tidak berkurang)</span>
            </label>
          </div>
          {fundingScope === "event_fund" && accounts.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-secondary text-xs">Rekening Pembebanan:</span>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="rounded-control border border-border bg-surface px-2 py-1 text-xs"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.bank} · Saldo: {formatRupiah(a.currentBalance)})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-secondary">
            Terpilih: <strong>{selectedRows.length} baris</strong> ({formatRupiah(totalSelected)})
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleConfirm} disabled={selectedRows.length === 0}>
              Konfirmasi Impor ({selectedRows.length} Transaksi)
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
