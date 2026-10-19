"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { createVendorWallet, vendorAvailable, type WalletWorkspace } from "../domain/vendor-wallet";
import type { VendorContext, VendorResult, VendorWorkspace } from "../types/vendor";
import { VendorPayout } from "./vendor-payout";
import { VendorWalletJournal } from "./vendor-wallet-journal";

export function VendorWallet({
  state,
  context,
  onResult,
}: {
  state: VendorWorkspace;
  context: VendorContext;
  onResult: (result: VendorResult) => void;
}) {
  const [review, setReview] = useState(false);
  const scoped = state as WalletWorkspace;
  const wallet = scoped.wallet ?? createVendorWallet();
  const available = vendorAvailable(wallet);
  const held = wallet.requests.reduce((sum, item) => sum + item.amountIdr, 0);
  const metrics = [
    ["Saldo siap dicairkan", available, "Bukan seluruh dana yang sedang ditahan"],
    ["Dana ditahan escrow", wallet.escrowIdr, "Masih mengikuti layanan / resolusi"],
    ["Fee pada pelepasan periode ini", 1_000_000, "5% dari Rp 20.000.000 bruto"],
  ] as const;
  return (
    <div className="grid gap-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Dana jelas. Pencairan terkendali.
          </h1>
          <p className="mt-3 text-sm text-secondary">
            Saldo contoh sebelum permohonan baru · hanya rekening aktif yang terverifikasi.
          </p>
        </div>
        <Button
          disabled={!context.permissions.payoutRequest || !context.sessionValid}
          onClick={() => setReview(true)}
        >
          <Icon name="wallet" size={16} />
          Ajukan pencairan
        </Button>
      </header>
      <div className="grid gap-8 border-b border-border pb-5 md:grid-cols-3">
        {metrics.map(([label, amount, hint]) => (
          <section key={label} className="py-2">
            <h2 className="text-xs text-secondary">{label}</h2>
            <p className="mt-3 font-mono text-[28px]">{formatIdr(amount)}</p>
            <p className="mt-2 text-xs leading-relaxed text-secondary">{hint}</p>
          </section>
        ))}
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <VendorWalletJournal wallet={wallet} />
        <aside className="rounded-card bg-subtle p-6">
          <h2 className="text-[22px] font-semibold">Perhitungan tersedia</h2>
          <dl className="mt-5 grid gap-5 text-[13px]">
            {[
              ["Pelepasan bruto", 20_000_000],
              ["Fee platform", -1_000_000],
              ["Payout selesai", -500_000],
              ...(held ? [["Ditahan permohonan", -held]] : []),
              ["Tersedia saat ini", available],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-secondary">{label}</dt>
                <dd className="mt-2 font-mono text-lg">{formatIdr(Number(value))}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
      <footer className="border-t border-border py-4">
        <h2 className="text-sm font-semibold">
          Tujuan aktif: {state.kyb.verifiedBank.bankName} •••• {state.kyb.verifiedBank.last4}
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          Permohonan belum berarti transfer. Saldo ditahan saat permohonan diterima, lalu status
          diperbarui setelah konfirmasi bank/provider. Usulan rekening baru tetap tidak digunakan.
        </p>
      </footer>
      {!context.permissions.payoutRequest && (
        <p role="status" className="text-xs text-secondary">
          Izin pengajuan pencairan dicabut; saldo dan histori tetap tersedia sesuai akses.
        </p>
      )}
      {review && (
        <VendorPayout
          state={scoped}
          context={context}
          onResult={onResult}
          onClose={() => setReview(false)}
        />
      )}
    </div>
  );
}
