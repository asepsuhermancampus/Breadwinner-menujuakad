"use client";
import { useState } from "react";
import { useCommittedList } from "@/hooks/use-committed-list";
import { DocumentChecklistProgress } from "./document-checklist-progress";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/page-heading";
import { Icon } from "@/components/ui/icon";
import { DocumentChecklistDialogs } from "./document-checklist-dialogs";
import {
  activeDocuments,
  applyDocumentTemplate,
  addSelectedDocuments,
  removeDocument,
  releaseDocumentTemplates,
  resetDocumentChecks,
  type DocumentItem,
} from "../domain/document-template";
import { documentSource } from "../domain/template-catalog";
import { DocumentTemplatePicker } from "./document-template-picker";
import { DocumentChecklistGroup } from "./document-checklist-group";
import { DocumentManualPicker } from "./document-manual-picker";
import { DocumentExportButton } from "./document-export-button";
import flow from "./document-workflow.module.css";
import styles from "./document-checklist.module.css";
export function DocumentChecklistScreen({
  initial,
  onChange,
}: {
  initial: DocumentItem[];
  onChange: (items: DocumentItem[]) => Promise<boolean>;
}) {
  const [items, update] = useCommittedList(initial, onChange);
  const [editing, setEditing] = useState<DocumentItem | null>(null);
  const [manual, setManual] = useState(false),
    [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [view, setView] = useState<"checklist" | "templates">("checklist");
  const active = activeDocuments(items),
    complete = active.filter((item) => item.completed).length;
  async function save(next: DocumentItem[]) {
    if (pending) return false;
    setPending(true);
    try {
      const ok = await update(next);
      setNotice(
        ok ? "" : "Perubahan belum tersimpan. Periksa koneksi atau muat ulang data terbaru.",
      );
      return ok;
    } finally {
      setPending(false);
    }
  }
  return (
    <section className={styles.screen} aria-busy={pending}>
      <PageHeading
        title="Persyaratan KUA"
        description="Siapkan dokumen pernikahan secara bertahap, sesuai kebutuhan kalian."
      />
      <div className={flow.toolbar}>
        <nav aria-label="Tampilan berkas KUA" className={flow.navigation} data-customer-tabs>
          <button
            type="button"
            aria-pressed={view === "checklist"}
            id="kua-checklist-view"
            onClick={() => setView("checklist")}
          >
            Checklist saya
          </button>
          <button
            type="button"
            aria-pressed={view === "templates"}
            onClick={() => setView("templates")}
          >
            Pilih template
          </button>
        </nav>
        {view === "checklist" && (
          <div className={styles.actions}>
            <Button disabled={pending} onClick={() => setManual(true)}>
              <Icon name="plus" size={16} />
              Mulai berkas utama
            </Button>
            <DocumentExportButton items={items} disabled={pending} />
          </div>
        )}
      </div>
      {notice && (
        <p role="status" className={styles.notice}>
          {notice}
        </p>
      )}
      <div hidden={view !== "checklist"} className={flow.checklists}>
        {!items.length ? (
          <div className={flow.blank}>
            <Icon name="documents" size={34} />
            <h2>Belum ada berkas di checklist kalian</h2>
            <p>
              Pilih berkas secara manual melalui Mulai berkas utama, atau gunakan template untuk
              menyiapkan daftar sesuai kebutuhan kalian.
            </p>
            <Button variant="secondary" onClick={() => setView("templates")}>
              Pilih template
            </Button>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <DocumentChecklistProgress complete={complete} total={active.length} />
            )}
            <fieldset disabled={pending} className={flow.columns}>
              {(["main", "additional"] as const).map((group) => (
                <DocumentChecklistGroup
                  key={group}
                  main={group === "main"}
                  items={items.filter((item) => (item.group ?? "additional") === group)}
                  toggle={(item) =>
                    void save(
                      items.map((row) =>
                        row.id === item.id ? { ...row, completed: !row.completed } : row,
                      ),
                    )
                  }
                  edit={setEditing}
                  remove={(item) => void save(removeDocument(items, item.id))}
                  release={(scope) => save(releaseDocumentTemplates(items, scope))}
                  reset={(group) => save(resetDocumentChecks(items, group))}
                />
              ))}
            </fieldset>
          </>
        )}
      </div>
      {view === "templates" && (
        <DocumentTemplatePicker
          items={items}
          apply={async (id) => {
            const ok = await save(applyDocumentTemplate(items, id));
            if (ok) {
              setView("checklist");
              requestAnimationFrame(() =>
                document.getElementById(id === "main" ? "kua-main" : "kua-additional")?.focus(),
              );
            }
            return ok;
          }}
        />
      )}
      {(active.length > 0 || view === "templates") && (
        <p className={styles.guidance}>
          Berkas kondisional mengikuti keadaan calon pengantin. Format layanan dikonfirmasi ke KUA
          setempat.{" "}
          <a href={documentSource} target="_blank" rel="noreferrer">
            PMA 30/2024 <Icon name="external-link" size={13} />
          </a>
        </p>
      )}
      {manual && (
        <DocumentManualPicker
          items={items}
          close={() => setManual(false)}
          add={(ids) => save(addSelectedDocuments(items, ids))}
          custom={(item) => save([...items, item])}
        />
      )}
      <DocumentChecklistDialogs
        editing={editing}
        closeEdit={() => setEditing(null)}
        saveEdit={async (next) => {
          if (
            !editing ||
            editing.group === "main" ||
            JSON.stringify(items.find((item) => item.id === editing.id)) !== JSON.stringify(editing)
          )
            return false;
          return save(items.map((item) => (item.id === next.id ? next : item)));
        }}
      />
    </section>
  );
}
