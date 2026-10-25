"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCommittedList } from "@/hooks/use-committed-list";
import styles from "./finance.module.css";
import layout from "./customer-finance.module.css";
import { CustomerBudgetTable } from "./customer-budget-table";
import type { CustomerBudget } from "../types/customer-budget";
export type { CustomerBudget } from "../types/customer-budget";
const money = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
export function CustomerFinance({
  initial,
  onChange,
}: {
  initial: CustomerBudget[];
  onChange: (items: CustomerBudget[]) => Promise<boolean>;
}) {
  const [items, update] = useCommittedList(initial, onChange);
  const [tab, setTab] = useState("Ringkasan");
  const [selected, setSelected] = useState<CustomerBudget | null | undefined>(undefined);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const total = items.reduce((sum, i) => sum + (i.amount ?? 0), 0);
  function edit(item: CustomerBudget | null) {
    setSelected(item);
    setTitle(item?.title ?? "");
    setAmount(String(item?.amount ?? ""));
    setNotes(item?.notes ?? "");
  }
  async function commit(next: CustomerBudget[]) {
    if (pending) return false;
    setPending(true);
    try {
      const ok = await update(next);
      setError(
        ok
          ? ""
          : "Perubahan belum tersimpan. Periksa batas percobaan atau muat ulang data terbaru.",
      );
      return ok;
    } finally {
      setPending(false);
    }
  }
  return (
    <section className={layout.container} aria-busy={pending}>
      <header className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Dana jelas, rencana tenang.</h1>
          <p className={styles.subtitle}>Rencanakan kebutuhan acara dari anggaran kalian.</p>
        </div>
        <Button onClick={() => edit(null)}>+ Catat anggaran</Button>
      </header>
      <div className={styles.tabsContainer} role="tablist" aria-label="Keuangan">
        {["Ringkasan", "Anggaran"].map((value) => (
          <button
            key={value}
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={`${styles.tabBtn} ${tab === value ? styles.tabBtnActive : ""}`}
          >
            {value}
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      {selected !== undefined && (
        <form
          className={layout.form}
          onSubmit={async (e) => {
            e.preventDefault();
            const value = Number(amount);
            if (!title.trim() || !Number.isSafeInteger(value) || value < 0 || value > 1e12) {
              setError("Periksa nama dan nominal anggaran.");
              return;
            }
            if (
              selected &&
              JSON.stringify(items.find((i) => i.id === selected.id)) !== JSON.stringify(selected)
            ) {
              setError("Data berubah. Buka ulang anggaran terbaru.");
              return;
            }
            const next = {
              ...selected,
              id: selected?.id ?? crypto.randomUUID(),
              title: title.trim(),
              amount: value,
              notes,
            };
            if (
              await commit(
                selected ? items.map((i) => (i.id === selected.id ? next : i)) : [...items, next],
              )
            )
              setSelected(undefined);
          }}
        >
          <h2 className="font-semibold">{selected ? "Edit anggaran" : "Anggaran baru"}</h2>
          <label>
            Nama anggaran
            <input
              required
              maxLength={160}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Nominal (Rp)
            <input
              required
              type="number"
              step={1}
              min={0}
              max={1e12}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label>
            Catatan
            <textarea maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <div className="flex gap-3">
            <Button disabled={pending} type="submit">
              {pending ? "Menyimpan…" : "Simpan"}
            </Button>
            <Button variant="secondary" disabled={pending} onClick={() => setSelected(undefined)}>
              Batal
            </Button>
          </div>
        </form>
      )}
      {tab === "Ringkasan" && (
        <>
          <div className={layout.metrics}>
            <article className={styles.metricCard}>
              <span className={styles.metricLabel}>Rencana anggaran</span>
              <strong className={styles.metricValue}>{money(total)}</strong>
              <span className={styles.metricDetail}>Total kebutuhan yang kalian catat</span>
            </article>
            <article className={styles.metricCard}>
              <span className={styles.metricLabel}>Pos anggaran</span>
              <strong className={styles.metricValue}>{items.length}</strong>
              <span className={styles.metricDetail}>Kebutuhan acara tercatat</span>
            </article>
          </div>
          <div className={layout.highlight}>
            <h2>Selangkah lebih dekat ke hari kalian.</h2>
            <strong>{money(total)}</strong>
            <p>Susun setiap kebutuhan agar rencana dana semakin jelas.</p>
          </div>
        </>
      )}
      <div className="flex justify-between items-center gap-3">
        <h2 className="text-sm font-semibold">Anggaran yang sedang berjalan</h2>
        {tab === "Ringkasan" && (
          <button onClick={() => setTab("Anggaran")} className="text-xs text-primary min-h-11">
            Buka buku anggaran →
          </button>
        )}
      </div>
      <CustomerBudgetTable
        items={items}
        pending={pending}
        edit={edit}
        remove={(item) => void commit(items.filter((i) => i.id !== item.id))}
      />
    </section>
  );
}
