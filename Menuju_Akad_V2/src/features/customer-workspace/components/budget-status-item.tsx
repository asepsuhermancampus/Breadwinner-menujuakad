"use client";

import { cn } from "@/lib/cn";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { getBudgetDueCategory } from "../domain/budget-due-status";

type ItemProps = {
  item: CustomerBudget;
};

export function BudgetStatusItem({ item }: ItemProps) {
  const cat = getBudgetDueCategory(item);

  return (
    <div className="p-2.5 rounded-lg border border-ux-border/50 bg-subtle/30 flex items-center justify-between gap-2 text-xs">
      <div className="min-w-0 flex-1">
        <div className="font-medium text-foreground truncate" title={item.title}>
          {item.title}
        </div>
        <div className="text-[11px] text-secondary truncate flex items-center gap-1.5">
          <span>{item.category || item.purpose || "Pos Anggaran"}</span>
          {item.dueDate && (
            <span
              className={cn(
                cat === "overdue"
                  ? "text-red-600 dark:text-red-400 font-semibold"
                  : cat === "dueToday"
                    ? "text-orange-600 dark:text-orange-400 font-semibold"
                    : cat === "dueSoon"
                      ? "text-amber-600 dark:text-amber-400 font-medium"
                      : "text-muted-foreground",
              )}
            >
              · {item.dueDate}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="font-mono font-semibold text-foreground">
          Rp {(item.amount ?? 0).toLocaleString("id-ID")}
        </span>
        <span
          className={cn(
            "px-1.5 py-0.5 rounded text-[10px] font-semibold",
            cat === "paid"
              ? "bg-emerald-500/10 text-[#064e3b] dark:text-emerald-300"
              : cat === "overdue"
                ? "bg-red-500/15 text-red-700 dark:text-red-400"
                : cat === "dueToday"
                  ? "bg-orange-500/15 text-orange-700 dark:text-orange-400"
                  : cat === "dueSoon"
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    : "bg-slate-500/10 text-slate-700 dark:text-slate-300",
          )}
        >
          {cat === "paid"
            ? "✓ Sudah Dibayar"
            : cat === "overdue"
              ? "🚨 Lewat Tenggat"
              : cat === "dueToday"
                ? "⚡ Tenggat Hari Ini"
                : cat === "dueSoon"
                  ? "⚠️ Mendekati Tenggat"
                  : "⏳ Belum Dibayar"}
        </span>
      </div>
    </div>
  );
}
