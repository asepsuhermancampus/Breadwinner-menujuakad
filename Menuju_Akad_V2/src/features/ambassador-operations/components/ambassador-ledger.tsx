import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { ambassadorBalances } from "../domain/ambassador-commissions";
import type { AmbassadorContext, AmbassadorState } from "../types/ambassador";
import { AmbassadorLedgerTable } from "./ambassador-ledger-table";
import { AmbassadorMetrics } from "./ambassador-metrics";

export function AmbassadorLedger({
  state,
  context,
  onWithdraw,
}: {
  state: AmbassadorState;
  context: AmbassadorContext;
  onWithdraw: () => void;
}) {
  const balances = ambassadorBalances(state);
  return (
    <div className="grid gap-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Komisi dapat ditelusuri.
          </h1>
          <p className="mt-3 text-sm text-secondary">
            1–25 Oktober 2026 · pendapatan lintas program tidak dicampur dengan GMV vendor.
          </p>
        </div>
        <Button
          disabled={!context.permissions.withdraw || !context.sessionValid}
          onClick={onWithdraw}
        >
          <Icon name="wallet" size={16} />
          Ajukan penarikan
        </Button>
      </header>
      <AmbassadorMetrics
        items={[
          {
            label: "Siap ditarik",
            value: balances.availableIdr,
            hint: "Saldo sebelumnya + komisi tervalidasi − penahanan",
          },
          {
            label: "Belum tersedia",
            value: balances.pendingIdr,
            hint: "Rp 150 rb validasi + Rp 150 rb sengketa",
          },
          {
            label: "Payout pada tampilan ini",
            value: balances.heldIdr,
            hint: balances.heldIdr
              ? "Dana ditahan; status mengikuti permohonan"
              : "Sebelum permohonan baru",
          },
        ]}
      />
      <AmbassadorLedgerTable state={state} />
      <div className="rounded-card border border-border bg-subtle p-5">
        <h2 className="text-sm font-semibold">Saldo tersedia {formatIdr(balances.availableIdr)}</h2>
        <p className="mt-2 text-xs leading-relaxed text-secondary">
          Rp 6.000.000 + Rp 250.000 + Rp 150.000
          {balances.heldIdr ? ` − ${formatIdr(balances.heldIdr)} ditahan` : ""}. Dua komisi vendor
          yang belum final tidak menambah saldo ini; pembalikan mengikuti referensi transaksi dan
          jejak audit.
        </p>
      </div>
      {!context.permissions.withdraw && (
        <p role="status" className="text-xs text-secondary">
          Izin penarikan dicabut. Histori komisi tidak dihapus.
        </p>
      )}
    </div>
  );
}
