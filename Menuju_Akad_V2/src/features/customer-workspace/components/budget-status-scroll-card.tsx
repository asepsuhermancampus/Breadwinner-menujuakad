"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";

type BudgetStatusScrollCardProps = {
  budgets: CustomerBudget[];
  manageHref?: string | undefined;
  financeAvailable?: boolean | undefined;
  className?: string | undefined;
};

type FilterTab = "all" | "unpaid" | "paid";

export function BudgetStatusScrollCard({
  budgets,
  manageHref = "/planner/finance",
  financeAvailable = true,
  className,
}: BudgetStatusScrollCardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const paidBudgets = budgets.filter((b) => b.completed);
  const unpaidBudgets = budgets.filter((b) => !b.completed);

  const filteredBudgets =
    activeTab === "paid"
      ? paidBudgets
      : activeTab === "unpaid"
        ? unpaidBudgets
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
                {paidBudgets.length} lunas · {unpaidBudgets.length} belum bayar
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
        <div className="flex items-center gap-1.5 mt-3 pb-2 border-b border-ux-border/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition-all",
              activeTab === "all"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            Semua ({budgets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("unpaid")}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition-all inline-flex items-center gap-1",
              activeTab === "unpaid"
                ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            <Clock size={11} /> Belum ({unpaidBudgets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paid")}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-medium transition-all inline-flex items-center gap-1",
              activeTab === "paid"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            <CheckCircle2 size={11} /> Lunas ({paidBudgets.length})
          </button>
        </div>

        {/* Scrollable Budget List */}
        <div className="mt-3 max-h-[300px] overflow-y-auto space-y-2 pr-1">
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((item, idx) => (
              <div
                key={item.id || `budget-${idx}`}
                className="p-2.5 rounded-lg border border-ux-border/50 bg-subtle/30 flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate" title={item.title}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-secondary truncate">
                    {item.category || item.purpose || "Pos Anggaran"}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-mono font-semibold text-foreground">
                    Rp {(item.amount ?? 0).toLocaleString("id-ID")}
                  </span>
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                      item.completed
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                    )}
                  >
                    {item.completed ? "✓ Sudah Dibayar" : "⏳ Belum Dibayar"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-lg bg-subtle/40 border border-ux-border/60 text-center text-xs space-y-1.5 my-2">
              <p className="font-semibold text-foreground">
                {budgets.length === 0
                  ? "Belum ada pos anggaran"
                  : activeTab === "paid"
                    ? "Belum ada pos yang ditandai lunas"
                    : "Semua pos anggaran sudah dibayar!"}
              </p>
              <p className="text-secondary text-[11px] leading-relaxed">
                {budgets.length === 0
                  ? "Catat pos pengeluaran di menu Tabungan & Anggaran untuk memantau status pembayaran."
                  : activeTab === "paid"
                    ? "Tandai pos sebagai dibayar atau alokasikan dari tabungan."
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

