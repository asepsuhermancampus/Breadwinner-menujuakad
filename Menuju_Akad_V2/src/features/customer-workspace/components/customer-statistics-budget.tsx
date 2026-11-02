"use client";

import Link from "next/link";
import { ArrowUpRight, Wallet } from "lucide-react";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";

type BudgetProps = {
  financeData: CustomerBudget[];
  financeAvailable: boolean;
};

const CATEGORY_COLORS: Record<string, string> = {
  katering: "#087f5b",
  dekorasi: "#10b981",
  gedung: "#047857",
  busana: "#34d399",
  dokumentasi: "#0d9488",
  lainnya: "#6ee7b7",
};

export function CustomerStatisticsBudget({ financeData, financeAvailable }: BudgetProps) {
  const total = financeData.reduce((sum, item) => sum + (item.amount ?? 0), 0);

  // Group by category or fallback to top items
  const categoryMap = new Map<string, number>();
  for (const item of financeData) {
    const cat = (item.category || item.purpose || "Lainnya").trim();
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + (item.amount ?? 0));
  }

  const sortedCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="bg-canvas border border-ux-border p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-ux-border/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300">
              <Wallet size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Alokasi Anggaran Acara</h3>
              <p className="text-xs text-secondary">
                {total > 0 ? `Total Rp ${total.toLocaleString("id-ID")}` : "Belum ada anggaran tercatat"}
              </p>
            </div>
          </div>
          {financeAvailable && (
            <Link
              href="/planner/finance"
              className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5"
            >
              Kelola <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        {/* Progress List */}
        <div className="mt-4 space-y-3">
          {sortedCategories.length > 0 ? (
            sortedCategories.map(([category, amount], idx) => {
              const percent = total > 0 ? Math.round((amount / total) * 100) : 0;
              const colorKey = category.toLowerCase();
              const barColor =
                CATEGORY_COLORS[colorKey] ?? Object.values(CATEGORY_COLORS)[idx % 6] ?? "#10b981";

              return (
                <div key={category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground truncate max-w-[140px]">
                      {category}
                    </span>
                    <span className="font-mono text-secondary">
                      Rp {amount.toLocaleString("id-ID")} ({percent}%)
                    </span>
                  </div>
                  {/* Gifted-style Rounded Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-ux-border/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-secondary">
              <p>Mulai catat alokasi katering, dekorasi, atau sewa gedung.</p>
              {financeAvailable && (
                <Link
                  href="/planner/finance"
                  className="mt-2 inline-block font-medium text-brand-secondary hover:underline"
                >
                  + Tambah Pos Anggaran
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

