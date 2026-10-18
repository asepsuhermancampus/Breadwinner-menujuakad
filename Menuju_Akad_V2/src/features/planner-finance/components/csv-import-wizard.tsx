"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { ExpenseItem } from "../types/finance";
import { type CsvRowItem, parseCsvRows } from "../utils/csv-helpers";
import { formatRupiah } from "../utils/finance-calc";

type Props = {
  open: boolean;
  onClose: () => void;
  onImportComplete: (newExpenses: Omit<ExpenseItem, "id">[]) => void;
};

const initialSampleCsv = `tanggal;keterangan;nominal;kategori;pembayar
24 Okt 2026;Transport survei;500.000;Transportasi & lainnya;Andi
24 Okt 2026;Cetak undangan;750.000;Undangan;Risa
25 Okt 2026;Sampel souvenir;250.000;Souvenir;Andi
32 Okt 2026;Parkir survei;150.000;Transportasi & lainnya;Andi
05 Okt 2026;DP Venue Bumi Samami;15.000.000;Venue;Bersama`;

export function CsvImportWizard({ open, onClose, onImportComplete }: Props) {
  const step = 3; // review step for instant validation
  const [rows, setRows] = useState<CsvRowItem[]>(() => parseCsvRows(initialSampleCsv));
  const [fundingScope, setFundingScope] = useState<"event_fund" | "external_private">("event_fund");

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
    const toImport: Omit<ExpenseItem, "id">[] = selectedRows.map((r) => ({
      title: r.description,
      category: r.category,
      amount: r.amount,
      paidBy: (r.paidBy as "Andi" | "Risa" | "Bersama") || "Andi",
      fundingScope,
      accountName: fundingScope === "event_fund" ? "Dana Acara · BCA ••4821" : "Pribadi Eksternal",
      date: r.date,
      status: "lunas",
      proofName: "bukti-impor.csv",
      recordedBy: "Import CSV",
      version: 1,
    }));

    onImportComplete(toImport);
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

        <div className="rounded-card border border-border bg-surface overflow-hidden">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-ux-dock border-b border-border text-secondary uppercase font-semibold">
                <th className="p-2.5">Pilih</th>
                <th className="p-2.5">Tanggal</th>
                <th className="p-2.5">Deskripsi</th>
                <th className="p-2.5">Nominal</th>
                <th className="p-2.5">Status & Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.rowNumber} className="border-b border-border last:border-none">
                  <td className="p-2.5">
                    <input
                      type="checkbox"
                      checked={r.selected}
                      disabled={r.status === "invalid_date"}
                      onChange={() => handleToggleSelect(r.rowNumber)}
                      className="size-4 accent-primary cursor-pointer"
                    />
                  </td>
                  <td className="p-2.5 font-mono">
                    <span
                      className={r.status === "invalid_date" ? "text-danger font-semibold" : ""}
                    >
                      {r.date}
                    </span>
                  </td>
                  <td className="p-2.5 font-medium text-foreground">{r.description}</td>
                  <td className="p-2.5 font-mono">{formatRupiah(r.amount)}</td>
                  <td className="p-2.5">
                    {r.status === "invalid_date" ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-danger font-semibold">Salah format</span>
                        <button
                          type="button"
                          onClick={() => handleFixDate(r.rowNumber)}
                          className="px-2 py-0.5 rounded bg-primary text-canvas font-medium"
                        >
                          Perbaiki ke 24 Okt
                        </button>
                      </div>
                    ) : r.status === "duplicate" ? (
                      <span className="text-secondary italic">Duplikat EX-1001 (Dikecualikan)</span>
                    ) : (
                      <span className="text-success font-semibold">✓ {r.statusMessage}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
