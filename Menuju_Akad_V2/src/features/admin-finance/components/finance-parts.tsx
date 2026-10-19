import type { ReactNode } from "react";
import styles from "./finance.module.css";

export function FinanceHeader({
  title,
  detail,
  action,
}: {
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{detail}</p>
      </div>
      {action}
    </header>
  );
}
export function FinanceCard({
  title,
  children,
  flat = false,
}: {
  title: string;
  children: ReactNode;
  flat?: boolean;
}) {
  return (
    <section className={`${styles.card} ${flat ? styles.flat : ""}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
export function FinanceMetrics({
  items,
}: {
  items: { label: string; value: string; detail: string }[];
}) {
  return (
    <div className={styles.metrics}>
      {items.map((item) => (
        <div className={styles.metric} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <p>{item.detail}</p>
        </div>
      ))}
    </div>
  );
}
export function FinanceTable({
  headers,
  rows,
  label,
}: {
  headers: string[];
  rows: ReactNode[][];
  label: string;
}) {
  return (
    <div className={styles.tableWrap}>
      <table aria-label={label} className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={`${index}:${header}`} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, column) => (
                <td key={column}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function FinanceCheck({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className={styles.check}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}
export function FinanceNote({ children }: { children: ReactNode }) {
  return <div className={styles.note}>{children}</div>;
}
