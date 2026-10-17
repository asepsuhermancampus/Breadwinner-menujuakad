"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { planOptions, type PlanOption } from "../config/plan-options";
import type { PlanAdapter, PlanEntitlement, PlanInvoice } from "../types/plans";
import { daysUntilPlanExpiry, entitlementLabel } from "../utils/entitlement";
import { PlanCard } from "./plan-card";
import { PlanReview } from "./plan-review";
import styles from "./plans.module.css";

export function PlansScreen({
  entitlement,
  adapter,
  asOf,
  invoices = [],
}: {
  entitlement: PlanEntitlement;
  adapter: PlanAdapter;
  asOf: string;
  invoices?: PlanInvoice[] | undefined;
}) {
  const [selected, setSelected] = useState<PlanOption | null>(null);
  const days = daysUntilPlanExpiry(entitlement.expiresAt, asOf);
  const expiry = entitlement.expiresAt
    ? new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(
        new Date(entitlement.expiresAt),
      )
    : "tanpa kedaluwarsa";

  return (
    <div>
      <div className={styles.notice}>
        <div>
          <p className="text-sm font-medium">
            {entitlementLabel(entitlement)} aktif{" "}
            {entitlement.expiresAt ? `hingga ${expiry}` : expiry}
          </p>
          <p className={`${styles.copy} mt-1`}>
            {days !== null ? `${days} hari lagi · ` : ""}Rencana dan kenangan tetap milik kalian.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => setSelected(planOptions.find((option) => option.id === "premium") ?? null)}
        >
          Kelola perpanjangan ↗
        </Button>
      </div>
      <div className={`${styles.grid} mt-5`}>
        {planOptions.map((option) => (
          <PlanCard
            key={option.id}
            option={option}
            actualPlan={entitlement.plan}
            onSelect={() => setSelected(option)}
          />
        ))}
      </div>
      <p className={styles.finePrint}>
        Pembayaran aman · Tanpa perpanjangan otomatis · Data tetap tersimpan.
        <br />
        Ketersediaan fitur mengikuti rilis layanan; upgrade tidak membuka fitur yang sedang tidak
        tersedia.
      </p>
      <section className={styles.history}>
        <h2 className="text-sm font-medium">Riwayat paket & pembayaran</h2>
        {!invoices.length && (
          <p className={`${styles.copy} mt-4`}>Belum ada riwayat pembayaran pada pratinjau ini.</p>
        )}
        {invoices.map((invoice) => (
          <div key={invoice.id} className={styles.invoice}>
            <span>{invoice.label}</span>
            <time dateTime={invoice.date}>
              {new Intl.DateTimeFormat("id-ID", {
                dateStyle: "medium",
                timeZone: "Asia/Jakarta",
              }).format(new Date(invoice.date))}
            </time>
            <span className="font-mono">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(invoice.amountIdr)}
            </span>
            <span>
              {{ paid: "Lunas", pending: "Menunggu", expired: "Kedaluwarsa" }[invoice.status]}
            </span>
          </div>
        ))}
      </section>
      {selected && (
        <PlanReview
          option={selected}
          entitlement={entitlement}
          adapter={adapter}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
