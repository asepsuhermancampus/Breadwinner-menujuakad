"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import type { PlannerTask, TaskPriority, TaskStatus, TaskPIC } from "../types/tasks";
import styles from "./tasks.module.css";

type Props = {
  task: PlannerTask | null;
  onClose: () => void;
  onSave: (updated: PlannerTask) => void;
};

export function TaskInspector({ task, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<PlannerTask | null>(task);
  const [dirty, setDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!task || !draft) return null;

  const handleClose = () => {
    if (dirty) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  const handleFieldChange = <K extends keyof PlannerTask>(key: K, value: PlannerTask[K]) => {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : null));
    setDirty(true);
  };

  const handleSave = () => {
    if (draft) {
      onSave(draft);
      setDirty(false);
      onClose();
    }
  };

  return (
    <>
      <div className={styles.inspectorDrawer} role="dialog" aria-labelledby="inspector-title">
        <header className={styles.inspectorHeader}>
          <h2 id="inspector-title" className="text-base font-semibold text-foreground">
            Detail tugas
          </h2>
          <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Tutup panel">
            ✕
          </Button>
        </header>

        <div className={styles.inspectorBody}>
          <Field
            label="Nama tugas"
            value={draft.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
          />

          <Select
            label="Penanggung jawab"
            value={draft.pic}
            onChange={(e) => handleFieldChange("pic", e.target.value as TaskPIC)}
          >
            <option value="Andi">Andi Ramadhan</option>
            <option value="Risa">Risa Pratiwi</option>
            <option value="Bersama">Bersama</option>
          </Select>

          <Select
            label="Prioritas"
            value={draft.priority}
            onChange={(e) => handleFieldChange("priority", e.target.value as TaskPriority)}
          >
            <option value="Tinggi">Tinggi</option>
            <option value="Normal">Normal</option>
            <option value="Rendah">Rendah</option>
          </Select>

          <Select
            label="Status pengerjaan"
            value={draft.status}
            onChange={(e) => handleFieldChange("status", e.target.value as TaskStatus)}
          >
            <option value="Menunggu">Menunggu</option>
            <option value="Dikerjakan">Dikerjakan</option>
            <option value="Selesai">Selesai</option>
          </Select>

          <Field
            label="Tenggat waktu"
            value={draft.dueDate}
            onChange={(e) => handleFieldChange("dueDate", e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-secondary">Catatan tambahan</label>
            <textarea
              className="w-full rounded-control border border-border bg-surface p-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              rows={3}
              value={draft.notes || ""}
              onChange={(e) => handleFieldChange("notes", e.target.value)}
              placeholder="Tambahkan detail atau instruksi tugas..."
            />
          </div>
        </div>

        <footer className={styles.inspectorFooter}>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan perubahan</Button>
        </footer>
      </div>

      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Perubahan belum tersimpan"
      >
        <p className="text-sm text-secondary">
          Kamu memiliki perubahan yang belum disimpan. Tetap keluar dan buang perubahan?
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Lanjut mengedit
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setShowConfirm(false);
              setDirty(false);
              onClose();
            }}
          >
            Buang perubahan
          </Button>
        </div>
      </Dialog>
    </>
  );
}
