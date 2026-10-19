"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { rupiah } from "../content/finance-content";
import { refundImpact } from "../domain/finance-money";
import type { FinanceScreenProps } from "../types/admin-finance";
import {
  FinanceCard,
  FinanceHeader,
  FinanceMetrics,
  FinanceNote,
  FinanceTable,
} from "./finance-parts";
import { RefundReview } from "./refund-review";
import styles from "./finance.module.css";

export function FinanceDispute(props: FinanceScreenProps & { review?: boolean }) {
  const [review, setReview] = useState(Boolean(props.review));
  const [evidence, setEvidence] = useState(false);
  const impact = refundImpact(5_000_000);
  return (
    <>
      <FinanceHeader
        title="Resolusi dengan bukti dan batas yang jelas."
        detail="DS-019 · ORD-8204 · Arunika Decor / Arga & Nadya · contoh terpisah dari pesanan Rama & Sinta."
        action={<Button onClick={() => setReview(true)}>Tinjau usulan refund</Button>}
      />
      <FinanceMetrics
        items={[
          {
            label: "Pembayaran asli",
            value: rupiah(props.state.payment.captured),
            detail: "PAY8300 · metode asal KlikQRIS",
          },
          {
            label: "Usulan refund",
            value: rupiah(5_000_000),
            detail:
              props.state.payment.status === "captured"
                ? "Belum diajukan ke provider"
                : props.state.payment.status === "refund-unknown"
                  ? "Hasil belum diketahui · periksa request sama"
                  : "Diajukan · menunggu provider",
          },
          {
            label: "Setelah refund berhasil",
            value: rupiah(impact.remaining),
            detail: "Pratinjau · belum menjadi jurnal aktual",
          },
        ]}
      />
      <div className={styles.columns}>
        <FinanceCard title="Kronologi & bukti privat">
          <FinanceTable
            label="Kronologi sengketa DS-019"
            headers={["Waktu", "Catatan pemeriksaan"]}
            rows={[
              ["21 Oktober", "Keluhan dan bukti pembatalan diterima."],
              ["23 Oktober", "Admin meninjau kontrak dan bukti layanan."],
              ["24 Oktober", "Tanggapan vendor dan dokumen pendukung."],
              ["25 Oktober", "Usulan refund Rp5.000.000 siap ditinjau; belum dieksekusi."],
            ]}
          />
          <div className="mt-5">
            <Button variant="secondary" onClick={() => setEvidence(true)}>
              Tinjau kontrak & bukti privat
            </Button>
          </div>
        </FinanceCard>
        <FinanceCard title="Dampak usulan penyelesaian">
          <FinanceTable
            label="Pembagian usulan refund"
            headers={["Komponen", "Nilai"]}
            rows={[
              ["Refund pelanggan", rupiah(5_000_000)],
              ["Pembalikan fee platform", rupiah(impact.feeReversal)],
              ["Pengurangan hak vendor", rupiah(impact.vendorReduction)],
              ["Status dana sengketa", "Ditahan dari kelayakan payout"],
            ]}
          />
          <div className="mt-5">
            <FinanceNote>
              Refund hanya ke metode pembayaran asal. Permintaan diterima tidak berarti dana sudah
              kembali. Histori dan snapshot order tetap disimpan.
            </FinanceNote>
          </div>
        </FinanceCard>
      </div>
      {review && <RefundReview {...props} onClose={() => setReview(false)} />}
      <Dialog open={evidence} title="DS-019 · dokumen privat" onClose={() => setEvidence(false)}>
        <div className={styles.stack}>
          <FinanceNote>
            Pratinjau metadata mock. Tidak ada dokumen identitas atau rekening yang diunduh atau
            dibuka ke publik.
          </FinanceNote>
          <FinanceTable
            label="Metadata bukti privat"
            headers={["Dokumen", "Akses"]}
            rows={[
              ["Kontrak ORD-8204 · v2", "Privat · petugas berizin"],
              ["Bukti pembatalan · 21 Oktober", "Privat · petugas berizin"],
              ["Tanggapan Arunika · 24 Oktober", "Privat · petugas berizin"],
            ]}
          />
          <Button variant="secondary" onClick={() => setEvidence(false)}>
            Selesai meninjau
          </Button>
        </div>
      </Dialog>
    </>
  );
}
