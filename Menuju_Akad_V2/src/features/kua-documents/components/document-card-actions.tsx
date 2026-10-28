"use client";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { activeDocuments, type DocumentItem } from "../domain/document-template";
import type { DocumentGroup } from "../domain/template-catalog";
import { DocumentActionMenu } from "./document-action-menu";
import styles from "./document-card-actions.module.css";
export function DocumentCardActions({
  items,
  group,
  release,
  reset,
}: {
  items: DocumentItem[];
  group: DocumentGroup;
  release: (group: DocumentGroup) => Promise<boolean>;
  reset: (group: DocumentGroup) => Promise<boolean>;
}) {
  const [action, setAction] = useState<"reset" | "release" | null>(null),
    [pending, setPending] = useState(false);
  const [snapshot, setSnapshot] = useState(""),
    [error, setError] = useState("");
  const triggerId = useId(),
    active = activeDocuments(items);
  const name = `berkas ${group === "main" ? "wajib" : "opsional"}`;
  function choose(next: "reset" | "release") {
    setSnapshot(JSON.stringify(items));
    setError("");
    setAction(next);
  }
  return (
    <>
      <div className={styles.controls}>
        <span className={styles.count} aria-label={`Progres ${name}`}>
          {active.filter((item) => item.completed).length}/{active.length}
        </span>
        <DocumentActionMenu
          id={triggerId}
          label={`Aksi ${name}`}
          actions={[
            {
              label: "Reset centang",
              disabled: pending || !active.some((item) => item.completed),
              run: () => choose("reset"),
            },
            {
              label: "Lepaskan template",
              disabled: pending || !items.some((item) => item.templateId),
              run: () => choose("release"),
            },
          ]}
        />
      </div>
      <Dialog
        open={action !== null}
        title={`${action === "reset" ? "Reset centang" : "Lepaskan template"} ${name}?`}
        onClose={() => {
          if (!pending) setAction(null);
        }}
      >
        <p className="text-sm leading-7 text-secondary">
          {action === "reset"
            ? `Centang pada ${name} akan dikosongkan. Daftar berkas dan catatannya tetap tersimpan.`
            : "Berkas dari template ini beserta centang dan catatannya akan dihapus dari checklist. Dokumen khusus yang dibuat sendiri tetap tersimpan. Template bisa dipilih kembali kapan saja."}
        </p>
        {error && (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        )}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="secondary" disabled={pending} onClick={() => setAction(null)}>
            Batal
          </Button>
          <Button
            variant={action === "release" ? "danger" : "primary"}
            disabled={pending}
            onClick={async () => {
              if (snapshot !== JSON.stringify(items)) {
                setError(
                  "Daftar berkas berubah. Tutup dialog ini dan periksa data terbaru sebelum melanjutkan.",
                );
                return;
              }
              setPending(true);
              setError("");
              try {
                if (await (action === "reset" ? reset(group) : release(group))) {
                  setAction(null);
                  requestAnimationFrame(() => {
                    const trigger = document.getElementById(triggerId) as HTMLButtonElement | null;
                    (trigger && !trigger.disabled
                      ? trigger
                      : document.getElementById("kua-checklist-view")
                    )?.focus();
                  });
                } else
                  setError("Perubahan belum tersimpan. Muat ulang data terbaru lalu coba kembali.");
              } catch {
                setError("Perubahan belum tersimpan. Silakan coba kembali.");
              } finally {
                setPending(false);
              }
            }}
          >
            {pending
              ? "Menyimpan..."
              : action === "reset"
                ? "Ya, reset centang"
                : "Ya, lepaskan template"}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
