"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardOrnament } from "@/components/ui/card-ornament";
import { documentTemplates } from "../domain/template-catalog";
import { documentOptions, type DocumentItem } from "../domain/document-template";
import flow from "./document-workflow.module.css";
export function DocumentTemplatePicker({
  items,
  apply,
}: {
  items: DocumentItem[];
  apply: (id: string) => Promise<boolean>;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  return (
    <section aria-label="Template berkas" className={flow.columns}>
      {["main", "optional"].map((id, index) => {
        const template = documentTemplates.find((entry) => entry.id === id)!;
        const options = documentOptions().filter((item) =>
          id === "main" ? item.group === "main" : item.group === "additional",
        );
        const applied = options.every((item) => items.some((saved) => saved.id === item.id));
        return (
          <article key={id} className={flow.templateCard}>
            <CardOrnament variant={index === 0 ? 1 : 3} />
            <div className={flow.cardHeading}>
              <h2>{id === "main" ? "Template berkas wajib" : "Template berkas opsional"}</h2>
              <span>{template.items.length} berkas</span>
            </div>
            <p className={flow.description}>
              {id === "main"
                ? "Berkas umum untuk kedua calon pengantin, termasuk administrasi pendaftaran, pemeriksaan nikah, dan panduan pas foto."
                : "Persyaratan sesuai kondisi calon pengantin dan berkas pilihan. Setelah ditambahkan, hapus atau sesuaikan yang tidak berlaku untuk kalian."}
            </p>
            <ul className={`${flow.templateList} app-scroll`}>
              {template.items.map((title, position) => (
                <li key={position}>{title}</li>
              ))}
            </ul>
            <p className={flow.description}>
              {id === "main"
                ? "Isi berkas dikunci; kalian dapat mencentang kesiapan setiap dokumen."
                : "Dapat diedit dan dihapus mengikuti kondisi serta kebutuhan kalian."}
            </p>
            <Button
              disabled={applied || busy !== null}
              onClick={async () => {
                setBusy(id);
                try {
                  await apply(id);
                } finally {
                  setBusy(null);
                }
              }}
            >
              {applied ? "Sudah ditambahkan" : busy === id ? "Menambahkan..." : "Gunakan template"}
            </Button>
          </article>
        );
      })}
    </section>
  );
}
