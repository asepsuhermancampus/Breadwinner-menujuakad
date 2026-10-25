"use client";

import type { AllocationAccount, FundingScope } from "../types/finance";
import { formatRupiah } from "../utils/finance-calc";

type ScopeProps = {
  fundingScope: FundingScope;
  setFundingScope: (scope: FundingScope) => void;
  accountId: string;
  setAccountId: (id: string) => void;
  accounts: AllocationAccount[];
};

export function ExpenseFundingScopeField({
  fundingScope,
  setFundingScope,
  accountId,
  setAccountId,
  accounts,
}: ScopeProps) {
  return (
    <>
      <div className="grid min-w-0 gap-2">
        <label className="text-sm font-medium">Sumber Pendanaan</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`p-2.5 text-xs text-left rounded-control border transition-all ${
              fundingScope === "event_fund"
                ? "border-primary bg-primary/5 text-primary font-semibold"
                : "border-border bg-surface text-secondary"
            }`}
            onClick={() => setFundingScope("event_fund")}
          >
            <strong className="block">Dana Acara</strong>
            <span className="text-[11px] opacity-80">Mengurangi saldo kas</span>
          </button>
          <button
            type="button"
            className={`p-2.5 text-xs text-left rounded-control border transition-all ${
              fundingScope === "external_private"
                ? "border-primary bg-primary/5 text-primary font-semibold"
                : "border-border bg-surface text-secondary"
            }`}
            onClick={() => setFundingScope("external_private")}
          >
            <strong className="block">Pribadi Eksternal</strong>
            <span className="text-[11px] opacity-80">Kas acara tidak berkurang</span>
          </button>
        </div>
      </div>

      {fundingScope === "event_fund" && (
        <div className="grid min-w-0 gap-2">
          <label className="text-sm font-medium">Rekening Alokasi Pembayar</label>
          <select
            className="w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.bank} {a.maskedNumber} · Saldo: {formatRupiah(a.currentBalance)})
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}

type ProjectionProps = {
  projectedExpenses: number;
  projectedCash: number;
  fundingScope: FundingScope;
  selectedAccount?: AllocationAccount | undefined;
};

export function ExpenseProjectionCard({
  projectedExpenses,
  projectedCash,
  fundingScope,
  selectedAccount,
}: ProjectionProps) {
  return (
    <div className="rounded-card bg-ux-dock p-3.5 border border-border flex flex-col gap-1 text-xs">
      <div className="flex justify-between">
        <span className="text-secondary">Proyeksi Realisasi Biaya:</span>
        <strong className="font-mono text-foreground">{formatRupiah(projectedExpenses)}</strong>
      </div>
      <div className="flex justify-between">
        <span className="text-secondary">Proyeksi Sisa Dana Acara:</span>
        <strong
          className={`font-mono font-semibold ${fundingScope === "event_fund" ? "text-primary" : "text-success"}`}
        >
          {formatRupiah(projectedCash)}
        </strong>
      </div>
      <span className="text-[11px] text-secondary italic mt-0.5">
        {fundingScope === "event_fund"
          ? `Biaya memotong saldo ${selectedAccount?.name}`
          : "Biaya pribadi di luar alokasi acara; saldo kas tetap utuh."}
      </span>
    </div>
  );
}
