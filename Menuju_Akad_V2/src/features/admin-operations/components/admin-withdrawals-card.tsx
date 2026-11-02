"use client";

import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";

type Withdrawal = {
  id: string;
  account_id: string;
  amount_idr: number;
  bank_last4: string;
  status: string;
  created_at: string;
};

export function AdminWithdrawalsCard({ withdrawals }: { withdrawals: Withdrawal[] }) {
  if (!withdrawals.length) return null;
  return (
    <section className="rounded-card border border-ux-border bg-surface p-5 shadow-xs">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-foreground">Pengajuan Penarikan Dana Mitra (BA & Vendor)</h2>
        <p className="text-xs text-secondary">Daftar permohonan pencairan komisi yang menunggu transfer bank.</p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-ux-border bg-canvas/40 text-[11px] font-semibold text-secondary uppercase">
            <tr>
              <th className="px-3 py-2">ID Operasi</th>
              <th className="px-3 py-2">Akun Mitra</th>
              <th className="px-3 py-2">Nominal</th>
              <th className="px-3 py-2">Rekening Akhir</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Waktu Pengajuan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ux-border">
            {withdrawals.map((w) => (
              <tr key={w.id} className="hover:bg-subtle/50">
                <td className="px-3 py-2.5 font-mono text-[11px] text-foreground">{w.id}</td>
                <td className="px-3 py-2.5 font-mono text-[11px] text-secondary">{w.account_id}</td>
                <td className="px-3 py-2.5 font-semibold text-primary">{formatIdr(w.amount_idr)}</td>
                <td className="px-3 py-2.5 font-mono">•••• {w.bank_last4}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-block rounded px-2 py-0.5 text-[10px] font-semibold uppercase bg-warning-bg text-warning">
                    {w.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-secondary">{new Date(w.created_at).toLocaleDateString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

