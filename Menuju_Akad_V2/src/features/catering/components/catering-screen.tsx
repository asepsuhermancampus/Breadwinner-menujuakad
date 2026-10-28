"use client";
import { useState, useMemo } from "react";
import { Icon } from "@/components/ui/icon";
import { Field } from "@/components/ui/field";
import type { CateringCalculationInput } from "../types/catering";
import { calculateCatering, defaultCateringInput } from "../utils/calculator";
import styles from "./catering.module.css";

export function CateringScreen() {
  const [input, setInput] = useState<CateringCalculationInput>(defaultCateringInput);
  const result = useMemo(() => calculateCatering(input), [input]);

  return (
    <main id="main-content" className={styles.container}>
      <header>
        <div className="flex items-center gap-2.5">
          <h1 className="font-sans text-3xl font-semibold text-brand-secondary tracking-[-0.9px]">
            Hitung porsi, tanpa menebak
          </h1>
          <span className="rounded-full bg-champagne/15 border border-champagne/30 px-2.5 py-0.5 text-xs font-semibold text-ux-gold-ink">
            Coming Soon · Pratinjau Desain
          </span>
        </div>
        <p className="mt-1 text-sm text-secondary">
          Perkirakan jumlah tamu dan atur porsi prasmanan serta gubukan dengan jelas.
        </p>
      </header>

      <div className={styles.banner} role="status">
        <Icon name="info" size={18} className="shrink-0" />
        <div>
          <strong className="block font-semibold">Fitur Katering masih dalam pengembangan.</strong>
          <p className="text-xs">
            Kalkulator di bawah adalah simulasi internal untuk membantumu merancang proporsi
            prasmanan dan gubukan. Pemesanan katering langsung belum dibuka pada rilis publik #43.
          </p>
        </div>
      </div>

      <div className={styles.calculatorGrid}>
        <section className={styles.card} aria-labelledby="formula-input">
          <h2 id="formula-input" className="text-base font-semibold text-foreground">
            Dasar perhitungan tamu
          </h2>

          <div className="rounded-control bg-subtle p-3 text-xs text-secondary space-y-1">
            <span className="font-semibold text-foreground">Rumus yang dipakai:</span>
            <p className="font-mono text-brand-secondary font-medium">
              {input.invitations} × {input.multiplier} × 100% = {result.totalBaseGuests} + buffer{" "}
              {input.bufferPercent}% = {result.totalWithBuffer} tamu
            </p>
            <p className="text-[11px] text-muted">
              Sesuaikan faktor hadir dengan kebiasaan keluarga. Estimasi ini bukan jaminan jumlah
              tamu yang datang.
            </p>
          </div>

          <div className="space-y-3">
            <Field
              label="Jumlah undangan fisik / digital"
              type="number"
              value={input.invitations}
              onChange={(e) =>
                setInput((p) => ({ ...p, invitations: Number(e.target.value) || 0 }))
              }
            />

            <Field
              label="Faktor pendamping per undangan"
              type="number"
              value={input.multiplier}
              onChange={(e) => setInput((p) => ({ ...p, multiplier: Number(e.target.value) || 1 }))}
            />

            <Field
              label="Cadangan buffer kehadiran (%)"
              type="number"
              value={input.bufferPercent}
              onChange={(e) =>
                setInput((p) => ({ ...p, bufferPercent: Number(e.target.value) || 0 }))
              }
            />

            <Field
              label="Persentase alokasi prasmanan utama (%)"
              type="number"
              value={input.buffetPercent}
              onChange={(e) =>
                setInput((p) => ({ ...p, buffetPercent: Number(e.target.value) || 0 }))
              }
            />

            <Field
              label="Jumlah variasi menu gubukan (stall)"
              type="number"
              value={input.stallDishesCount}
              onChange={(e) =>
                setInput((p) => ({ ...p, stallDishesCount: Number(e.target.value) || 0 }))
              }
            />
          </div>
        </section>

        <section className={styles.card} aria-labelledby="formula-result">
          <h2 id="formula-result" className="text-base font-semibold text-foreground">
            Hasil pembagian porsi sajian
          </h2>

          <div className={styles.resultBox}>
            <div className={styles.highlightRow}>
              <div>
                <span className="text-xs text-secondary">Estimasi tamu (termasuk buffer)</span>
                <p className="font-mono text-2xl font-semibold text-foreground">
                  {result.totalWithBuffer.toLocaleString("id-ID")} orang
                </p>
              </div>
              <span className="rounded bg-surface px-2 py-1 text-xs font-mono text-secondary">
                +{result.bufferPax.toLocaleString("id-ID")} pax buffer
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="rounded-control bg-surface p-3 border border-border">
                <span className="text-xs text-secondary">
                  Prasmanan utama ({input.buffetPercent}%)
                </span>
                <p className="font-mono text-xl font-semibold text-brand-secondary">
                  {result.buffetPax.toLocaleString("id-ID")}
                </p>
                <span className="text-[11px] text-muted">
                  {input.buffetPercent}% × {result.totalWithBuffer.toLocaleString("id-ID")} tamu
                </span>
              </div>
              <div className="rounded-control bg-surface p-3 border border-border">
                <span className="text-xs text-secondary">
                  Total gubukan ({100 - input.buffetPercent}%)
                </span>
                <p className="font-mono text-xl font-semibold text-foreground">
                  {result.stallPortionsTotal.toLocaleString("id-ID")}
                </p>
                <span className="text-[11px] text-muted">
                  {result.stallPax.toLocaleString("id-ID")} tamu × {input.stallDishesCount} sajian
                </span>
              </div>
            </div>

            <div className="mt-2 rounded-none bg-primary/10 p-3.5 text-center">
              <span className="text-xs font-semibold text-brand-secondary uppercase tracking-wide">
                Total keseluruhan porsi makanan
              </span>
              <p className="font-mono text-3xl font-bold text-brand-secondary mt-1">
                {result.totalPortions.toLocaleString("id-ID")} Porsi
              </p>
              <p className="text-xs text-secondary mt-1">
                <strong className="text-foreground">Catatan penting:</strong> Orang tidak sama
                dengan porsi. 1 tamu gubukan menikmati beberapa sajian berbeda.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
