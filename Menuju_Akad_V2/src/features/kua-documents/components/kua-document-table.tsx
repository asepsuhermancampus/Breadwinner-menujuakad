"use client";

import type { KuaDocumentItem } from "../types/kua";
import styles from "./kua.module.css";

type Props = {
  documents: KuaDocumentItem[];
  onSelectDoc: (doc: KuaDocumentItem, spouse: "Andi" | "Risa") => void;
};

export function KuaDocumentTable({ documents, onSelectDoc }: Props) {
  return (
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
          {documents.map((doc) => (
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
                  onClick={() => doc.statusAndi === "Perlu revisi" && onSelectDoc(doc, "Andi")}
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
                  onClick={() => doc.statusRisa === "Perlu revisi" && onSelectDoc(doc, "Risa")}
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
  );
}
