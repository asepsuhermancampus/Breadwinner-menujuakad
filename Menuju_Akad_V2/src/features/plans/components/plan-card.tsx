import { Button } from "@/components/ui/button";
import type { PlanOption } from "../config/plan-options";
import type { PlanId } from "../types/plans";
import styles from "./plans.module.css";

export function PlanCard({
  option,
  actualPlan,
  onSelect,
}: {
  option: PlanOption;
  actualPlan: PlanId;
  onSelect: () => void;
}) {
  return (
    <section className={styles.card} data-plan={option.id}>
      <h2 className={styles.title}>
        {option.label}
        {actualPlan === option.id && <span className={styles.badge}>Aktif</span>}
        {option.id === "lifetime" && actualPlan !== "lifetime" && (
          <span className={styles.badge}>↗ Lifetime</span>
        )}
      </h2>
      <p className={styles.price}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(option.priceIdr)}
      </p>
      <p className={styles.copy}>{option.period}</p>
      <p className={`${styles.copy} mt-5`}>{option.description}</p>
      <ul className={styles.features}>
        {option.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <Button
        variant={option.id === "lifetime" ? "primary" : "secondary"}
        className={
          option.id === "lifetime" ? "bg-foreground text-white hover:bg-foreground/90" : ""
        }
        onClick={onSelect}
      >
        {option.action}
      </Button>
    </section>
  );
}
