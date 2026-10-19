"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { rupiah } from "../content/finance-content";
import type { FinanceScreenProps } from "../types/admin-finance";
import {
  FinanceCard,
  FinanceHeader,
  FinanceMetrics,
  FinanceNote,
  FinanceTable,
} from "./finance-parts";
import { WebhookReview } from "./webhook-review";
import styles from "./finance.module.css";

export function FinanceReconciliation(props: FinanceScreenProps & { inspect?: boolean }) {
  const [selected, setSelected] = useState<string | null>(props.inspect ? "TX-8423" : null);
  const provider = props.state.reconciliations
    .filter((row) => row.provider === "settled")
    .reduce((total, row) => total + row.amount, 0);
  const internal = props.state.reconciliations
    .filter((row) => row.internal === "paid")
    .reduce((total, row) => total + row.amount, 0);
  const difference = provider - internal;
  const matched = props.state.reconciliations.filter(
    (row) => row.internal === "paid" || row.internal === "expired",
  ).length;
  const internalLabel = { paid: "Lunas", waiting: "Menunggu", expired: "Kedaluwarsa" };
  return (
    <>
      <FinanceHeader
        title="Temukan selisih tanpa membayar dua kali."
        detail="Rekonsiliasi KlikQRIS · snapshot 25 Oktober 2026 · seluruh data adalah simulasi lokal."
        action={<Button onClick={() => setSelected("TX-8423")}>Periksa TX-8423</Button>}
      />
      <FinanceMetrics
        items={[
          {
            label: "Status cocok",
            value: `${matched} / 4`,
            detail: "Termasuk satu invoice kedaluwarsa",
          },
          {
            label: "Perlu ditinjau",
            value: `${4 - matched} transaksi`,
            detail: difference ? "TX-8423 · perbedaan status" : "Status telah disinkronkan di mock",
          },
          { label: "Duplikat ditahan", value: "1 event", detail: "Tidak membuat jurnal kedua" },
          {
            label: "Nominal selisih status",
            value: rupiah(difference),
            detail: "Bukan uang hilang / refund otomatis",
          },
        ]}
      />
      <FinanceCard flat title="Pembayaran & hasil pemeriksaan">
        <FinanceTable
          label="Rekonsiliasi KlikQRIS"
          headers={["Transaksi", "Provider", "Nominal invoice", "Internal", "Provider", "Hasil"]}
          rows={props.state.reconciliations.map((row) => [
            <Button key={row.id} variant="ghost" size="small" onClick={() => setSelected(row.id)}>
              {row.id}
            </Button>,
            "KlikQRIS",
            <span key="amount" className={styles.mono}>
              {rupiah(row.amount)}
            </span>,
            internalLabel[row.internal],
            row.provider === "settled" ? "Settled" : "Expired",
            <span
              key="status"
              className={`${styles.badge} ${row.internal === "waiting" ? styles.warning : styles.success}`}
            >
              {row.internal === "waiting"
                ? "Selisih status"
                : row.id === "TX-8422"
                  ? "Cocok · duplikat no-op"
                  : row.internal === "expired"
                    ? "Cocok · tidak dibayar"
                    : "Cocok"}
            </span>,
          ])}
        />
      </FinanceCard>
      <FinanceCard flat title="Bandingkan pembayaran yang benar-benar diterima">
        <p>
          Provider mengonfirmasi <strong>{rupiah(provider)}</strong>; internal mencatat{" "}
          <strong>{rupiah(internal)}</strong>. Invoice kedaluwarsa Rp1.500.000 tidak termasuk
          pembayaran diterima.
        </p>
        <div className="mt-4">
          <FinanceNote>
            Gunakan sumber resmi sebelum koreksi status. Replay aman tidak membuat invoice, charge,
            refund, notifikasi, atau jurnal pembayaran kedua.
          </FinanceNote>
        </div>
      </FinanceCard>
      {selected && (
        <WebhookReview {...props} transactionId={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
