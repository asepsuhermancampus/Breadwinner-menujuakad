"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { KuaDocumentItem } from "../types/kua";

type Props = {
  document: KuaDocumentItem | null;
  spouse: "Andi" | "Risa";
  onClose: () => void;
  onUploaded: (docId: string, spouse: "Andi" | "Risa", fileName: string) => void;
};

export function KuaRevisionDialog({ document, spouse, onClose, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  if (!document) return null;

  const notes = spouse === "Andi" ? document.notesAndi : document.notesRisa;
  const currentStatus = spouse === "Andi" ? document.statusAndi : document.statusRisa;

  const handleSimulateUpload = () => {
    if (!file) {
      setError("Pilih berkas terlebih dahulu.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(25);

    setTimeout(() => setProgress(65), 250);
    setTimeout(() => {
      setProgress(100);
      setUploading(false);
      onUploaded(document.id, spouse, file.name);
      onClose();
    }, 600);
  };

  return (
    <Dialog open={Boolean(document)} onClose={onClose} title="Unggah revisi berkas KUA">
      <div className="space-y-4">
        <div>
          <span className="text-xs text-secondary">
            {spouse === "Andi" ? "Andi Ramadhan (Pria)" : "Risa Pratiwi (Wanita)"}
          </span>
          <h3 className="text-base font-semibold text-foreground">{document.name}</h3>
          <p className="mt-0.5 text-xs text-secondary">
            Status saat ini: <strong className="text-rose">{currentStatus}</strong>
          </p>
        </div>

        {notes && (
          <div className="rounded-control bg-amber-50 p-3 text-xs text-amber-800">
            <strong>Catatan koreksi KUA:</strong>
            <p className="mt-1">{notes}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-medium text-secondary">
            Pilih dokumen pengganti (PDF / JPG / PNG max 5MB)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setError("");
              }
            }}
            className="w-full text-xs text-secondary file:mr-3 file:rounded-control file:border-0 file:bg-subtle file:px-3 file:py-2 file:text-xs file:font-medium file:text-foreground hover:file:bg-border"
          />
          {error && <p className="text-xs text-rose">{error}</p>}
        </div>

        {uploading && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-secondary">
              <span>Mengunggah dokumen privat…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-subtle overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="rounded-control border border-border bg-subtle p-3 text-xs text-secondary flex items-start gap-2">
          <Icon name="shield" size={16} className="text-primary mt-0.5 shrink-0" />
          <span>
            Berkas tersimpan aman dan terenkripsi. Berkas versi lama tetap tersimpan sampai berkas
            baru terverifikasi resmi.
          </span>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={uploading}>
            Batal
          </Button>
          <Button onClick={handleSimulateUpload} disabled={uploading}>
            {uploading ? "Menyimpan…" : "Kirim berkas revisi"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
