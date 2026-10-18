import type { PlanningMetricData } from "../types/overview";
import styles from "./overview.module.css";

type Props = {
  metrics: PlanningMetricData[];
};

export function OverviewMetrics({ metrics }: Props) {
  return (
    <section className={styles.metricsGrid} aria-label="Metrik perencanaan">
      {metrics.map((metric) => (
        <article key={metric.id} className={styles.metricCard}>
          <span className="text-xs text-secondary">{metric.label}</span>
          <span
            className={`text-2xl font-semibold text-foreground ${metric.isMono ? "font-mono" : ""}`}
          >
            {metric.value}
          </span>
          <span className="text-xs text-secondary">{metric.detail}</span>
        </article>
      ))}
    </section>
  );
}
