"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, FileText, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DocumentItem } from "@/features/kua-documents/domain/document-schema";

type FilterTab = "all" | "main" | "additional" | "pending" | "completed";

export function KuaStatusScrollCard({
  documents = [],
  documentsAvailable = true,
  manageHref = "/planner/kua",
  className,
}: {
  documents?: DocumentItem[] | undefined;
  documentsAvailable?: boolean | undefined;
  manageHref?: string | undefined;
  className?: string | undefined;
}) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const activeDocs = documents.filter((d) => !d.archived);

  const mainDocs = activeDocs.filter((d) => d.group !== "additional");
  const additionalDocs = activeDocs.filter((d) => d.group === "additional");
  const pendingDocs = activeDocs.filter((d) => !d.completed);
  const completedDocs = activeDocs.filter((d) => d.completed);

  const filteredDocs =
    activeTab === "main"
      ? mainDocs
      : activeTab === "additional"
        ? additionalDocs
        : activeTab === "pending"
          ? pendingDocs
          : activeTab === "completed"
            ? completedDocs
            : activeDocs;

  return (
    <div
      className={cn("bg-canvas border border-ux-border p-5 flex flex-col shadow-xs", className)}
      aria-label="Detail daftar persyaratan dokumen KUA"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-ux-border/60 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
            <FileText size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">Daftar Dokumen KUA</h3>
            <p className="text-xs text-secondary truncate">
              {completedDocs.length} siap · {pendingDocs.length} belum lengkap
            </p>
          </div>
        </div>
        {documentsAvailable && (
          <Link
            href={manageHref}
            className="text-xs font-medium text-brand-secondary hover:underline inline-flex items-center gap-0.5 shrink-0"
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
          Semua ({activeDocs.length})
        </button>
        {mainDocs.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("main")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "main"
                ? "bg-sky-500/15 text-sky-800 dark:text-sky-300 font-semibold"
                : "text-sky-600/80 hover:text-sky-700",
            )}
          >
            Utama / Wajib ({mainDocs.length})
          </button>
        )}
        {additionalDocs.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("additional")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "additional"
                ? "bg-purple-500/15 text-purple-800 dark:text-purple-300 font-semibold"
                : "text-purple-600/80 hover:text-purple-700",
            )}
          >
            Kondisional ({additionalDocs.length})
          </button>
        )}
        {pendingDocs.length > 0 && (
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
            <Clock size={10} /> Belum ({pendingDocs.length})
          </button>
        )}
        {completedDocs.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={cn(
              "px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 whitespace-nowrap",
              activeTab === "completed"
                ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold"
                : "text-secondary hover:text-foreground",
            )}
          >
            <CheckCircle2 size={10} /> Lengkap ({completedDocs.length})
          </button>
        )}
      </div>

      {/* Scrollable Document List */}
      <div className="mt-3 max-h-[320px] sm:max-h-[380px] xl:max-h-[415px] overflow-y-auto space-y-2 pr-1.5 app-scroll">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc, idx) => (
            <div
              key={doc.id || `doc-${idx}`}
              className="p-2.5 rounded-lg border border-ux-border/70 bg-subtle/30 flex items-center justify-between gap-2 hover:bg-subtle/50 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{doc.title}</p>
                <p className="text-[11px] text-secondary truncate">
                  {doc.group === "additional" ? "Berkas Bersyarat / Khusus" : "Berkas Wajib Utama"}
                  {doc.notes ? ` · ${doc.notes}` : ""}
                </p>
              </div>
              <div className="shrink-0">
                {doc.completed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 size={10} /> Lengkap
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300">
                    <Clock size={10} /> Menunggu
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 rounded-lg bg-subtle/40 border border-ux-border/60 text-center text-xs space-y-1 my-2">
            <p className="font-semibold text-foreground">
              {activeDocs.length === 0 ? "Belum ada berkas KUA" : "Tidak ada berkas pada filter ini"}
            </p>
            <p className="text-secondary text-[11px]">
              {activeDocs.length === 0
                ? "Daftarkan syarat berkas nikah di menu Persyaratan KUA."
                : "Ubah filter di atas untuk melihat dokumen lainnya."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
