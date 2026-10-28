"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";

type Props = {
  onApproveContract: () => void;
};

export function ContractReviewView({ onApproveContract }: Props) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="p-6 bg-surface rounded-2xl border border-border space-y-5 shadow-sm">
      <div className="flex flex-wrap justify-between items-start gap-2 pb-3 border-b border-border">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
            Tinjauan Kontrak Jasa · ORD-SIM-204/v9
          </span>
          <h2 className="text-xl font-bold text-foreground mt-0.5">
            Perjanjian Kerja Sama Vendor Pernikahan
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Andi Ramadhan & Risa Pratiwi · 14 Feb 2027 · Bumi Samami, Bandung (Akad 08.00–09.00 ·
            Resepsi 10.00–14.00 WIB)
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-brand-secondary font-mono text-xs font-bold">
          Kontrak Draf v9
        </span>
      </div>

      <div className="overflow-x-auto border border-border rounded-xl text-xs">
        <table className="w-full text-left">
          <thead className="bg-subtle text-secondary font-semibold border-b border-border">
            <tr>
              <th className="p-3">Item Layanan</th>
              <th className="p-3">Nilai Kontrak</th>
              <th className="p-3">DP 30% Terkait</th>
              <th className="p-3">Ruang Lingkup & Kru</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-3 font-semibold text-foreground">Aru MUA · Paket Akad</td>
              <td className="p-3 font-mono">{formatIdr(8000000)}</td>
              <td className="p-3 font-mono text-brand-secondary font-bold">{formatIdr(2400000)}</td>
              <td className="p-3 text-secondary">
                Rias akad mempelai & 2 ibu · standby 04.30–08.00
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-semibold text-foreground">Lensa Teduh · Foto 8 Jam</td>
              <td className="p-3 font-mono">{formatIdr(15000000)}</td>
              <td className="p-3 font-mono text-brand-secondary font-bold">{formatIdr(4500000)}</td>
              <td className="p-3 text-secondary">
                2 fotografer · liputan akad & resepsi · galeri digital
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-3 font-semibold text-foreground">Rona Dekor · Cypress Style</td>
              <td className="p-3 font-mono">{formatIdr(12000000)}</td>
              <td className="p-3 font-mono text-brand-secondary font-bold">{formatIdr(3600000)}</td>
              <td className="p-3 text-secondary">
                Dekorasi pelaminan 8m · pergola masuk & floral table
              </td>
            </tr>
            <tr className="bg-canvas font-bold">
              <td className="p-3 text-foreground">Total Nilai Kontrak</td>
              <td className="p-3 font-mono text-base text-foreground">{formatIdr(35000000)}</td>
              <td className="p-3 font-mono text-base text-brand-secondary">
                {formatIdr(10500000)}
              </td>
              <td className="p-3 text-muted font-normal text-[11px]">3 vendor disetujui</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-canvas rounded-xl border border-border space-y-3">
        <div className="text-xs font-bold text-foreground uppercase tracking-wider">
          Jadwal Pembayaran & Termin
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-surface rounded-lg border border-primary/30">
            <div className="text-brand-secondary font-bold">DP 30% (Tagihan 1)</div>
            <div className="font-mono text-sm font-bold text-foreground mt-0.5">
              {formatIdr(10500000)}
            </div>
            <div className="text-[11px] text-secondary mt-0.5">Saat persetujuan kontrak</div>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-border">
            <div className="font-semibold text-secondary">Termin 2 · 40%</div>
            <div className="font-mono text-sm font-bold text-foreground mt-0.5">
              {formatIdr(14000000)}
            </div>
            <div className="text-[11px] text-secondary mt-0.5">Jatuh tempo 15 Jan 2027</div>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-border">
            <div className="font-semibold text-secondary">Pelunasan · 30%</div>
            <div className="font-mono text-sm font-bold text-foreground mt-0.5">
              {formatIdr(10500000)}
            </div>
            <div className="text-[11px] text-secondary mt-0.5">Jatuh tempo 07 Feb 2027</div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-subtle border border-border rounded-control text-xs text-secondary leading-relaxed">
        <strong>Ketentuan Escrow & Pembatalan:</strong> Dana DP disimpan di rekening escrow Menuju
        Akad dan dilepaskan ke vendor secara bertahap sesuai deliverable. Setelah kontrak ini
        disetujui, revisi apa pun akan membuat versi baru dan memerlukan kesepakatan tertulis ulang.
      </div>

      <label className="flex items-start gap-2 text-xs text-foreground cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          Saya memahami dan menyetujui seluruh ruang lingkup pekerjaan, jadwal termin pembayaran,
          serta klausul kontrak tiap item di atas.
        </span>
      </label>

      <div className="flex justify-end pt-3 border-t border-border">
        <Button variant="primary" disabled={!agreed} onClick={onApproveContract}>
          Setujui Kontrak & Lanjut ke Pembayaran ({formatIdr(10500000)}) →
        </Button>
      </div>
    </div>
  );
}
