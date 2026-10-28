"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cateringCost } from "../domain/catering-menu";
import { cateringCategories } from "../domain/catering-catalog";
import type { PlanningViewProps } from "../domain/planning-view";
import catering from "./planning-catering.module.css";
import styles from "./planning.module.css";
export function CateringSavedMenus({
  items,
  edit,
  remove,
}: Pick<PlanningViewProps, "items" | "edit" | "remove">) {
  const menus = items.filter((item) => "portions" in item);
  return (
    <section className={`${styles.card} ${catering.menus}`} aria-label="Daftar menu katering">
      <div className={styles.row}>
        <h2 className="text-sm font-semibold">Menu katering tersimpan</h2>
        <span className={catering.total}>
          <small>Total biaya katering</small>Rp{" "}
          {menus.reduce((sum, item) => sum + cateringCost(item), 0).toLocaleString("id-ID")}
        </span>
      </div>
      {menus.map((item) => (
        <div key={item.id} className={`${styles.check} ${catering.menu}`}>
          <div className={catering.description}>
            <small>
              {item.mode === "package"
                ? "Paket vendor"
                : (cateringCategories.find((entry) => entry.id === item.category)?.label ??
                  "Menu satuan")}
              {item.vendor ? ` · ${item.vendor}` : ""}
            </small>
            <strong>{item.title}</strong>
            <small>
              {item.portions.toLocaleString("id-ID")} {item.mode === "package" ? "tamu" : "porsi"}
              {item.mode === "package" && item.pricing === "total"
                ? " · Harga total paket"
                : ` × Rp ${item.unitCost.toLocaleString("id-ID")}`}
            </small>
            <strong className="mt-2 block font-mono">
              Rp {cateringCost(item).toLocaleString("id-ID")}
            </strong>
            {item.includedMenus && <small>Menu: {item.includedMenus}</small>}
            {item.notes && <small>{item.notes}</small>}
          </div>
          <div className={styles.actions}>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit menu ${item.title}`}
              onClick={() => edit(item)}
            >
              <Icon name="pencil" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-danger"
              aria-label={`Hapus menu ${item.title}`}
              onClick={() => remove(item)}
            >
              <Icon name="trash" size={16} />
            </Button>
          </div>
        </div>
      ))}
      {!menus.length && (
        <div className={styles.empty}>
          <Icon name="catering" size={28} className="mx-auto mb-3" />
          <p>Belum ada menu katering.</p>
          <p className="mt-1">
            Tambahkan menu satuan atau seluruh paket vendor melalui + Menu katering.
          </p>
        </div>
      )}
      <p className={styles.notice}>
        Pilih menu satuan untuk pesanan dari beberapa vendor, atau catat seluruh sajian sebagai
        paket. Jumlah tamu dan porsi yang disimpan mengikuti kesepakatan dengan vendor.
      </p>
    </section>
  );
}
