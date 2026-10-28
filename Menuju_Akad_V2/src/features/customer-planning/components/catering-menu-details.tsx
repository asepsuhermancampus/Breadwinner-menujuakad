"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cateringCost, type CateringMenu } from "../domain/catering-menu";
import { cateringCategories } from "../domain/catering-catalog";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import styles from "./catering-menu-card.module.css";
import layout from "./catering-workspace.module.css";
const rupiah = (amount: number) => `Rp ${amount.toLocaleString("id-ID")}`;
export function CateringMenuDetails({
  item,
  budget,
  loading,
  error,
  edit,
  remove,
}: {
  item: CateringMenu;
  budget?: CustomerBudget | undefined;
  loading: boolean;
  error: string;
  edit: (item: CateringMenu) => void;
  remove: (item: CateringMenu) => void;
}) {
  const packaged = item.mode === "package";
  const fixed = packaged && item.pricing === "total";
  const category = packaged
    ? "Paket vendor"
    : (cateringCategories.find((entry) => entry.id === item.category)?.label ?? "Menu satuan");
  const rows = [
    [
      "Tenggat pembayaran",
      (item.dueDate ?? budget?.dueDate)
        ? new Date(`${item.dueDate ?? budget?.dueDate}T00:00:00+07:00`).toLocaleDateString(
            "id-ID",
            { timeZone: "Asia/Jakarta", day: "numeric", month: "short", year: "numeric" },
          )
        : "Belum ditentukan",
    ],
    ["Kategori sajian", category],
    ["Vendor", item.vendor || "Belum diisi"],
    [
      packaged ? "Jumlah tamu paket" : "Jumlah porsi",
      `${item.portions.toLocaleString("id-ID")} ${packaged ? "orang" : "porsi"}`,
    ],
    [
      fixed ? "Harga total paket" : packaged ? "Harga per tamu" : "Harga per porsi",
      rupiah(item.unitCost),
    ],
    [
      "Perhitungan harga",
      fixed
        ? "Satu harga untuk seluruh paket"
        : `${item.portions.toLocaleString("id-ID")} ${packaged ? "tamu" : "porsi"} × ${rupiah(item.unitCost)}`,
    ],
  ];
  return (
    <article className={styles.menu} aria-label={`Menu tersimpan: ${item.title}`}>
      <header className={styles.menuHeader}>
        <div className={styles.identity}>
          <span className={styles.category}>{category}</span>
          <h3>{item.title}</h3>
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit menu ${item.title}`}
            onClick={() => edit(item)}
          >
            <Icon name="pencil" size={15} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={styles.delete}
            aria-label={`Hapus menu ${item.title}`}
            onClick={() => remove(item)}
          >
            <Icon name="trash" size={15} />
          </Button>
        </div>
      </header>
      <dl className={layout.details}>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      {(item.includedMenus || item.notes) && (
        <div className={layout.description}>
          {item.includedMenus && (
            <div>
              <h4>Sajian dalam paket</h4>
              <p>{item.includedMenus}</p>
            </div>
          )}
          {item.notes && (
            <div>
              <h4>Catatan</h4>
              <p>{item.notes}</p>
            </div>
          )}
        </div>
      )}
      <footer className={styles.menuTotal}>
        <span>Total {packaged ? "paket" : "menu"}</span>
        <strong>{rupiah(cateringCost(item))}</strong>
      </footer>
      <div className={layout.funding}>
        <div>
          <span>Status anggaran</span>
          <strong>
            {error
              ? "Status belum tersedia"
              : loading
                ? "Memuat status..."
                : budget?.completed
                  ? "Tercapai"
                  : "Belum tercapai"}
          </strong>
        </div>
        <p>
          {error ||
            "Kebutuhan ini masuk otomatis ke Anggaran. Pilihan sumber dana dan perubahan status dilakukan di sana."}
        </p>
        <Link href="/planner/finance?tab=anggaran&category=Katering">
          Buka anggaran katering <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    </article>
  );
}
