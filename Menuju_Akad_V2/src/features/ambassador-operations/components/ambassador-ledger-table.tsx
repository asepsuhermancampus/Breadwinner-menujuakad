import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import type { AmbassadorState } from "../types/ambassador";

const programs = { historical: "Historis", couple: "Paket pasangan", vendor: "Rekrut vendor" };
const statuses = {
  available: "Tervalidasi",
  pending: "Menunggu validasi",
  held: "Ditahan · sengketa",
};
export function AmbassadorLedgerTable({ state }: { state: AmbassadorState }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-xs">
          <caption className="sr-only">Jurnal komisi lintas program</caption>
          <thead className="border-b border-border bg-canvas text-secondary">
            <tr>
              {["Tanggal", "Sumber / referensi", "Program", "Komisi", "Status"].map((label) => (
                <th key={label} scope="col" className="px-5 py-4 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.commissions.map((row) => (
              <tr key={row.id} className="border-b border-border">
                <td className="px-5 py-5">{row.date}</td>
                <th scope="row" className="px-5 py-5 font-normal">
                  {row.label}
                </th>
                <td className="px-5 py-5">{programs[row.program]}</td>
                <td className="px-5 py-5 font-mono">
                  {row.program === "historical" ? "" : "+"}
                  {formatIdr(row.amountIdr)}
                </td>
                <td className="px-5 py-5">
                  <span className={row.status === "available" ? "text-success" : "text-warning"}>
                    {row.program === "historical" ? "Tersedia" : statuses[row.status]}
                  </span>
                </td>
              </tr>
            ))}
            {state.withdrawals.map((row) => (
              <tr key={row.id} className="border-b border-border">
                <td className="px-5 py-5">25 Okt</td>
                <th scope="row" className="px-5 py-5 font-normal">
                  {row.id}
                </th>
                <td className="px-5 py-5">Penarikan</td>
                <td className="px-5 py-5 font-mono">{formatIdr(-row.amountIdr)}</td>
                <td className="px-5 py-5">
                  {row.status === "unknown"
                    ? "Status belum pasti"
                    : row.status === "accepted"
                      ? "Permohonan diterima"
                      : row.status === "scheduled"
                        ? "Terjadwal"
                        : "Selesai"}
                  <span className="mt-1 block text-[10px] text-secondary">Penahanan satu kali</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
