"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { rupiah } from "../content/finance-content";
import { isPayoutEligible } from "../domain/finance-money";
import type { FinanceScreenProps, PayoutRow } from "../types/admin-finance";
import {
  FinanceCard,
  FinanceHeader,
  FinanceMetrics,
  FinanceNote,
  FinanceTable,
} from "./finance-parts";
import { PayoutReview } from "./payout-review";
import styles from "./finance.module.css";

export function payoutStatus(row: PayoutRow) {
  if (row.status === "scheduled") return "Dijadwalkan · belum transfer";
  if (row.disputed) return "Ditahan · sengketa";
  if (!row.bankVerified) return "Rekening belum lolos";
  if (!row.serviceComplete) return "Layanan belum selesai";
  if (row.holdAmount !== row.amount) return "Hold belum sesuai";
  return "Layak dijadwalkan";
}
export function FinancePayouts(props: FinanceScreenProps) {
  const [selected, setSelected] = useState("WD-105");
  const total = props.state.payouts.reduce((sum, row) => sum + row.amount, 0);
  const eligibleRows = props.state.payouts.filter(isPayoutEligible);
  const eligible = eligibleRows.reduce((sum, row) => sum + row.amount, 0);
  const scheduledRows = props.state.payouts.filter((row) => row.status === "scheduled");
  const scheduled = scheduledRows.reduce((sum, row) => sum + row.amount, 0);
  const heldRows = props.state.payouts.filter(
    (row) => row.status !== "scheduled" && !isPayoutEligible(row),
  );
  const held = heldRows.reduce((sum, row) => sum + row.amount, 0);
  return (
    <>
      <FinanceHeader
        title="Layak dicairkan tidak berarti sudah terkirim."
        detail="Filter Mitra Vendor · contoh sesudah WD-105 diterima · revalidasi sebelum penjadwalan."
        action={<Button onClick={() => setSelected("WD-105")}>Tinjau permohonan</Button>}
      />
      <FinanceMetrics
        items={[
          {
            label: "Antrean permohonan",
            value: rupiah(total),
            detail: `${props.state.payouts.length} permohonan · pencairan vendor`,
          },
          {
            label: "Layak dijadwalkan",
            value: rupiah(eligible),
            detail: `${eligibleRows.length} permohonan · siap diproses`,
          },
          {
            label: "Dijadwalkan",
            value: rupiah(scheduled),
            detail: `${scheduledRows.length} permohonan · belum transfer`,
          },
          {
            label: "Ditahan untuk pemeriksaan",
            value: rupiah(held),
            detail: `${heldRows.length} permohonan · sengketa, rekening, dan penyelesaian`,
          },
        ]}
      />
      <div className={styles.columns}>
        <FinanceCard flat title="Antrean payout vendor">
          <FinanceTable
            label="Antrean payout"
            headers={["Permohonan", "Vendor", "Nominal", "Kelayakan"]}
            rows={props.state.payouts.map((row) => [
              <Button key={row.id} variant="ghost" size="small" onClick={() => setSelected(row.id)}>
                {row.id}
              </Button>,
              row.vendor,
              rupiah(row.amount),
              <span key="status" className={styles.badge}>
                {payoutStatus(row)}
              </span>,
            ])}
          />
          <div className="mt-5">
            <FinanceNote>
              Snapshot dapat berubah sebelum eksekusi. Rekening baru yang belum lolos dan dana
              sengketa tidak dapat dilewati manual. Antrean Brand Ambassador terpisah.
            </FinanceNote>
          </div>
        </FinanceCard>
        <PayoutReview
          key={selected}
          {...props}
          row={props.state.payouts.find((row) => row.id === selected)!}
        />
      </div>
    </>
  );
}
