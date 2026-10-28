import type { CSSProperties } from "react";
import styles from "./finance-balances.module.css";

export function FinanceCardOrnament({ variant }: { variant: 1 | 2 | 3 | 4 }) {
  const style = {
    "--ornament": `url("/assets/finance/ornaments/flower-${variant}.svg")`,
  } as CSSProperties;
  return (
    <i
      aria-hidden="true"
      data-finance-ornament={variant}
      className={styles.ornament}
      style={style}
    />
  );
}
