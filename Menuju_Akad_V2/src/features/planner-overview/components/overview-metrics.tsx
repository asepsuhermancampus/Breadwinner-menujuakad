import type { PlanningMetricData } from "../types/overview";
import styles from "./overview.module.css";

type Props = {
  metrics: PlanningMetricData[];
};

export function OverviewMetrics({ metrics }: Props) {
  return (
    <section className={styles.metricsGrid} aria-label="Metrik perencanaan" role="region">
      {metrics.map((metric) => (
        <article key={metric.id} className={styles.metricCard}>
          <span className="text-xs font-medium text-secondary">{metric.label}</span>
          <span
            className={`text-[26px] font-medium tracking-[-0.8px] text-primary ${metric.isMono ? "font-mono" : ""}`}
          >
            {metric.value}
          </span>
          <span className="text-xs text-secondary">{metric.detail}</span>
        </article>
      ))}
    </section>
  );
}
