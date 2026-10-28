"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { BudgetPriority, CustomerBudget } from "../types/customer-budget";
import { createBudgetDraft, type BudgetDraft } from "../domain/customer-budget";
import styles from "./customer-finance.module.css";
import { budgetCategories } from "../domain/budget-categories";

export function CustomerBudgetForm({
  item,
  mode,
  pending,
  error,
  onSave,
  onClose,
  allocationMode = false,
  funded = false,
}: {
  item: CustomerBudget | undefined;
  mode: "create" | "edit" | "duplicate";
  pending: boolean;
  error: string;
  onSave: (draft: BudgetDraft) => Promise<void>;
  onClose: () => void;
  allocationMode?: boolean;
  funded?: boolean;
}) {
  const [draft, setDraft] = useState(() => createBudgetDraft(item, mode === "duplicate"));
  const categoryList = useId();
  const linked = mode === "edit" && !!item?.source;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!pending) await onSave(draft);
  }
  return (
    <Dialog
      open
      onClose={() => !pending && onClose()}
      title={
        mode === "edit"
          ? "Edit anggaran"
          : mode === "duplicate"
            ? "Duplikat anggaran"
            : "Anggaran baru"
      }
    >
      <form className={styles.form} onSubmit={(event) => void submit(event)} aria-busy={pending}>
        <fieldset disabled={pending} className={styles.formFields}>
          {linked && (
            <p className="text-xs leading-relaxed text-secondary">
              Nama, target, kategori, dan deskripsi mengikuti data{" "}
              {item?.source?.kind === "catering" ? "katering" : "seserahan"}.{" "}
              <Link className="text-primary underline" href={`/planner/${item?.source?.kind}`}>
                Buka sumber kebutuhan
              </Link>{" "}
              untuk mengubahnya.{" "}
              {item?.source?.kind === "catering"
                ? "Tenggat pembayaran mengikuti menu katering. Tujuan dan prioritas tetap dapat diatur di sini."
                : "Tujuan, tenggat, dan prioritas tetap dapat diatur di sini."}
            </p>
          )}
          <label>
            Nama anggaran
            <input
              required
              maxLength={160}
              readOnly={linked}
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
            />
          </label>
          <label>
            Target (Rp)
            <input
              required
              type="number"
              readOnly={funded || linked}
              inputMode="numeric"
              step={1}
              min={0}
              max={1e12}
              value={draft.amount}
              onChange={(event) => setDraft({ ...draft, amount: event.target.value })}
            />
          </label>
          <label>
            Kategori anggaran
            <input
              aria-label="Kategori anggaran"
              list={categoryList}
              maxLength={80}
              value={draft.category ?? "Lainnya"}
              readOnly={linked}
              onChange={(event) => setDraft({ ...draft, category: event.target.value })}
            />
            <datalist id={categoryList}>
              {budgetCategories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>
          <label>
            Tujuan anggaran
            <input
              maxLength={200}
              placeholder="Contoh: DP gedung atau pelunasan katering"
              value={draft.purpose}
              onChange={(event) => setDraft({ ...draft, purpose: event.target.value })}
            />
          </label>
          <div className={styles.formRow}>
            <label>
              Tenggat
              <input
                type="date"
                readOnly={linked && item?.source?.kind === "catering"}
                value={draft.dueDate}
                onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
              />
            </label>
            <label>
              Prioritas
              <select
                aria-label="Prioritas"
                value={draft.priority}
                onChange={(event) =>
                  setDraft({ ...draft, priority: event.target.value as BudgetPriority })
                }
              >
                {["Rendah", "Normal", "Tinggi"].map((priority) => (
                  <option key={priority}>{priority}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Deskripsi anggaran
            <textarea
              aria-label="Deskripsi anggaran"
              rows={4}
              maxLength={linked ? 5000 : 2000}
              readOnly={linked}
              value={draft.notes}
              onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
            />
          </label>
          {funded && (
            <p className="text-xs text-secondary">
              Batalkan alokasi terlebih dahulu untuk mengubah target dana.
            </p>
          )}
          {!allocationMode && (
            <label className={styles.collectedChoice}>
              <input
                type="checkbox"
                checked={draft.completed}
                onChange={(event) => setDraft({ ...draft, completed: event.target.checked })}
              />
              Dana sudah terkumpul
            </label>
          )}
          <p className="text-xs text-secondary">
            {allocationMode
              ? "Setelah disimpan, pilih sumber tabungan melalui tombol Tercapai untuk mengalokasikan dana."
              : "Status Tercapai berarti target dana sudah terkumpul."}
          </p>
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className={styles.formActions}>
          <Button disabled={pending} type="submit">
            {pending ? "Menyimpan…" : "Simpan"}
          </Button>
          <Button variant="secondary" disabled={pending} onClick={onClose}>
            Batal
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
