"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import type { DigitalOrderItem, PaymentStatus } from "../types/fulfillment";
import styles from "./fulfillment.module.css";

type Props = {
  initialOrder: DigitalOrderItem;
};

export function FulfillmentScreen({ initialOrder }: Props) {
  const [order] = useState<DigitalOrderItem>(initialOrder);
  const [simStatus, setSimStatus] = useState<PaymentStatus>(order.paymentStatus);
  const [recoverySent, setRecoverySent] = useState(false);

  const formatIdr = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <main id="main-content" className={styles.container}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ux-border pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrandLogo variant="cypress" width={32} height={15} />
            <span className="font-semibold text-primary text-sm">menuju akad</span>
            <span className="text-secondary text-xs">·</span>
            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">
              SANDBOX · TIDAK ADA TRANSAKSI
            </span>
          </div>
          <h1 className="font-sans text-3xl font-semibold text-primary tracking-[-0.9px]">
            Produk digital · setelah pembayaran
          </h1>
        </div>
        <span className="rounded-full bg-ux-dock border border-ux-border px-3 py-1 font-mono text-xs font-semibold text-secondary">
          {order.orderId} · {formatIdr(order.amount)}
        </span>
      </header>

      <div
        className="flex gap-1.5 rounded-control bg-ux-dock border border-ux-border p-1 w-fit"
        role="tablist"
      >
        {(["pending", "verified", "delivery_failed"] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={simStatus === s}
            className={`rounded-control px-3 py-1.5 text-xs font-medium transition ${
              simStatus === s
                ? "bg-surface text-primary shadow-sm font-semibold"
                : "text-secondary hover:text-foreground"
            }`}
            onClick={() => {
              setSimStatus(s);
              setRecoverySent(false);
            }}
          >
            {s === "pending"
              ? "1. Menunggu"
              : s === "verified"
                ? "2. Terverifikasi"
                : "3. Gagal Kirim"}
          </button>
        ))}
      </div>

      <article className={styles.orderCard}>
        {simStatus === "pending" && (
          <div className={styles.statusBannerPending} role="status">
            <span className="text-[11px] font-bold tracking-wider uppercase">MENUNGGU</span>
            <h2 className="text-base font-semibold">Pembayaran belum pasti</h2>
            <p className="text-xs leading-relaxed">
              Redirect bukan konfirmasi. Periksa provider dan intent yang sama; file belum boleh
              dibuka.
            </p>
          </div>
        )}

        {simStatus === "verified" && (
          <div className={styles.statusBannerVerified} role="status">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              AKSES MILIK PEMBELI
            </span>
            <h2 className="text-base font-semibold">Pembayaran terverifikasi</h2>
            <p className="text-xs leading-relaxed">
              {order.productName}. Entitlement dibuat idempoten dari transaksi yang valid.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={order.accessUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-control bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                <Icon name="download" size={15} />
                Buka & Simpan Template
              </a>
              <span className="text-xs font-mono self-center text-emerald-800">
                Receipt {order.receiptNumber} · {formatIdr(order.amount)}
              </span>
            </div>
          </div>
        )}

        {simStatus === "delivery_failed" && (
          <div className={styles.statusBannerFailed} role="status">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              AKSES TETAP DIMILIKI
            </span>
            <h2 className="text-base font-semibold">Pengiriman gagal</h2>
            <p className="text-xs leading-relaxed">
              WhatsApp gagal bukan pembayaran gagal. Tawarkan tautan privat melalui email transaksi;
              periksa consent/dedup sebelum kirim ulang.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                size="small"
                onClick={() => setRecoverySent(true)}
                disabled={recoverySent}
              >
                {recoverySent
                  ? "Tautan Pemulihan Dikirim ke Email"
                  : "Kirim Tautan ke Email Transaksi"}
              </Button>
            </div>
          </div>
        )}

        <div className={styles.infoGrid}>
          <div className="space-y-1 rounded-control bg-ux-dock border border-ux-border p-3 text-xs">
            <strong className="text-foreground block">Tautan kedaluwarsa ≠ hak beli hilang.</strong>
            <p className="text-secondary leading-relaxed">
              Jika data cocok, tautan dikirim melalui kanal transaksi. Jangan ungkap apakah
              order/orang tertentu ada. Tidak perlu membeli ulang.
            </p>
          </div>

          <div className="space-y-1 rounded-control bg-ux-dock border border-ux-border p-3 text-xs">
            <strong className="text-foreground block">Receipt & unduh ulang</strong>
            <p className="text-secondary leading-relaxed">
              Receipt {order.orderId} {formatIdr(order.amount)}, biaya Rp 0. Akses kembali perlu
              token valid; URL buram terbatas waktu tanpa kontak di query.
            </p>
          </div>
        </div>

        <div className="rounded-control border border-ux-border p-3 text-xs text-secondary flex items-start gap-2">
          <Icon name="info" size={16} className="text-primary mt-0.5 shrink-0" />
          <span>
            <strong>Wedding Kit tetap Maintenance:</strong> Ownership Premium/produk tidak dicabut.
            Jika delivery sedang Maintenance, tampilkan status/fallback dukungan, bukan memaksa beli
            lagi.
          </span>
        </div>
      </article>
    </main>
  );
}
