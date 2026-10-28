"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { documentOptions, type DocumentItem } from "../domain/document-template";
import { DocumentAddForm } from "./document-add-form";
import flow from "./document-workflow.module.css";
export function DocumentManualPicker({
  items,
  add,
  custom,
  close,
}: {
  items: DocumentItem[];
  add: (ids: string[]) => Promise<boolean>;
  custom: (item: DocumentItem) => Promise<boolean>;
  close: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [group, setGroup] = useState("main");
  const options = documentOptions().filter(
    (item) => !items.some((current) => current.id === item.id),
  );
  return (
    <Dialog
      open
      title="Pilih berkas yang ingin disiapkan"
      onClose={() => {
        if (!busy) close();
      }}
    >
      <p className={flow.description}>
        Pilih satu atau beberapa berkas. Hanya pilihan kalian yang akan ditambahkan ke checklist.
      </p>
      <fieldset disabled={busy} className={flow.selection}>
        <div
          className={flow.navigation}
          role="group"
          aria-label="Kategori pilihan berkas"
          data-customer-tabs
        >
          <button type="button" aria-pressed={group === "main"} onClick={() => setGroup("main")}>
            Berkas wajib
          </button>
          <button
            type="button"
            aria-pressed={group === "additional"}
            onClick={() => setGroup("additional")}
          >
            Berkas opsional
          </button>
        </div>
        <div className={`${flow.optionList} app-scroll`}>
          {options
            .filter((item) => item.group === group)
            .map((item) => (
              <label key={item.id} className={flow.option}>
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={(event) =>
                    setSelected(
                      event.target.checked
                        ? [...selected, item.id]
                        : selected.filter((id) => id !== item.id),
                    )
                  }
                />
                <span>
                  {item.title}
                  {item.notes && <small>{item.notes}</small>}
                </span>
              </label>
            ))}
          {!options.some((item) => item.group === group) && (
            <p className={flow.description}>
              Semua berkas pada kategori ini sudah pernah ditambahkan.
            </p>
          )}
        </div>
        <p className={flow.description}>{selected.length} berkas dipilih</p>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className={flow.dialogActions}>
          <Button
            disabled={!selected.length}
            onClick={async () => {
              setBusy(true);
              setError("");
              try {
                if (await add(selected)) close();
                else setError("Berkas belum tersimpan. Silakan coba kembali.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Menambahkan..." : "Tambahkan"}
          </Button>
          <Button variant="secondary" onClick={close}>
            Batal
          </Button>
        </div>
        <details className={flow.manual}>
          <summary>Tambah berkas khusus</summary>
          <DocumentAddForm
            add={async (item) => {
              setBusy(true);
              try {
                const ok = await custom(item);
                if (ok) close();
                return ok;
              } finally {
                setBusy(false);
              }
            }}
          />
        </details>
      </fieldset>
    </Dialog>
  );
}
