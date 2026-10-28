import { summarizeBudgets } from "../domain/customer-budget";
import type { CustomerBudget } from "../types/customer-budget";
import type { FinanceConnection } from "../types/finance-connection";
import styles from "./finance-balances.module.css";
import { FinanceCardOrnament } from "./finance-card-ornament";

const money = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
export function CustomerFinanceSummary({
  items,
  finance,
}: {
  items: CustomerBudget[];
  finance: FinanceConnection | undefined;
}) {
  const summary = summarizeBudgets(items);
  return (
    <section className={styles.grid} aria-label="Ringkasan target anggaran">
      <article className={styles.total}>
        <FinanceCardOrnament variant={2} />
        <span>Total target</span>
        <strong>{money(summary.totalTarget)}</strong>
        <small>{summary.total} pos anggaran</small>
      </article>
      <article>
        <FinanceCardOrnament variant={4} />
        <span>Target belum tercapai</span>
        <strong>{money(summary.pendingTarget)}</strong>
        <small>{summary.pending} pos masih perlu dikumpulkan</small>
      </article>
      <article>
        <FinanceCardOrnament variant={1} />
        <span>Anggaran tercapai</span>
        <strong>
          {summary.achieved} dari {summary.total}
        </strong>
        <small>{finance ? "Anggaran yang ditandai tercapai" : "Target dana sudah terkumpul"}</small>
      </article>
    </section>
  );
}
