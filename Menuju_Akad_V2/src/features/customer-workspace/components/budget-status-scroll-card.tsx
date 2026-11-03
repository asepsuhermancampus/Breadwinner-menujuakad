"use client";

import { useState } from "react";
import Link from "next/link";
import { Receipt, ArrowUpRight, CheckCircle2, Clock, AlertTriangle, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/cn";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { getBudgetDueCategory } from "../domain/budget-due-status";
import { BudgetStatusItem } from "./budget-status-item";

type BudgetStatusScrollCardProps = {
  budgets: CustomerBudget[];
  manageHref?: string | undefined;
  financeAvailable?: boolean | undefined;
  className?: string | undefined;
};

type FilterTab = "all" | "overdue" | "dueToday" | "dueSoon" | "unpaid" | "paid";

export function BudgetStatusScrollCard({
  budgets,
  manageHref = "/planner/finance",
  financeAvailable = true,
  className,
}: BudgetStatusScrollCardProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const paidBudgets = budgets.filter((b) => b.completed);
  const overdueBudgets = budgets.filter((b) => !b.completed && getBudgetDueCategory(b) === "overdue");
  const dueTodayBudgets = budgets.filter((b) => !b.completed && getBudgetDueCategory(b) === "dueToday");
  const dueSoonBudgets = budgets.filter((b) => !b.completed && getBudgetDueCategory(b) === "dueSoon");
  const unpaidRegularBudgets = budgets.filter((b) => !b.completed && getBudgetDueCategory(b) === "unpaid");
  const totalUnpaid = budgets.filter((b) => !b.completed);
  const urgentCount = overdueBudgets.length + dueTodayBudgets.length + dueSoonBudgets.length;

  const filteredBudgets =
    activeTab === "paid"
      ? paidBudgets
      : activeTab === "overdue"
        ? overdueBudgets
        : activeTab === "dueToday"
          ? dueTodayBudgets
          : activeTab === "dueSoon"
            ? dueSoonBudgets
            : activeTab === "unpaid"
              ? unpaidRegularBudgets
              : budgets;

  return (
    <div
      className={cn("bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs", className)}
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
                {urgentCount > 0 && ` (${urgentCount} perlu perhatian)`}
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
        <div className="flex items-center gap-1 mt-3 pb-2 border-b border-ux-border/40 text-[11px] overflow-x-auto app-scroll">
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
          {overdueBudgets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("overdue")}
              className={cn(
                "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
                activeTab === "overdue"
                  ? "bg-red-500/15 text-red-800 dark:text-red-300 font-semibold"
                  : "text-red-600/80 hover:text-red-700",
              )}
            >
              <AlertCircle size={10} /> Lewat ({overdueBudgets.length})
            </button>
          )}
          {dueTodayBudgets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("dueToday")}
              className={cn(
                "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
                activeTab === "dueToday"
                  ? "bg-orange-500/15 text-orange-800 dark:text-orange-300 font-semibold"
                  : "text-orange-600/80 hover:text-orange-700",
              )}
            >
              <Zap size={10} /> Hari Ini ({dueTodayBudgets.length})
            </button>
          )}
          {dueSoonBudgets.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab("dueSoon")}
              className={cn(
                "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
                activeTab === "dueSoon"
                  ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold"
                  : "text-amber-600/80 hover:text-amber-700",
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
                ? "bg-slate-500/15 text-slate-800 dark:text-slate-300 font-semibold"
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
        <div className="mt-3 max-h-[300px] overflow-y-auto space-y-2 pr-1.5 app-scroll">
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((item, idx) => (
              <BudgetStatusItem key={item.id || `budget-${idx}`} item={item} />
            ))
          ) : (
            <div className="p-4 rounded-lg bg-subtle/40 border border-ux-border/60 text-center text-xs space-y-1 my-2">
              <p className="font-semibold text-foreground">
                {budgets.length === 0
                  ? "Belum ada pos anggaran"
                  : activeTab === "paid"
                    ? "Belum ada pos yang ditandai lunas"
                    : "Tidak ada pos pada filter ini"}
              </p>
              <p className="text-secondary text-[11px]">
                {budgets.length === 0
                  ? "Catat pos pengeluaran di menu Tabungan & Anggaran."
                  : "Semua pos anggaran dalam status terjadwal aman."}
              </p>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
