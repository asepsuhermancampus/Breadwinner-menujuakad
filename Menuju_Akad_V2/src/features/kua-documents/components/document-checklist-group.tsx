import { Icon } from "@/components/ui/icon";
import { CardOrnament } from "@/components/ui/card-ornament";
import {
  activeDocuments,
  type DocumentItem,
  type DocumentReleaseScope,
} from "../domain/document-template";
import type { DocumentGroup } from "../domain/template-catalog";
import { DocumentCardActions } from "./document-card-actions";
import styles from "./document-checklist.module.css";
import rows from "@/features/customer-workspace/components/customer-documents.module.css";
import flow from "./document-workflow.module.css";
export function DocumentChecklistGroup({
  main,
  items,
  toggle,
  edit,
  remove,
  release,
  reset,
}: {
  main: boolean;
  items: DocumentItem[];
  toggle: (item: DocumentItem) => void;
  edit: (item: DocumentItem) => void;
  remove: (item: DocumentItem) => void;
  release: (scope: DocumentReleaseScope) => Promise<boolean>;
  reset: (group: DocumentGroup) => Promise<boolean>;
}) {
  const title = main ? "Berkas wajib" : "Berkas opsional";
  const active = activeDocuments(items);
  return (
    <section
      className={flow.templateCard}
      aria-label={title}
      id={main ? "kua-main" : "kua-additional"}
      tabIndex={-1}
    >
      <CardOrnament variant={main ? 2 : 4} />
      <div className={flow.cardHeading}>
        <h2>{title}</h2>
        <DocumentCardActions
          items={items}
          group={main ? "main" : "additional"}
          release={release}
          reset={reset}
        />
      </div>
      <p className={flow.description}>
        {main
          ? "Berkas umum dan administrasi nikah. Isi dokumen dikunci; centang berkas yang sudah siap."
          : "Sesuaikan dokumen dengan kondisi kalian. Berkas dapat diedit dan dihapus."}
      </p>
      {active.length === 0 ? (
        <p className={styles.empty}>
          {main
            ? "Belum ada berkas wajib yang dipilih."
            : "Belum ada berkas opsional. Tambahkan hanya yang sesuai kebutuhan kalian."}
        </p>
      ) : (
        <ul className={`${styles.list} ${flow.checklistList} app-scroll`}>
          {active.map((item) => (
            <li key={item.id} className={`${rows.row} ${main ? styles.required : ""}`}>
              <input
                type="checkbox"
                aria-label={`Selesai ${item.title}`}
                checked={item.completed ?? false}
                onChange={() => toggle(item)}
              />
              <span className={rows.details}>
                {item.title}
                {!main &&
                  item.notes &&
                  item.notes !== "Sesuaikan kebutuhan dan format dengan KUA setempat." && (
                    <small>{item.notes}</small>
                  )}
              </span>
              {!main && (
                <>
                  <button
                    type="button"
                    className={rows.action}
                    aria-label={`Edit ${item.title}`}
                    title={`Edit ${item.title}`}
                    onClick={() => edit(item)}
                  >
                    <Icon name="pencil" size={17} />
                  </button>
                  <button
                    type="button"
                    className={`${rows.action} ${rows.remove}`}
                    aria-label={`Hapus ${item.title}`}
                    title={`Hapus ${item.title}`}
                    onClick={() => remove(item)}
                  >
                    <Icon name="trash" size={17} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
