"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { TaskMaintenancePanel } from "./task-maintenance-panel";
import type { MaintainedPlanningFeature } from "@/features/customer-planning/domain/maintenance-catalog";

const FEATURE_LIST: { id: "tasks" | MaintainedPlanningFeature; name: string; category: string }[] = [
  { id: "tasks", name: "Tugas", category: "Perencanaan" },
  { id: "calendar", name: "Kalender koordinasi", category: "Perencanaan" },
  { id: "rundown", name: "Rundown acara", category: "Perencanaan" },
  { id: "emergency", name: "Perlengkapan darurat", category: "Logistik" },
  { id: "documents", name: "Dokumen KUA", category: "Administrasi" },
  { id: "moodboard", name: "Moodboard", category: "Kreatif" },
  { id: "catering", name: "Katering", category: "Logistik" },
  { id: "seserahan", name: "Seserahan", category: "Logistik" },
  { id: "guests", name: "Pengelolaan tamu", category: "Tamu" },
  { id: "invitations", name: "Editor undangan", category: "Undangan" },
  { id: "studio-drafts", name: "Studio undangan", category: "Undangan" },
  { id: "finance", name: "Keuangan", category: "Finansial" },
  { id: "pdf", name: "Ringkasan cetak", category: "Dokumen" },
];

export function FeaturesMaintenanceSection() {
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", ...new Set(FEATURE_LIST.map((f) => f.category))];

  const filtered = FEATURE_LIST.filter((item) => {
    const matchesQuery =
      query.trim() === "" ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase());
    const matchesCat = filterCategory === "all" || item.category === filterCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <section id="pemeliharaan-global" className="scroll-mt-24 space-y-4">
      <div className="flex flex-col gap-3 rounded-card border border-ux-border bg-surface p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon name="settings" size={16} />
            </span>
            <h2 className="text-base font-semibold text-foreground">Pemeliharaan Fitur</h2>
            <span className="rounded-full bg-subtle px-2 py-0.5 text-xs font-medium text-brand-secondary">
              13
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:w-72">
          <div className="relative">
            <Icon
              name="search"
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              placeholder="Cari fitur pemeliharaan…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-control border border-ux-border bg-canvas/40 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-hidden"
              aria-label="Cari fitur pemeliharaan"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="mr-1 text-secondary font-medium">Kategori:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${filterCategory === cat
              ? "bg-brand-secondary text-on-primary"
              : "bg-surface border border-ux-border text-secondary hover:bg-subtle"
              }`}
          >
            {cat === "all" ? "Semua (13)" : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <TaskMaintenancePanel key={item.id} feature={item.id} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-card border border-dashed border-ux-border p-8 text-center text-xs text-secondary">
          Tidak ada fitur yang cocok dengan pencarian &quot;{query}&quot;.
          <button
            onClick={() => {
              setQuery("");
              setFilterCategory("all");
            }}
            className="ml-2 font-medium text-primary underline"
          >
            Reset filter
          </button>
        </div>
      )}
    </section>
  );
}

