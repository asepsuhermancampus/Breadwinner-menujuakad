import type { CSSProperties } from "react";
import styles from "./summary-card.module.css";

export function CardOrnament({ variant = 1 }: { variant?: 1 | 2 | 3 | 4 }) {
  return (
    <i
      aria-hidden="true"
      data-card-ornament={variant}
      className={styles.ornament}
      style={
        { "--ornament": `url("/assets/finance/ornaments/flower-${variant}.svg")` } as CSSProperties
      }
    />
  );
}
