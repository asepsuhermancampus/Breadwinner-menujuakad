"use client";
import { useState, useMemo } from "react";
import { Icon } from "@/components/ui/icon";
import type { KuaDocumentItem } from "../types/kua";
import { KuaRevisionDialog } from "./kua-revision-dialog";
import styles from "./kua.module.css";

type Props = {
  initialDocuments: KuaDocumentItem[];
};

export function KuaScreen({ initialDocuments }: Props) {
  const [documents, setDocuments] = useState<KuaDocumentItem[]>(initialDocuments);
  const [filter, setFilter] = useState<"Wajib" | "Opsional" | "Perhatian">("Wajib");
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

  const handleUploaded = (docId: string, spouse: "Andi" | "Risa") => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id !== docId) return d;
        return spouse === "Andi"
          ? { ...d, statusAndi: "Lengkap", notesAndi: undefined, updatedAt: "Hari ini" }
          : { ...d, statusRisa: "Lengkap", notesRisa: undefined, updatedAt: "Hari ini" };
      }),
    );
  };

  return (
    <main id="main-content" className={styles.container}>
      <header>
        <h1 className="font-sans text-3xl font-semibold text-primary tracking-[-0.9px]">
          Dokumen KUA & syarat nikah
        </h1>
        <p className="text-sm text-secondary">
          Satu checklist untuk berkas kalian berdua. Lengkapi tanpa bolak-balik.
        </p>
      </header>

      <section className={styles.spouseGrid} aria-label="Ringkasan calon pengantin">
        <article className={styles.spouseCard}>
          <div className="flex items-center gap-3">
            <span className={styles.avatar}>A</span>
            <div>
              <strong className="block text-sm text-foreground">Andi Ramadhan</strong>
              <span className="text-xs text-secondary">Mempelai pria</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-semibold text-primary">{andiCompleted}/7</span>
            <span className="block text-xs text-secondary">berkas siap</span>
          </div>
        </article>

        <article className={styles.spouseCard}>
          <div className="flex items-center gap-3">
            <span className={styles.avatar}>R</span>
            <div>
              <strong className="block text-sm text-foreground">Risa Pratiwi</strong>
              <span className="text-xs text-secondary">Mempelai wanita</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-semibold text-emerald-700">
              {risaCompleted}/7
            </span>
            <span className="block text-xs text-secondary">berkas lengkap</span>
          </div>
        </article>
      </section>

      <div className={styles.privateNotice} role="note">
        <Icon name="shield" size={16} className="text-primary shrink-0" />
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
          className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Wajib"
              ? "bg-surface text-primary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Wajib")}
        >
          Wajib 7
        </button>
        <button
          role="tab"
          aria-selected={filter === "Opsional"}
          className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Opsional"
              ? "bg-surface text-primary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Opsional")}
        >
          Opsional
        </button>
        <button
          role="tab"
          aria-selected={filter === "Perhatian"}
          className={`rounded-control px-3.5 py-1.5 text-xs font-medium transition ${
            filter === "Perhatian"
              ? "bg-surface text-primary shadow-sm font-semibold"
              : "text-secondary hover:text-foreground"
          }`}
          onClick={() => setFilter("Perhatian")}
        >
          Perlu perhatian {attentionCount}
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Dokumen</th>
              <th>Syarat</th>
              <th>Andi · Pria</th>
              <th>Risa · Wanita</th>
              <th>Diperbarui</th>
            </tr>
          </thead>
          <tbody>
            {displayedDocs.map((doc) => (
              <tr key={doc.id}>
                <td className="font-medium text-foreground">{doc.name}</td>
                <td className="text-xs text-secondary">{doc.requirement}</td>
                <td>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                      doc.statusAndi === "Lengkap"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose/10 text-rose font-medium cursor-pointer"
                    }`}
                    onClick={() =>
                      doc.statusAndi === "Perlu revisi" && setEditingDoc({ doc, spouse: "Andi" })
                    }
                  >
                    {doc.statusAndi} {doc.statusAndi === "Perlu revisi" ? "✏" : ""}
                  </span>
                </td>
                <td>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                      doc.statusRisa === "Lengkap"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose/10 text-rose font-medium cursor-pointer"
                    }`}
                    onClick={() =>
                      doc.statusRisa === "Perlu revisi" && setEditingDoc({ doc, spouse: "Risa" })
                    }
                  >
                    {doc.statusRisa}
                  </span>
                </td>
                <td className="font-mono text-xs text-secondary">{doc.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <KuaRevisionDialog
        document={editingDoc?.doc || null}
        spouse={editingDoc?.spouse || "Andi"}
        onClose={() => setEditingDoc(null)}
        onUploaded={handleUploaded}
      />
    </main>
  );
}
