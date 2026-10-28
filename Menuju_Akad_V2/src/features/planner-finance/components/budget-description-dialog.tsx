"use client";
import { Dialog } from "@/components/ui/dialog";
import type { CustomerBudget } from "../types/customer-budget";
import styles from "./budget-description-dialog.module.css";
import { budgetDescription } from "../domain/budget-description";
export function BudgetDescriptionDialog({
  item,
  close,
}: {
  item: CustomerBudget | null;
  close: () => void;
}) {
  const description = item ? budgetDescription(item) : null;
  return (
    <Dialog open={!!item} onClose={close} title="Deskripsi kebutuhan" className={styles.dialog}>
      <div className={styles.content}>
        <h3>{item?.title}</h3>
        <section
          aria-label="Informasi anggaran"
          className={`${styles.details} ${styles.information}`}
        >
          <h4>Informasi anggaran</h4>
          <dl>
            {description?.information.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section aria-label="Rincian kebutuhan" className={styles.details}>
          <h4>Rincian kebutuhan</h4>
          <dl>
            {description?.details.map(({ label, value }, index) => {
              return (
                <div key={index} className={label === "Harga total" ? styles.total : undefined}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
        </section>
        <section className={styles.notes} aria-label="Catatan">
          <h4>Catatan</h4>
          {description?.notes ? (
            <p>{description.notes}</p>
          ) : (
            <em className="italic text-secondary">Tidak ada catatan</em>
          )}
        </section>
      </div>
    </Dialog>
  );
}
