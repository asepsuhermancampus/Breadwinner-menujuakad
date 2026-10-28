import styles from "./page-skeleton.module.css";

export function PageSkeleton({
  variant = "list",
  label = "Memuat data akun",
}: {
  variant?: "list" | "cards" | "calendar" | "form";
  label?: string;
}) {
  const cards = variant === "cards" || variant === "form";
  return (
    <div role="status" aria-label={label} className={styles.loading}>
      <span className="sr-only">{label}…</span>
      <div aria-hidden="true" className={styles.content}>
        <div className={styles.header}>
          <span className={`${styles.placeholder} ${styles.title}`} />
          <span className={`${styles.placeholder} ${styles.button}`} />
        </div>
        <div className={styles.summary}>
          <span className={`${styles.placeholder} ${styles.label}`} />
          <span className={`${styles.placeholder} ${styles.progress}`} />
        </div>
        <div className={styles.header}>
          <span className={`${styles.placeholder} ${styles.filters}`} />
          <span className={`${styles.placeholder} ${styles.search}`} />
        </div>
        {variant === "calendar" ? (
          <div className={styles.calendar}>
            {Array.from({ length: 28 }, (_, index) => (
              <span key={index} className={`${styles.placeholder} ${styles.day}`} />
            ))}
          </div>
        ) : cards ? (
          <div className={styles.cards}>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className={styles.card}>
                <span className={`${styles.placeholder} ${styles.preview}`} />
                <span className={`${styles.placeholder} ${styles.label}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.list}>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className={styles.row}>
                <span className={`${styles.placeholder} ${styles.checkbox}`} />
                <span className={`${styles.placeholder} ${styles.task}`} />
                <span className={`${styles.placeholder} ${styles.badge}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
