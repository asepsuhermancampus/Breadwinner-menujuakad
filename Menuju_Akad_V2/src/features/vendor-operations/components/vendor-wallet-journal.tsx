import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { vendorWalletJournal, type VendorWalletState } from "../domain/vendor-wallet";

export function VendorWalletJournal({ wallet }: { wallet: VendorWalletState }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-card border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-xs">
          <caption className="sr-only">Jurnal escrow dan pelepasan vendor</caption>
          <thead className="border-b border-border bg-canvas text-secondary">
            <tr>
              {["Tanggal", "Keterangan", "Bruto (Rp)", "Fee (Rp)", "Neto (Rp)"].map((label) => (
                <th scope="col" key={label} className="px-5 py-4 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendorWalletJournal.map((row) => (
              <tr key={row.id} className="border-b border-border">
                <td className="px-5 py-5">{row.date}</td>
                <th scope="row" className="px-5 py-5 font-normal">
                  {row.label}
                </th>
                <td className="px-5 py-5 font-mono">
                  {row.grossIdr ? formatIdr(row.grossIdr) : "—"}
                </td>
                <td className="px-5 py-5 font-mono">{row.feeIdr ? formatIdr(row.feeIdr) : "—"}</td>
                <td className="px-5 py-5 font-mono">{formatIdr(row.netIdr)}</td>
              </tr>
            ))}
            {wallet.requests.map((request) => (
              <tr key={request.id} className="border-b border-border">
                <td className="px-5 py-5">25 Okt</td>
                <th scope="row" className="px-5 py-5 font-normal">
                  {request.id} ·{" "}
                  {request.status === "unknown"
                    ? "status belum pasti"
                    : request.status === "accepted"
                      ? "permohonan diterima"
                      : request.status === "scheduled"
                        ? "terjadwal"
                        : "selesai"}
                </th>
                <td className="px-5 py-5">—</td>
                <td className="px-5 py-5">Rp 0</td>
                <td className="px-5 py-5 font-mono">
                  {formatIdr(-request.amountIdr)}
                  <span className="mt-1 block font-sans text-[10px] text-secondary">
                    Ditahan satu kali
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
