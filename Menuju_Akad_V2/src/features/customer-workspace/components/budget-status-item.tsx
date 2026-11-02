"use client";

import { cn } from "@/lib/cn";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { isBudgetDueSoon } from "../domain/budget-due-status";

type ItemProps = {
  item: CustomerBudget;
};

export function BudgetStatusItem({ item }: ItemProps) {
  const isUrgent = isBudgetDueSoon(item);

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
                isUrgent && !item.completed ? "text-rose-600 font-medium" : "text-muted-foreground",
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
            item.completed
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : isUrgent
                ? "bg-rose-500/10 text-rose-700 dark:text-rose-400"
                : "bg-amber-500/10 text-amber-800 dark:text-amber-300",
          )}
        >
          {item.completed
            ? "✓ Sudah Dibayar"
            : isUrgent
              ? "⚠️ Mendekati Tenggat"
              : "⏳ Belum Dibayar"}
        </span>
      </div>
    </div>
  );
}

