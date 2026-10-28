"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Dialog } from "@/components/ui/dialog";
import { useTrial } from "@/features/dashboard-trial/components/trial-provider";
import { activeDocuments, type DocumentItem } from "../domain/document-template";
import { buildDocumentCsv, buildDocumentReport } from "../domain/document-report";
import flow from "./document-workflow.module.css";
export function DocumentExportButton({
  items,
  disabled,
}: {
  items: DocumentItem[];
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const trial = useTrial();
  async function print() {
    const report = window.open("", "_blank");
    if (!report) {
      setError("Izinkan popup untuk membuka laporan PDF.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (trial && !(await trial.consumeExport())) {
        report.close();
        setError("Export belum tersedia. Periksa batas percobaan lalu coba kembali.");
        return;
      }
      report.opener = null;
      report.document.open();
      report.document.write(buildDocumentReport(items));
      report.document.close();
      await report.document.fonts.ready;
      if (!report.closed) {
        report.focus();
        report.print();
      }
    } catch {
      report.close();
      setError("Laporan belum dapat dibuka. Silakan coba kembali.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="secondary"
        disabled={disabled || !activeDocuments(items).length}
        onClick={() => setOpen(true)}
      >
        <Icon name="download" size={16} />
        Export berkas
      </Button>
      <Dialog
        open={open}
        title="Export checklist KUA"
        onClose={() => {
          if (!busy) setOpen(false);
        }}
      >
        <p className={flow.description}>
          Simpan checklist dan catatan berkas sebagai PDF atau CSV yang dapat dibuka di Excel.
        </p>
        <div className={flow.dialogActions}>
          <Button disabled={busy} onClick={() => void print()}>
            Simpan PDF
          </Button>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([buildDocumentCsv(items)], { type: "text/csv;charset=utf-8;" }),
              );
              const link = document.createElement("a");
              link.href = url;
              link.download = "checklist-persyaratan-kua.csv";
              link.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Unduh CSV
          </Button>
        </div>
        <p className={flow.description}>Untuk PDF, pilih “Simpan sebagai PDF” pada dialog cetak.</p>
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </Dialog>
    </>
  );
}
