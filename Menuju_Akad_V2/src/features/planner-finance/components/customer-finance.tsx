"use client";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHeading } from "@/components/ui/page-heading";
import { CustomerBudgetTable } from "./customer-budget-table";
import { CustomerSavings } from "./customer-savings";
import { FinanceBalances } from "./finance-balances";
import { CustomerFinanceSummary } from "./customer-finance-summary";
import { CustomerFinanceDialogs } from "./customer-finance-dialogs";
import { useCustomerFinance } from "../hooks/use-customer-finance";
import { countCustomerBudgetStatuses, filterCustomerBudgets } from "../domain/customer-budget";
import type { CustomerBudget } from "../types/customer-budget";
import type { FinanceConnection } from "../types/finance-connection";
import styles from "./finance.module.css";
import layout from "./customer-finance.module.css";
import controls from "./finance-controls.module.css";
import { availableBudgetCategories } from "../domain/budget-categories";
import { BudgetStatusFilters } from "./budget-status-filters";
export type { CustomerBudget } from "../types/customer-budget";
export function CustomerFinance({
  initial,
  onChange,
  finance,
}: {
  initial: CustomerBudget[];
  onChange: (items: CustomerBudget[]) => Promise<boolean>;
  finance?: FinanceConnection;
}) {
  const state = useCustomerFinance({ initial, onChange, ...(finance ? { finance } : {}) });
  const {
    items,
    tab,
    setTab,
    filters,
    setFilters,
    editor,
    deleting,
    funding,
    announcement,
    pending,
    errorMessage,
    openEditor,
    setError,
    setDeleting,
    setCollected,
  } = state;
  const visible = filterCustomerBudgets(items, filters);
  const showBudgetList = tab === "Anggaran";
  return (
    <section className={layout.container} aria-busy={pending}>
      <header className={styles.headerRow}>
        <PageHeading
          title="Dana jelas, rencana tenang."
          description={
            finance
              ? "Kelola tabungan masing-masing, lihat saldo bersama, dan alokasikan dana untuk kebutuhan acara."
              : "Tetapkan target dana, tujuan, prioritas, dan tenggat. Tandai Tercapai ketika dananya sudah terkumpul."
          }
        />
      </header>
      <div className={layout.tabToolbar}>
        <div className={layout.tabList} role="tablist" aria-label="Keuangan">
          {(finance ? ["Ringkasan", "Tabungan", "Anggaran"] : ["Ringkasan", "Anggaran"]).map(
            (value) => (
              <button
                key={value}
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`${styles.tabBtn} ${controls.compact} ${tab === value ? styles.tabBtnActive : ""}`}
              >
                {value}
              </button>
            ),
          )}
        </div>
        {tab === "Anggaran" && (
          <Button
            size="small"
            className={`${layout.createBudgetButton} ${controls.compact}`}
            disabled={pending}
            onClick={() => openEditor("create")}
          >
            <Icon name="plus" size={16} />
            Catat anggaran
          </Button>
        )}
      </div>
      {errorMessage && !editor && !deleting && !funding && tab !== "Tabungan" && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}
      <span role="status" className="sr-only">
        {announcement}
      </span>
      {finance && tab === "Tabungan" && (
        <CustomerSavings
          snapshot={finance.snapshot}
          pending={pending}
          error={errorMessage}
          onCommand={finance.command}
          trial={finance.trial}
          {...(finance.consumeExport ? { onExport: finance.consumeExport } : {})}
        />
      )}
      {finance && tab !== "Tabungan" && <FinanceBalances snapshot={finance.snapshot} ornaments />}
      {tab === "Ringkasan" && <CustomerFinanceSummary items={items} finance={finance} />}
      {showBudgetList && (
        <>
          <div className={layout.listHeading}>
            <h2 className="text-sm font-semibold">Target dana kalian</h2>
          </div>
          <BudgetStatusFilters
            filters={filters}
            counts={countCustomerBudgetStatuses(items, filters)}
            change={setFilters}
          />
          <CustomerBudgetTable
            filters={filters}
            changeFilters={setFilters}
            categories={availableBudgetCategories(items)}
            purposes={[
              ...new Set(
                items
                  .map((item) => item.purpose?.trim())
                  .filter((value): value is string => !!value),
              ),
            ].sort((a, b) => a.localeCompare(b, "id-ID"))}
            allocationMode={!!finance}
            items={visible}
            pending={pending}
            edit={(item) => openEditor("edit", item)}
            remove={(item) => {
              setError("");
              setDeleting(item);
            }}
            onStatusChange={(item, completed) => void setCollected(item, completed)}
            emptyMessage={
              items.length
                ? "Tidak ada anggaran yang sesuai filter. Coba ubah status, prioritas, tenggat, atau pencarian."
                : "Belum ada anggaran. Mulai dengan mencatat target dana kalian."
            }
          />
        </>
      )}
      <CustomerFinanceDialogs state={state} finance={finance} />
    </section>
  );
}
