import type { PlanningMetricData } from "../types/overview";
import { SummaryCard } from "@/components/ui/summary-card";
import styles from "./overview.module.css";

type Props = {
  metrics: PlanningMetricData[];
};

export function OverviewMetrics({ metrics }: Props) {
  return (
    <section className={styles.metricsGrid} aria-label="Metrik perencanaan" role="region">
      {metrics.map((metric, index) => (
        <SummaryCard
          key={metric.id}
          label={metric.label}
          value={metric.value}
          detail={metric.detail}
          ornament={((index % 4) + 1) as 1 | 2 | 3 | 4}
          highlight={index === 0}
        />
      ))}
    </section>
  );
}
