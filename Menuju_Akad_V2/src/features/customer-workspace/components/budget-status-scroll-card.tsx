"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt, ArrowUpRight, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { isBudgetDueSoon } from "../domain/budget-due-status";
import { BudgetStatusItem } from "./budget-status-item";

type BudgetStatusScrollCardProps = {
  budgets: CustomerBudget[];
  manageHref?: string | undefined;
  financeAvailable?: boolean | undefined;
  className?: string | undefined;
};

type FilterTab = "all" | "dueSoon" | "unpaid" | "paid";

export function BudgetStatusScrollCard({
  budgets,
  manageHref = "/planner/finance",
  financeAvailable = true,
  className,
}: BudgetStatusScrollCardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const paidBudgets = budgets.filter((b) => b.completed);
  const dueSoonBudgets = budgets.filter((b) => !b.completed && isBudgetDueSoon(b));
  const unpaidRegularBudgets = budgets.filter((b) => !b.completed && !isBudgetDueSoon(b));
  const totalUnpaid = budgets.filter((b) => !b.completed);

  const filteredBudgets =
    activeTab === "paid"
      ? paidBudgets
      : activeTab === "dueSoon"
        ? dueSoonBudgets
        : activeTab === "unpaid"
          ? unpaidRegularBudgets
          : budgets;

  return (
    <div
      className={cn(
        "bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs",
        className,
      )}
      aria-label="Detail status anggaran pembayaran"
    >
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-ux-border/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Receipt size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Detail Anggaran</h3>
              <p className="text-xs text-secondary">
                {paidBudgets.length} lunas · {totalUnpaid.length} belum bayar
                {dueSoonBudgets.length > 0 && ` (${dueSoonBudgets.length} segera)`}
              </p>
            </div>
          </div>
          {financeAvailable && (
            <Link
              href={manageHref}
              className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5"
            >
              Kelola <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mt-3 pb-2 border-b border-ux-border/40 text-[11px] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-2 py-0.5 rounded transition-all whitespace-nowrap",
              activeTab === "all"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            Semua ({budgets.length})
          </button>
          {dueSoonBudgets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("dueSoon")}
              className={cn(
                "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
                activeTab === "dueSoon"
                  ? "bg-rose-500/15 text-rose-800 dark:text-rose-300 font-semibold"
                  : "text-rose-600/80 hover:text-rose-700",
              )}
            >
              <AlertTriangle size={10} /> Segera ({dueSoonBudgets.length})
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab("unpaid")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "unpaid"
                ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            <Clock size={10} /> Belum ({unpaidRegularBudgets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paid")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "paid"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            <CheckCircle2 size={10} /> Lunas ({paidBudgets.length})
          </button>
        </div>

        {/* Scrollable Budget List */}
        <div className="mt-3 max-h-[300px] overflow-y-auto space-y-2 pr-1">
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((item, idx) => (
              <BudgetStatusItem key={item.id || `budget-${idx}`} item={item} />
            ))
          ) : (
            <div className="p-4 rounded-lg bg-subtle/40 border border-ux-border/60 text-center text-xs space-y-1.5 my-2">
              <p className="font-semibold text-foreground">
                {budgets.length === 0
                  ? "Belum ada pos anggaran"
                  : activeTab === "paid"
                    ? "Belum ada pos yang ditandai lunas"
                    : activeTab === "dueSoon"
                      ? "Tidak ada pos yang mendekati tenggat"
                      : "Semua pos anggaran sudah dibayar!"}
              </p>
              <p className="text-secondary text-[11px] leading-relaxed">
                {budgets.length === 0
                  ? "Catat pos pengeluaran di menu Tabungan & Anggaran untuk memantau status pembayaran."
                  : activeTab === "dueSoon"
                    ? "Semua jadwal pembayaran masih dalam batas waktu aman."
                    : "Luar biasa, semua pos anggaran telah selesai dilunasi."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-ux-border/60 flex items-center justify-between text-[11px] text-secondary">
        <span>Bisa digulir untuk melihat semua pos</span>
        {financeAvailable && (
          <Link href={manageHref} className="text-brand-secondary hover:underline">
            Rincian Lengkap →
          </Link>
        )}
      </div>
    </div>
  );
}
