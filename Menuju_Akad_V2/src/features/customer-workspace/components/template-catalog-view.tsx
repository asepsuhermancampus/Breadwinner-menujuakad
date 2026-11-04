"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import {
  vidingTemplates,
  TEMPLATES_PER_PAGE,
  getFilteredTemplates,
} from "../domain/viding-templates";
import type { VidingTemplate } from "../types/viding-template";
import { TemplateNumericTabs } from "./template-numeric-tabs";
import { TemplateCard } from "./template-card";
import { TemplatePagination } from "./template-pagination";
import { TemplatePreviewModal } from "./template-preview-modal";
import styles from "./template-catalog.module.css";

type Props = {
  onSelectTemplate: (template: VidingTemplate) => void;
  canSelect?: boolean;
};

export function TemplateCatalogView({ onSelectTemplate, canSelect = true }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previewTemplate, setPreviewTemplate] = useState<VidingTemplate | null>(null);

  const filtered = useMemo(() => {
    return getFilteredTemplates(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filtered.length / TEMPLATES_PER_PAGE);

  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * TEMPLATES_PER_PAGE;
    return filtered.slice(start, start + TEMPLATES_PER_PAGE);
  }, [filtered, currentPage]);

  const handleSelectCategory = (catId: number) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <section className={styles.container} aria-label="Katalog template undangan">
      <div className={styles.headerSection}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={16} className="text-secondary shrink-0" />
            <input
              type="search"
              placeholder="Cari tema (misal: Tema 29, Glamve, Floral)..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Cari tema"
            />
          </div>
          <span className={styles.badgeCount}>
            {filtered.length} dari {vidingTemplates.length} Template
          </span>
        </div>

        <TemplateNumericTabs
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      <div className={styles.grid}>
        {paginatedTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onPreview={setPreviewTemplate}
            onSelect={onSelectTemplate}
            disabled={!canSelect}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-card border border-ux-border p-8 text-center bg-surface">
          <p className="text-base font-semibold">Tidak ada template yang cocok.</p>
          <p className="mt-1 text-sm text-secondary">
            Coba ubah kata kunci pencarian atau pilih kategori nomor lain.
          </p>
        </div>
      )}

      <TemplatePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={TEMPLATES_PER_PAGE}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 350, behavior: "smooth" });
        }}
      />

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={onSelectTemplate}
      />
    </section>
  );
}

