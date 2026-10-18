"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { DepositItem, ExpenseItem } from "../types/finance";
import { generateFinanceCsv } from "../utils/csv-helpers";

type Props = {
  open: boolean;
  onClose: () => void;
  deposits: DepositItem[];
  expenses: ExpenseItem[];
};

export function ExportReportDialog({ open, onClose, deposits, expenses }: Props) {
  const [includeDeposits, setIncludeDeposits] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const [includePrivateNotes, setIncludePrivateNotes] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = () => {
    const csvContent = generateFinanceCsv(deposits, expenses, {
      includeDeposits,
      includeExpenses,
      includePrivateNotes,
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `laporan-keuangan-menujuakad-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={open} onClose={onClose} title="Ekspor Laporan Keuangan">
      <div className="flex flex-col gap-4 p-5 max-w-md text-xs">
        <div>
          <h3 className="font-semibold text-foreground text-sm">Format Ekspor Standar UTF-8</h3>
          <p className="text-secondary mt-0.5">
            File CSV memakai pembatas titik koma (;) agar angka nominal IDR tidak terdistorsi di
            spreadsheet.
          </p>
        </div>

        <div className="rounded-card border border-border bg-surface p-4 flex flex-col gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeDeposits}
              onChange={(e) => setIncludeDeposits(e.target.checked)}
              className="size-4 accent-primary"
            />
            <span className="font-medium text-foreground">
              Sertakan Riwayat Setoran ({deposits.length} data)
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeExpenses}
              onChange={(e) => setIncludeExpenses(e.target.checked)}
              className="size-4 accent-primary"
            />
            <span className="font-medium text-foreground">
              Sertakan Buku Pengeluaran ({expenses.length} data)
            </span>
          </label>

          <div className="pt-2 border-t border-border">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={includePrivateNotes}
                onChange={(e) => setIncludePrivateNotes(e.target.checked)}
                className="size-4 accent-primary"
              />
              <div>
                <span className="font-medium text-foreground block">
                  Sertakan Catatan & Referensi Privat
                </span>
                <span className="text-[11px] text-secondary">
                  Default nonaktif untuk perlindungan privasi rekening keluarga.
                </span>
              </div>
            </label>
          </div>
        </div>

        {downloaded && (
          <div className="rounded-control bg-success-bg p-2.5 text-success font-medium text-center">
            File CSV berhasil diunduh!
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleExport} disabled={downloaded}>
            Unduh CSV (.csv)
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
