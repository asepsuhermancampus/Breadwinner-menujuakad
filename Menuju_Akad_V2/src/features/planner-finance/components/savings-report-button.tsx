"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { buildFinanceReport } from "../domain/finance-report";
import type { FinanceSnapshot } from "../types/finance-ledger";
import styles from "./customer-savings.module.css";
import controls from "./finance-controls.module.css";

export function SavingsReportButton({
  snapshot,
  pending,
  trial,
  onExport,
  onError,
}: {
  snapshot: FinanceSnapshot;
  pending: boolean;
  trial: boolean;
  onExport?: (() => Promise<boolean>) | undefined;
  onError: (message: string) => void;
}) {
  const [printing, setPrinting] = useState(false);
  async function printReport() {
    if (printing) return;
    onError("");
    if (trial && !onExport) return onError("Laporan belum tersedia. Muat ulang lalu coba lagi.");
    const report = window.open("", "_blank");
    if (!report) return onError("Izinkan jendela pop-up untuk menyimpan laporan PDF.");
    setPrinting(true);
    try {
      if (onExport && !(await onExport())) {
        report.close();
        onError("Laporan belum dapat disimpan. Periksa batas percobaan atau coba lagi.");
        return;
      }
      report.opener = null;
      report.document.open();
      report.document.write(buildFinanceReport(snapshot));
      report.document.close();
      await report.document.fonts.ready;
      if (!report.closed) {
        report.focus();
        report.print();
      }
    } catch {
      report.close();
      onError("Laporan belum dapat dicetak. Silakan coba kembali.");
    } finally {
      setPrinting(false);
    }
  }
  return (
    <div className={styles.report}>
      <Button
        className={`${controls.compact} ${controls.pdf}`}
        variant="secondary"
        disabled={printing || pending}
        onClick={() => void printReport()}
      >
        <Icon name="download" size={16} />
        Simpan laporan PDF
      </Button>
      <span>Pilih “Simpan sebagai PDF” pada dialog cetak.</span>
    </div>
  );
}
