"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { rupiah } from "../content/finance-content";
import { scheduleFinancePayout } from "../domain/finance-money";
import type { FinanceScreenProps, PayoutRow } from "../types/admin-finance";
import { FinanceCard, FinanceCheck, FinanceNote, FinanceTable } from "./finance-parts";
import styles from "./finance.module.css";

export function PayoutReview({
  row,
  state,
  context,
  onResult,
}: FinanceScreenProps & { row: PayoutRow }) {
  const [expectedVersion] = useState(row.version);
  const [ack, setAck] = useState(false);
  const [reason, setReason] = useState("Layanan selesai, rekening dan kelayakan ditinjau.");
  const [message, setMessage] = useState("");
  const eligible = row.bankVerified && !row.disputed && row.serviceComplete;
  return (
    <FinanceCard title={`${row.id} · ${row.vendor}`}>
      <div className={styles.stack}>
        <FinanceTable
          label="Review kelayakan payout"
          headers={["Pemeriksaan", "Hasil"]}
          rows={[
            ["Nominal", rupiah(row.amount)],
            ["Tujuan aktif", `BCA ••${row.bankLast4}`],
            ["Layanan selesai", row.serviceComplete ? "Diterima dan selesai" : "Belum selesai"],
            ["Hold dana", `${rupiah(row.holdAmount)} · sudah dicatat`],
            ["Rekening terverifikasi", row.bankVerified ? "Terverifikasi" : "Belum lolos"],
            ["Sengketa aktif", row.disputed ? "Ada · ditahan" : "Tidak ada"],
            ["Jadwal usulan", "26 Oktober 2026 · batch bank berikutnya"],
          ]}
        />
        <FinanceNote>
          Penjadwalan belum berarti transfer berhasil. Hold sudah dicatat saat permohonan diterima
          dan tidak dipotong lagi.
        </FinanceNote>
        <Field
          label="Alasan penjadwalan"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
        <FinanceCheck checked={ack} onChange={setAck}>
          Saya meninjau tujuan, kelayakan dan jadwal ini.
        </FinanceCheck>
        {(!eligible || !context.permissions.payout) && (
          <FinanceNote>
            {!eligible
              ? "Permohonan belum memenuhi seluruh syarat penjadwalan."
              : "Izin menjadwalkan payout tidak tersedia."}
          </FinanceNote>
        )}
        <Button
          disabled={!eligible || !context.permissions.payout || row.status === "scheduled"}
          onClick={() => {
            const result = scheduleFinancePayout(
              state,
              row.id,
              {
                operationId: `PAYOUT:${row.id}:SCHEDULE`,
                expectedVersion,
                reason,
                acknowledged: ack,
              },
              context,
            );
            onResult(result);
            setMessage(result.message);
          }}
        >
          {row.status === "scheduled" ? "Dijadwalkan · belum transfer" : `Jadwalkan ${row.id}`}
        </Button>
        {message && (
          <p role="status" className={styles.status}>
            {message}
          </p>
        )}
      </div>
    </FinanceCard>
  );
}
