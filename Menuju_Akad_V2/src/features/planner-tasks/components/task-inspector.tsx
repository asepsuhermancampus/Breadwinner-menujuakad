"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Dialog } from "@/components/ui/dialog";
import { useCustomerNames } from "@/features/customer-workspace/components/customer-names-context";
import { plannerPersonLabel } from "@/features/customer-workspace/domain/side-profile-names";
import type { PlannerTask, TaskPriority, TaskStatus, TaskPIC } from "../types/tasks";

type Props = {
  creating?: boolean;
  task: PlannerTask | null;
  onClose: () => void;
  onSave: (updated: PlannerTask) => void | Promise<boolean | void>;
};

export function TaskInspector({ task, onClose, onSave, creating = false }: Props) {
  const names = useCustomerNames();
  const [draft, setDraft] = useState<PlannerTask | null>(task);
  const [dirty, setDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!task || !draft) return null;

  const handleClose = () => {
    if (pending) return;
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

  const handleSave = async () => {
    if (pending) return;
    if (!draft.title.trim()) {
      setError("Isi nama tugas terlebih dahulu.");
      return;
    }
    setPending(true);
    setError("");
    try {
      if ((await onSave({ ...draft, title: draft.title.trim() })) === false) {
        setError("Tugas belum tersimpan. Draf tetap tersedia; coba simpan kembali.");
        return;
      }
      setDirty(false);
      onClose();
    } catch {
      setError("Tugas belum tersimpan. Draf tetap tersedia; coba simpan kembali.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Dialog open title={creating ? "Tambah tugas" : "Detail tugas"} onClose={handleClose}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void handleSave();
          }}
        >
          <fieldset disabled={pending} className="grid min-w-0 gap-4 border-0 p-0">
            <Field
              label="Nama tugas"
              required
              maxLength={160}
              value={draft.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
            />

            <Select
              label="Penanggung jawab"
              value={draft.pic}
              onChange={(e) => handleFieldChange("pic", e.target.value as TaskPIC)}
            >
              <option value="Andi">{plannerPersonLabel("Andi", names)}</option>
              <option value="Risa">{plannerPersonLabel("Risa", names)}</option>
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
              <label htmlFor="task-notes" className="text-xs font-medium text-secondary">
                Catatan tambahan
              </label>
              <textarea
                id="task-notes"
                className="customer-control w-full rounded-control border border-border bg-surface p-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                rows={3}
                value={draft.notes || ""}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                placeholder="Tambahkan detail atau instruksi tugas..."
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit">{pending ? "Menyimpan..." : "Simpan perubahan"}</Button>
            </div>
          </fieldset>
        </form>
      </Dialog>

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
