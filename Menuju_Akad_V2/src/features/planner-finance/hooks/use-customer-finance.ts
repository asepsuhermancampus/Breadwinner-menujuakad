"use client";
import { useRef, useState } from "react";
import { useCommittedList } from "@/hooks/use-committed-list";
import {
  buildCustomerBudget,
  type BudgetDraft,
  type BudgetFilters,
} from "../domain/customer-budget";
import type { CustomerBudget } from "../types/customer-budget";
import type { FinanceConnection } from "../types/finance-connection";
import type { SavingsSide } from "../types/finance-ledger";
const initialFilters: BudgetFilters = {
  status: "Belum tercapai",
  priority: "Semua",
  due: "Semua",
  query: "",
};
type Editor = {
  mode: "create" | "edit" | "duplicate";
  item: CustomerBudget | undefined;
  identity: { id: string; createdAt: string };
};

export function useCustomerFinance({
  initial,
  onChange,
  finance,
}: {
  initial: CustomerBudget[];
  onChange: (items: CustomerBudget[]) => Promise<boolean>;
  finance?: FinanceConnection;
}) {
  const [items, update] = useCommittedList(initial, onChange);
  const [tab, setTab] = useState("Ringkasan");
  const [filters, setFilters] = useState(initialFilters);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [deleting, setDeleting] = useState<CustomerBudget | null>(null);
  const [saving, setPending] = useState(false);
  const [funding, setFunding] = useState<{ item: CustomerBudget; complete: boolean } | null>(null);
  const [error, setError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const busy = useRef(false);
  const pending = saving || !!finance?.pending;
  const errorMessage = [error, finance?.error].filter(Boolean).join(" ");

  async function commit(next: CustomerBudget[]) {
    if (busy.current) return false;
    busy.current = true;
    setPending(true);
    setError("");
    try {
      const ok = await update(next);
      if (!ok) setError("Perubahan belum tersimpan. Draf tetap tersedia; coba kembali.");
      return ok;
    } catch {
      setError("Perubahan belum tersimpan. Draf tetap terbuka; coba simpan kembali.");
      return false;
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  function openEditor(mode: Editor["mode"], item?: CustomerBudget) {
    setError("");
    setEditor({
      mode,
      item,
      identity: { id: crypto.randomUUID(), createdAt: new Date().toISOString() },
    });
  }
  async function save(draft: BudgetDraft) {
    if (!editor || busy.current) return;
    const original = editor.mode === "edit" ? editor.item : undefined;
    if (
      original &&
      JSON.stringify(items.find((item) => item.id === original.id)) !== JSON.stringify(original)
    ) {
      setError("Anggaran berubah di tab lain. Salin draf kalian, lalu buka ulang data terbaru.");
      return;
    }
    let next: CustomerBudget;
    try {
      next = buildCustomerBudget(draft, original, editor.identity);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Periksa isian anggaran.");
      return;
    }
    if (
      await commit(
        original ? items.map((item) => (item.id === original.id ? next : item)) : [...items, next],
      )
    ) {
      setEditor(null);
      if (finance) setTab("Anggaran");
      if (!original)
        setFilters({ ...initialFilters, status: next.completed ? "Tercapai" : "Belum tercapai" });
    }
  }
  async function remove() {
    if (!deleting || busy.current) return;
    if (
      JSON.stringify(items.find((item) => item.id === deleting.id)) !== JSON.stringify(deleting)
    ) {
      setError(
        "Anggaran berubah. Tutup konfirmasi ini dan periksa data terbaru sebelum menghapus.",
      );
      return;
    }
    const ok = finance?.snapshot.allocations.some((value) => value.budgetId === deleting.id)
      ? await finance.command({ type: "delete-budget", budgetId: deleting.id })
      : await commit(items.filter((item) => item.id !== deleting.id));
    if (ok) setDeleting(null);
  }
  async function setCollected(item: CustomerBudget, completed: boolean) {
    if (finance) {
      setError("");
      if (!completed && !finance.snapshot.allocations.some((value) => value.budgetId === item.id)) {
        await commit(
          items.map((current) =>
            current.id === item.id ? { ...current, completed: false } : current,
          ),
        );
        return;
      }
      if (!finance.snapshot.actorSide) {
        setTab("Tabungan");
        setError(
          "Hubungkan akun ke pasangan pria atau wanita terlebih dahulu untuk memakai tabungan.",
        );
        return;
      }
      setFunding({ item, complete: completed });
      return;
    }
    if (
      await commit(
        items.map((current) => (current.id === item.id ? { ...current, completed } : current)),
      )
    )
      setAnnouncement(`${item.title}: dana ${completed ? "sudah" : "belum"} terkumpul.`);
  }
  async function confirmFunding(side: SavingsSide) {
    if (!finance || !funding || pending) return;
    if (
      JSON.stringify(items.find((item) => item.id === funding.item.id)) !==
      JSON.stringify(funding.item)
    ) {
      setError("Anggaran berubah. Tutup konfirmasi ini dan periksa target terbaru.");
      return;
    }
    setError("");
    const ok = await finance.command(
      funding.complete
        ? { type: "allocate", budgetId: funding.item.id, side }
        : { type: "release", budgetId: funding.item.id },
    );
    if (ok) {
      setAnnouncement(
        `${funding.item.title}: ${funding.complete ? "dana dialokasikan" : "alokasi dibatalkan"}.`,
      );
      setFunding(null);
    }
  }
  return {
    items,
    tab,
    setTab,
    filters,
    setFilters,
    editor,
    setEditor,
    deleting,
    setDeleting,
    funding,
    setFunding,
    setError,
    announcement,
    pending,
    errorMessage,
    openEditor,
    save,
    remove,
    setCollected,
    confirmFunding,
  };
}
