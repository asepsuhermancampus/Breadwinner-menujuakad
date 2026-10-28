"use client";
import { useUrlTab } from "@/hooks/use-url-tab";
import { useState, useMemo } from "react";
import { SummaryCard } from "@/components/ui/summary-card";
import { Icon } from "@/components/ui/icon";
import type { KuaDocumentItem } from "../types/kua";
import { KuaDocumentTable } from "./kua-document-table";
import { KuaRevisionDialog } from "./kua-revision-dialog";
import styles from "./kua.module.css";

type Props = {
  initialDocuments: KuaDocumentItem[];
};

export function KuaScreen({ initialDocuments }: Props) {
  const [documents, setDocuments] = useState<KuaDocumentItem[]>(initialDocuments);
  const [filter, setFilter] = useUrlTab("tab", ["Wajib", "Opsional", "Perhatian"], "Wajib");
  const [editingDoc, setEditingDoc] = useState<{
    doc: KuaDocumentItem;
    spouse: "Andi" | "Risa";
  } | null>(null);

  const andiCompleted = documents.filter((d) => d.statusAndi === "Lengkap").length;
  const risaCompleted = documents.filter((d) => d.statusRisa === "Lengkap").length;
  const attentionCount = documents.filter(
    (d) => d.statusAndi === "Perlu revisi" || d.statusRisa === "Perlu revisi",
  ).length;

  const displayedDocs = useMemo(() => {
    if (filter === "Wajib") return documents.filter((d) => d.requirement === "Wajib");
    if (filter === "Opsional") return documents.filter((d) => d.requirement === "Opsional");
    return documents.filter(
      (d) => d.statusAndi === "Perlu revisi" || d.statusRisa === "Perlu revisi",
    );
  }, [documents, filter]);

  const handleUploaded = (docId: string, spouse: "Andi" | "Risa", fileName?: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        return spouse === "Andi"
          ? {
              ...d,
              statusAndi: "Lengkap",
              notesAndi: undefined,
              fileAndi: fileName || d.fileAndi,
              updatedAt: "Hari ini",
            }
          : {
              ...d,
              statusRisa: "Lengkap",
              notesRisa: undefined,
              fileRisa: fileName || d.fileRisa,
              updatedAt: "Hari ini",
            };
      }),
    );
  };

  return (
    <section className={styles.container}>
      <header>
        <h1 className="font-sans text-3xl font-semibold text-brand-secondary tracking-[-0.9px]">
          Dokumen KUA & syarat nikah
        </h1>
        <p className="text-sm text-secondary">
          Satu checklist untuk berkas kalian berdua. Lengkapi tanpa bolak-balik.
        </p>
      </header>

      <section className={styles.spouseGrid} aria-label="Ringkasan calon pengantin">
        <SummaryCard
          label="Andi Ramadhan ? Mempelai pria"
          value={`${andiCompleted}/7`}
          detail="berkas siap"
          ornament={1}
          highlight
        />
        <SummaryCard
          label="Risa Pratiwi ? Mempelai wanita"
          value={`${risaCompleted}/7`}
          detail="berkas lengkap"
          ornament={2}
        />
      </section>

      <div className={styles.privateNotice} role="note">
        <Icon name="shield" size={16} className="text-brand-secondary shrink-0" />
        <span>
          Berkas pribadi · hanya kalian berdua yang dapat mengakses dan memperbarui salinan ini.
        </span>
      </div>

      <div
        className="flex gap-1.5 rounded-control bg-ux-dock border border-ux-border p-1 w-fit"
        role="tablist"
      >
        <button
          role="tab"
          aria-selected={filter === "Wajib"}
          className={`customer-control rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Wajib"
              ? "bg-surface text-brand-secondary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Wajib")}
        >
          Wajib 7
        </button>
        <button
          role="tab"
          aria-selected={filter === "Opsional"}
          className={`customer-control rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Opsional"
              ? "bg-surface text-brand-secondary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Opsional")}
        >
          Opsional
        </button>
        <button
          role="tab"
          aria-selected={filter === "Perhatian"}
          className={`customer-control rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Perhatian"
              ? "bg-surface text-brand-secondary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Perhatian")}
        >
          Perlu perhatian {attentionCount}
        </button>
      </div>

      <KuaDocumentTable
        documents={displayedDocs}
        onSelectDoc={(doc, spouse) => setEditingDoc({ doc, spouse })}
      />

      <KuaRevisionDialog
        key={editingDoc ? `${editingDoc.doc.id}-${editingDoc.spouse}` : undefined}
        document={editingDoc?.doc || null}
        spouse={editingDoc?.spouse || "Andi"}
        onClose={() => setEditingDoc(null)}
        onUploaded={handleUploaded}
      />
    </section>
  );
}
