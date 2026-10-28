"use client";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import type { useCustomerFinance } from "../hooks/use-customer-finance";
import type { FinanceConnection } from "../types/finance-connection";
import { CustomerBudgetForm } from "./customer-budget-form";
import { BudgetFundingDialog } from "./budget-funding-dialog";
import layout from "./customer-finance.module.css";
const money = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;
export function CustomerFinanceDialogs({
  state,
  finance,
}: {
  state: ReturnType<typeof useCustomerFinance>;
  finance: FinanceConnection | undefined;
}) {
  const {
    editor,
    setEditor,
    pending,
    errorMessage,
    save,
    setError,
    deleting,
    setDeleting,
    remove,
    funding,
    setFunding,
    confirmFunding,
  } = state;
  return (
    <>
      {editor && (
        <CustomerBudgetForm
          item={editor.item}
          mode={editor.mode}
          pending={pending}
          error={errorMessage}
          allocationMode={!!finance}
          funded={
            editor.mode === "edit" &&
            !!finance?.snapshot.allocations.some((value) => value.budgetId === editor.item?.id)
          }
          onSave={save}
          onClose={() => {
            setEditor(null);
            setError("");
          }}
        />
      )}
      {deleting && (
        <Dialog
          open
          title="Hapus anggaran?"
          onClose={() => {
            if (!pending) {
              setDeleting(null);
              setError("");
            }
          }}
        >
          <p className="break-words text-sm">
            Hapus anggaran <strong>{deleting.title}</strong> dengan target{" "}
            {money(deleting.amount ?? 0)}? Catatan ini akan dihapus dari daftar kalian.
          </p>
          {finance?.snapshot.allocations.some((value) => value.budgetId === deleting.id) && (
            <p className="mt-3 text-sm text-secondary">
              Dana yang dialokasikan akan dikembalikan ke sumber tabungan semula dan dicatat dalam
              riwayat.
            </p>
          )}
          {errorMessage && (
            <p role="alert" className="mt-3 text-sm text-danger">
              {errorMessage}
            </p>
          )}
          <div className={layout.formActions}>
            <Button variant="danger" disabled={pending} onClick={() => void remove()}>
              {pending ? "Menghapus…" : "Hapus anggaran"}
            </Button>
            <Button variant="secondary" disabled={pending} onClick={() => setDeleting(null)}>
              Batal
            </Button>
          </div>
        </Dialog>
      )}
      {funding && finance && (
        <BudgetFundingDialog
          item={funding.item}
          complete={funding.complete}
          snapshot={finance.snapshot}
          pending={pending}
          error={errorMessage}
          onClose={() => {
            setFunding(null);
            setError("");
          }}
          onConfirm={confirmFunding}
        />
      )}
    </>
  );
}
