"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { rupiah } from "../content/finance-content";
import { reconcilePayment } from "../domain/finance-reconciliation";
import type { FinanceScreenProps } from "../types/admin-finance";
import { FinanceCheck, FinanceNote, FinanceTable } from "./finance-parts";
import styles from "./finance.module.css";

export function WebhookReview({
  state,
  context,
  onResult,
  transactionId,
  onClose,
}: FinanceScreenProps & { transactionId: string; onClose: () => void }) {
  const row = state.reconciliations.find((item) => item.id === transactionId)!;
  const [expectedVersion] = useState(row.version);
  const [reason, setReason] = useState("Provider settled, status internal tertinggal.");
  const [ack, setAck] = useState(false);
  const [scenario, setScenario] = useState("valid");
  const [message, setMessage] = useState("");
  const key = `PAY:TX${transactionId.replace("TX-", "")}:SETTLED`;
  function submit() {
    const result = reconcilePayment(
      state,
      {
        transactionId,
        expectedVersion: scenario === "stale" ? expectedVersion - 1 : expectedVersion,
        operationId: key,
        reason,
        acknowledged: ack,
        key,
        eventId: `evt-${transactionId.replace("TX-", "")}-settled`,
        paymentId: scenario === "unknown" ? "unknown-payment" : row.paymentId,
        amount: scenario === "amount" ? row.amount + 1 : row.amount,
        currency: "IDR",
        status: scenario === "out-of-order" ? "PENDING" : "SETTLED",
        signatureValid: scenario !== "signature",
      },
      context,
    );
    onResult(result);
    setMessage(result.message);
  }
  return (
    <Dialog open title={`${transactionId} · telusuri event`} side onClose={onClose}>
      <div className={styles.stack}>
        <p className="text-sm leading-7 text-secondary">
          Pratinjau koreksi status, bukan penagihan atau transaksi baru.
        </p>
        <FinanceTable
          label="Verifikasi webhook"
          headers={["Pemeriksaan", "Hasil"]}
          rows={[
            ["Provider / nominal", `KlikQRIS · ${rupiah(row.amount)}`],
            [
              "Status provider terkini",
              row.provider === "settled"
                ? "Settled · contoh terverifikasi"
                : "Expired · tidak dibayar",
            ],
            [
              "Internal / versi",
              `${row.internal === "waiting" ? "Menunggu" : row.internal === "paid" ? "Lunas" : "Kedaluwarsa"} · v${row.version}`,
            ],
            [
              "Signature & sumber",
              scenario === "signature" ? "Tidak valid · diblokir" : "Valid pada contoh ini",
            ],
            [
              "Kunci idempotensi",
              <code key="key" className="break-all text-xs">
                {key}
              </code>,
            ],
          ]}
        />
        <FinanceNote>
          TX-8422: duplikat tetap no-op. Event dengan signature tidak valid, nominal berbeda,
          transaksi asing, atau status mundur diblokir.
        </FinanceNote>
        <Field
          label="Alasan sinkronisasi"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <label className="grid gap-2 text-sm">
          Skenario webhook mock
          <select
            className="min-h-11 rounded-control border border-border px-3"
            value={scenario}
            onChange={(event) => setScenario(event.target.value)}
          >
            <option value="valid">Event valid</option>
            <option value="signature">Signature invalid</option>
            <option value="amount">Nominal tidak cocok</option>
            <option value="unknown">Pembayaran tidak dikenal</option>
            <option value="out-of-order">Event tidak berurutan</option>
            <option value="stale">Versi kedaluwarsa</option>
          </select>
        </label>
        <FinanceCheck checked={ack} onChange={setAck}>
          Saya telah memeriksa transaksi, nominal dan event terverifikasi.
        </FinanceCheck>
        {!context.permissions.reconcile && (
          <FinanceNote>Izin rekonsiliasi tidak tersedia untuk cakupan akun ini.</FinanceNote>
        )}
        {message && (
          <p role="status" className={styles.status}>
            {message}
          </p>
        )}
        <Button onClick={submit} disabled={!context.permissions.reconcile}>
          Sinkronkan status terverifikasi
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Tutup tanpa perubahan
        </Button>
      </div>
    </Dialog>
  );
}
