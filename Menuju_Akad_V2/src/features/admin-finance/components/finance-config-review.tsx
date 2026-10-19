"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { publishFinanceConfig } from "../domain/finance-settings";
import type { FinanceScreenProps } from "../types/admin-finance";
import { FinanceCheck, FinanceNote, FinanceTable } from "./finance-parts";
import styles from "./finance.module.css";

const initialReason = "Penyesuaian biaya untuk order baru dan rekening penerimaan.";
export function FinanceConfigReview({
  state,
  context,
  onResult,
  onClose,
}: FinanceScreenProps & { onClose: () => void }) {
  const [expectedVersion] = useState(state.config.version);
  const [reason, setReason] = useState(initialReason);
  const [ack, setAck] = useState(false);
  const [bankValidated, setBankValidated] = useState(true);
  const [stale, setStale] = useState(false);
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(context.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = Math.max(0, Math.ceil(((state.otp?.verifiedUntil ?? now) - now) / 1000));
  function close() {
    if (
      (ack || reason !== initialReason) &&
      !window.confirm("Tutup review dan buang perubahan yang belum diterapkan?")
    )
      return;
    onClose();
  }
  function submit() {
    const result = publishFinanceConfig(
      state,
      {
        operationId: `CFG:${expectedVersion + 1}`,
        expectedVersion: stale ? expectedVersion - 1 : expectedVersion,
        reason,
        acknowledged: ack,
        feeBps: 600,
        bankName: "Mandiri",
        bankLast4: "6610",
        bankValidated,
      },
      context,
    );
    onResult(result);
    setMessage(result.message);
    if (result.ok) onClose();
  }
  return (
    <Dialog
      open
      title={`Tinjau perubahan v${expectedVersion} → v${expectedVersion + 1}`}
      onClose={close}
    >
      <div className={styles.stack}>
        <p className="text-sm text-secondary">
          Setelah OTP valid · belum diterapkan. Scope bank dan fee.
        </p>
        <p className={styles.badge}>
          OTP{" "}
          {remaining
            ? `valid · ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
            : "kedaluwarsa"}
        </p>
        <FinanceTable
          label="Perbedaan konfigurasi"
          headers={["Pengaturan", `Aktif v${expectedVersion}`, `Usulan v${expectedVersion + 1}`]}
          rows={[
            ["Platform fee", `${state.config.feeBps / 100}%`, "6% · hanya order baru"],
            [
              "Rekening platform",
              `${state.config.bankName} ••${state.config.bankLast4}`,
              "Mandiri ••6610",
            ],
            [
              "Validasi rekening usulan",
              "—",
              bankValidated ? "Lolos simulasi sandbox" : "Belum valid · diblokir",
            ],
          ]}
        />
        <Field
          label="Alasan perubahan"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <FinanceNote>
          Order lama tidak dihitung ulang. Snapshot fee historis 5% tetap. Izin
          financial_settings.write, masa OTP, validasi bank, dan versi aktif diperiksa saat
          konfirmasi.
        </FinanceNote>
        <details className={styles.simulator}>
          <summary>Skenario review mock</summary>
          <FinanceCheck checked={bankValidated} onChange={setBankValidated}>
            Rekening usulan tervalidasi di sandbox
          </FinanceCheck>
          <FinanceCheck checked={stale} onChange={setStale}>
            Simulasikan versi review kedaluwarsa
          </FinanceCheck>
        </details>
        <FinanceCheck checked={ack} onChange={setAck}>
          Saya meninjau bank, fee, dampak ke order baru dan alasan perubahan.
        </FinanceCheck>
        {message && (
          <p role="status" className={styles.status}>
            {message}
          </p>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={close}>
            Batalkan
          </Button>
          <Button onClick={submit}>Konfirmasi perubahan</Button>
        </div>
      </div>
    </Dialog>
  );
}
