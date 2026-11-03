"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Gift, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SeserahanItem } from "@/features/wedding-preparation/types/seserahan";

type FilterTab = "all" | "bought" | "pending";

export function SeserahanStatusScrollCard({
  items = [],
  manageHref = "/planner/seserahan",
  className,
}: {
  items?: SeserahanItem[] | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const boughtItems = items.filter((i) => i.isBought);
  const pendingItems = items.filter((i) => !i.isBought);

  const filteredItems =
    activeTab === "bought"
      ? boughtItems
      : activeTab === "pending"
        ? pendingItems
        : items;

  return (
    <div
      className={cn("bg-canvas border border-ux-border p-5 flex flex-col justify-between shadow-xs h-full", className)}
      aria-label="Detail rincian barang seserahan"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <Gift size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">Daftar Kotak Seserahan</h3>
            <p className="text-xs text-secondary truncate">
              {boughtItems.length} siap · {pendingItems.length} belum terbeli
            </p>
          </div>
        </div>
        <Link
          href={manageHref}
          className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
        >
          Kelola <ArrowUpRight size={13} />
        </Link>
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
          Semua ({items.length})
        </button>
        {boughtItems.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("bought")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "bought"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-emerald-700/80 hover:text-emerald-800",
            )}
          >
            <CheckCircle2 size={10} /> Siap ({boughtItems.length})
          </button>
        )}
        {pendingItems.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "pending"
                ? "bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold"
                : "text-amber-600/80 hover:text-amber-700",
            )}
          >
            <Clock size={10} /> Belum ({pendingItems.length})
          </button>
        )}
      </div>

      {/* Scrollable Items List */}
      <div className="mt-3 flex-1 min-h-[140px] max-h-[280px] sm:max-h-[300px] xl:max-h-[320px] overflow-y-auto space-y-2 pr-1.5 app-scroll">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <div
              key={item.id || `seserahan-${idx}`}
              className="p-2.5 rounded-lg border border-ux-border/70 bg-subtle/30 flex items-center justify-between gap-2 hover:bg-subtle/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-[11px] text-secondary truncate">
                  {item.category} · PIC: {item.pic}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="font-mono text-xs font-bold text-foreground block">
                  Rp {(item.actualCost || item.estimatedCost).toLocaleString("id-ID")}
                </span>
                {item.isBought ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 size={10} /> Siap
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                    <Clock size={10} /> Belum
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-lg bg-subtle/40 border border-ux-border/60 text-center text-xs space-y-1 my-auto flex flex-col items-center justify-center min-h-[140px] xl:min-h-[170px]">
            <p className="font-semibold text-foreground">
              {items.length === 0 ? "Belum ada daftar seserahan" : "Tidak ada barang pada filter ini"}
            </p>
            <p className="text-secondary text-[11px]">
              {items.length === 0
                ? "Catat barang hantaran dan seserahan di menu Seserahan."
                : "Ubah filter di atas untuk melihat barang lainnya."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

