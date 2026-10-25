"use client";

import type { CsvRowItem } from "../utils/csv-helpers";
import { formatRupiah } from "../utils/finance-calc";

type Props = {
  rows: CsvRowItem[];
  onToggleSelect: (rowNumber: number) => void;
  onFixDate: (rowNumber: number) => void;
};

export function CsvPreviewTable({ rows, onToggleSelect, onFixDate }: Props) {
  return (
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
                  onChange={() => onToggleSelect(r.rowNumber)}
                  className="size-4 accent-primary cursor-pointer"
                />
              </td>
              <td className="p-2.5 font-mono">
                <span className={r.status === "invalid_date" ? "text-danger font-semibold" : ""}>
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
                      onClick={() => onFixDate(r.rowNumber)}
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
  );
}
