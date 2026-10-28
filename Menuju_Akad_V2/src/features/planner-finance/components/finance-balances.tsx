import type { FinanceSnapshot } from "../types/finance-ledger";
import { formatRupiah } from "../domain/rupiah";
import styles from "./finance-balances.module.css";
import { savingsName } from "../domain/savings-name";
import { FinanceCardOrnament } from "./finance-card-ornament";

export function FinanceBalances({
  snapshot,
  ornaments = false,
}: {
  snapshot: FinanceSnapshot;
  ornaments?: boolean;
}) {
  return (
    <section className={styles.grid} aria-label="Saldo tabungan tersedia">
      <article className={styles.total}>
        {ornaments && <FinanceCardOrnament variant={3} />}
        <span>Total tabungan tersedia</span>
        <strong>{formatRupiah(snapshot.balances.total)}</strong>
        <small>Gabungan saldo tabungan kalian</small>
      </article>
      <article>
        {ornaments && <FinanceCardOrnament variant={1} />}
        <span>Tabungan {savingsName(snapshot, "groom", true)}</span>
        <strong>{formatRupiah(snapshot.balances.groom)}</strong>
        <small>
          {snapshot.members.find((member) => member.side === "groom")?.actorName ??
            "Belum dihubungkan"}
        </small>
      </article>
      <article>
        {ornaments && <FinanceCardOrnament variant={4} />}
        <span>Tabungan {savingsName(snapshot, "bride", true)}</span>
        <strong>{formatRupiah(snapshot.balances.bride)}</strong>
        <small>
          {snapshot.members.find((member) => member.side === "bride")?.actorName ??
            "Belum dihubungkan"}
        </small>
      </article>
    </section>
  );
}
