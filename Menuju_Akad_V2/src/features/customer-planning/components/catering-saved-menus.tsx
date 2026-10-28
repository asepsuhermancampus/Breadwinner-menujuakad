"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { cateringCost } from "../domain/catering-menu";
import type { PlanningViewProps } from "../domain/planning-view";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { CateringMenuDetails } from "./catering-menu-details";
import styles from "./catering-saved-menus.module.css";
import layout from "./catering-workspace.module.css";
export function CateringSavedMenus({
  items,
  edit,
  remove,
  budgets,
  budgetError,
}: Pick<PlanningViewProps, "items" | "edit" | "remove"> & {
  budgets: CustomerBudget[] | null;
  budgetError: string;
}) {
  const menus = items.filter((item) => "portions" in item);
  const ids = menus.map((item) => item.id);
  const [previousIds, setPreviousIds] = useState(ids);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  if (JSON.stringify(ids) !== JSON.stringify(previousIds)) {
    setPreviousIds(ids);
    const added = menus.find((item) => !previousIds.includes(item.id));
    if (added) setSelectedId(added.id);
  }
  const selected = menus.find((item) => item.id === selectedId) ?? menus[0];
  const budget = budgets?.find(
    (item) => item.source?.kind === "catering" && item.source.id === selected?.id,
  );
  return (
    <section className={layout.workspace} aria-label="Daftar menu katering">
      <section className={styles.panel} aria-label="Pilihan menu katering">
        <header className={styles.heading}>
          <div>
            <span className={styles.eyebrow}>Pilihan sajian kalian</span>
            <h2>Menu katering tersimpan</h2>
            <p>
              {menus.length
                ? menus.length + " menu atau paket tercatat"
                : "Susun sajian untuk hari istimewa kalian."}
            </p>
          </div>
          <span className={styles.headingIcon} aria-hidden="true">
            <Icon name="catering" size={24} />
          </span>
        </header>
        <div className={layout.names}>
          {menus.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected?.id === item.id}
              onClick={() => setSelectedId(item.id)}
            >
              {item.title}
            </button>
          ))}
          {!menus.length && (
            <div className={styles.empty}>
              <Icon name="catering" size={30} />
              <h3>Belum ada menu katering</h3>
              <p>
                Gunakan tombol + Menu katering untuk mencatat menu satuan atau satu paket vendor.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className={layout.detailPanel} aria-label="Detail menu katering">
        <h2>Detail menu katering</h2>
        <div className={layout.total}>
          <span>Total biaya katering</span>
          <strong>
            Rp {menus.reduce((sum, item) => sum + cateringCost(item), 0).toLocaleString("id-ID")}
          </strong>
        </div>
        {selected ? (
          <CateringMenuDetails
            item={selected}
            budget={budget}
            loading={budgets === null}
            error={budgetError}
            edit={edit}
            remove={remove}
          />
        ) : (
          <div className={styles.empty}>
            <Icon name="catering" size={30} />
            <h3>Detail sajian akan tampil di sini</h3>
            <p>Tambahkan menu, lalu pilih namanya di sebelah kiri untuk melihat rincian.</p>
          </div>
        )}
      </section>
    </section>
  );
}
