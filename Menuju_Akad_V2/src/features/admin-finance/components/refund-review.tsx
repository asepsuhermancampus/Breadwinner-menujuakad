"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { rupiah } from "../content/finance-content";
import { refundImpact, requestFinanceRefund } from "../domain/finance-money";
import type { FinanceScreenProps, RefundInput } from "../types/admin-finance";
import { FinanceCheck, FinanceNote, FinanceTable } from "./finance-parts";
import styles from "./finance.module.css";

export function RefundReview({
  state,
  context,
  onResult,
  onClose,
}: FinanceScreenProps & { onClose: () => void }) {
  const [expectedVersion] = useState(state.payment.version);
  const [expectedDisputeVersion] = useState(state.dispute.version);
  const [amount, setAmount] = useState(5_000_000);
  const [reason, setReason] = useState(
    "Penyelesaian sengketa DS-019 sesuai bukti dan tanggapan vendor.",
  );
  const [ack, setAck] = useState(false);
  const [response, setResponse] = useState<RefundInput["response"]>("accepted");
  const [message, setMessage] = useState("");
  const impact = refundImpact(amount);
  function submit() {
    const result = requestFinanceRefund(
      state,
      {
        operationId: "RF:PAY8300:01",
        expectedVersion,
        expectedDisputeVersion,
        paymentId: "PAY8300",
        disputeId: "DS-019",
        amount,
        originalMethod: true,
        reason,
        acknowledged: ack,
        response,
      },
      context,
    );
    onResult(result);
    setMessage(result.message);
  }
  return (
    <Dialog open title={`Tinjau refund ${rupiah(amount)}`} onClose={onClose}>
      <div className={styles.stack}>
        <p className="text-sm text-secondary">DS-019 · PAY8300 · hanya metode asal KlikQRIS.</p>
        <FinanceTable
          label="Dampak sebelum dan sesudah refund"
          headers={["Komponen", "Sebelum", "Setelah berhasil"]}
          rows={[
            ["Pembayaran bersih pelanggan", rupiah(15_000_000), rupiah(impact.remaining)],
            ["Fee platform · 5%", rupiah(impact.feeBefore), rupiah(impact.feeAfter)],
            ["Hak vendor", rupiah(impact.vendorBefore), rupiah(impact.vendorAfter)],
            ["Dikembalikan ke pelanggan", "—", rupiah(amount)],
          ]}
        />
        <FinanceNote>
          <strong>Cegah refund ganda</strong>
          <br />
          Kunci RF:PAY8300:01. Pembalikan fee {rupiah(impact.feeReversal)} + pengurangan hak vendor{" "}
          {rupiah(impact.vendorReduction)} = {rupiah(amount)}. Hasil timeout/unknown harus diperiksa
          dengan permintaan yang sama.
        </FinanceNote>
        <Field
          label="Nominal refund (IDR)"
          type="number"
          min={1}
          max={15_000_000}
          step={1}
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
        />
        <Field
          label="Alasan refund"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <label className="grid gap-2 text-sm">
          Respons provider mock
          <select
            className="min-h-11 rounded-control border border-border px-3"
            value={response}
            onChange={(event) => setResponse(event.target.value as RefundInput["response"])}
          >
            <option value="accepted">Diterima · menunggu provider</option>
            <option value="unknown">Timeout · hasil belum diketahui</option>
            <option value="failed">Gagal · tidak diterapkan</option>
          </select>
        </label>
        <FinanceCheck checked={ack} onChange={setAck}>
          Saya menyetujui nominal, pembalikan fee, hak vendor dan metode asal.
        </FinanceCheck>
        {!context.permissions.refund && (
          <FinanceNote>Izin mengajukan refund tidak tersedia pada cakupan akun ini.</FinanceNote>
        )}
        {message && (
          <p role="status" className={styles.status}>
            {message}
          </p>
        )}
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Kembali
          </Button>
          <Button onClick={submit} disabled={!context.permissions.refund}>
            {state.payment.reservedRefund ? "Periksa permintaan yang sama" : "Ajukan refund"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
