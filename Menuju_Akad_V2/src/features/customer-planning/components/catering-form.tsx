"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { cateringCost, cateringMenuSchema, type CateringMenu } from "../domain/catering-menu";
import { CateringMenuPicker } from "./catering-menu-picker";
import { CateringMenuFields } from "./catering-menu-fields";
import styles from "./catering-form.module.css";
export function CateringForm({
  item,
  guests,
  save,
  cancel,
}: {
  item?: CateringMenu | undefined;
  guests: number;
  save: (items: CateringMenu[]) => Promise<boolean>;
  cancel: () => void;
}) {
  const [mode, setMode] = useState<"unit" | "package">(item?.mode ?? "unit");
  const empty = (): CateringMenu => ({
    id: item?.id ?? crypto.randomUUID(),
    title: "",
    portions: Math.max(1, Math.min(100000, guests)),
    unitCost: 0,
    category: "other",
    mode: "unit",
  });
  const [menus, setMenus] = useState<CateringMenu[]>(() => [
    item?.mode !== "package" && item ? item : empty(),
  ]);
  const [pack, setPack] = useState<CateringMenu>(() =>
    item?.mode === "package" ? item : { ...empty(), mode: "package", pricing: "total" },
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const drafts = mode === "package" ? [pack] : menus;
  function add(title: string, category: CateringMenu["category"]) {
    setMenus((current) => {
      if (title && current.some((entry) => entry.title === title && entry.category === category))
        return current;
      const next = { ...empty(), title, category };
      const blank = current.findIndex(
        (entry) => !entry.title && !entry.unitCost && !entry.vendor && !entry.notes,
      );
      return blank >= 0
        ? current.map((entry, index) => (index === blank ? next : entry))
        : [...current, next];
    });
  }
  return (
    <Dialog
      open
      title={item ? "Edit menu katering" : "Tambah menu katering"}
      onClose={() => {
        if (!pending) cancel();
      }}
    >
      <form
        className={styles.stack}
        onSubmit={async (event) => {
          event.preventDefault();
          if (pending) return;
          const parsed = cateringMenuSchema.array().min(1).max(100).safeParse(drafts);
          if (!parsed.success) {
            setError(
              "Periksa nama, porsi (1–100.000), dan harga (maksimal Rp 1.000.000.000). Maksimal 100 menu sekaligus.",
            );
            return;
          }
          setPending(true);
          setError("");
          try {
            if (!(await save(parsed.data)))
              setError("Belum tersimpan. Periksa batas percobaan atau muat ulang data terbaru.");
          } catch {
            setError("Menu belum tersimpan. Silakan coba lagi.");
          } finally {
            setPending(false);
          }
        }}
      >
        <fieldset disabled={pending} className={styles.stack}>
          <div className={styles.tabs} role="tablist" aria-label="Cara mencatat katering">
            {(["unit", "package"] as const).map((value) => (
              <Button
                key={value}
                role="tab"
                aria-selected={mode === value}
                variant={mode === value ? "primary" : "secondary"}
                onClick={() => setMode(value)}
              >
                {value === "unit" ? "Menu satuan" : "Paket vendor"}
              </Button>
            ))}
          </div>
          <p className={styles.hint}>
            {mode === "unit"
              ? "Pilih beberapa menu dari satu atau beberapa vendor, lalu sesuaikan harga masing-masing."
              : "Catat seluruh sajian vendor dalam satu paket. Pilih harga total paket atau harga per tamu."}
          </p>
          <p className={styles.estimate}>
            {guests > 0
              ? `Acuan kalkulator: ${guests.toLocaleString("id-ID")} tamu termasuk cadangan. Jumlah di bawah tetap bisa diubah sesuai penawaran vendor.`
              : "Atur jumlah tamu pada kalkulator atau isi jumlahnya langsung di bawah."}
          </p>
          {mode === "unit" && !item && <CateringMenuPicker selected={menus} add={add} />}
          {mode === "package" ? (
            <CateringMenuFields value={pack} change={setPack} />
          ) : (
            menus.map((menu, index) => (
              <section key={menu.id} className={styles.menu} aria-label={`Menu ${index + 1}`}>
                <div className={styles.row}>
                  <strong>Menu {index + 1}</strong>
                  {menus.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Hapus isian menu ${index + 1}`}
                      onClick={() => setMenus(menus.filter((entry) => entry.id !== menu.id))}
                    >
                      <Icon name="trash" size={16} />
                    </Button>
                  )}
                </div>
                <CateringMenuFields
                  value={menu}
                  change={(next) =>
                    setMenus(menus.map((entry) => (entry.id === menu.id ? next : entry)))
                  }
                />
              </section>
            ))
          )}
          <div className={styles.total}>
            <span>Total biaya{mode === "package" ? " paket" : " menu"}</span>
            <strong>
              Rp{" "}
              {drafts.reduce((sum, entry) => sum + cateringCost(entry), 0).toLocaleString("id-ID")}
            </strong>
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          <div className={styles.row}>
            <Button type="submit">
              {pending
                ? "Menyimpan..."
                : menus.length > 1 && mode === "unit"
                  ? `Simpan ${menus.length} menu`
                  : "Simpan"}
            </Button>
            <Button variant="secondary" onClick={cancel}>
              Batal
            </Button>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
