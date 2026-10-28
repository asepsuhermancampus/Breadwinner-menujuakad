import type { ReactNode } from "react";
import { CardOrnament } from "./card-ornament";
import styles from "./summary-card.module.css";

export function SummaryCard({
  label,
  value,
  detail,
  ornament = 1,
  highlight = false,
}: {
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
  ornament?: 1 | 2 | 3 | 4;
  highlight?: boolean;
}) {
  return (
    <article data-customer-card className={`${styles.card} ${highlight ? styles.highlight : ""}`}>
      <CardOrnament variant={ornament} />
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
      {detail && <small className={styles.detail}>{detail}</small>}
    </article>
  );
}
