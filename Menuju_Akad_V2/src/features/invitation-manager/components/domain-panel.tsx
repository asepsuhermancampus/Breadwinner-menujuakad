"use client";

import { useState } from "react";
import { domainSetup } from "@/features/invitation-manager/content/manager-content";
import type { DomainSetup } from "../types/manager";

export function DomainPanel({ initialSetup = domainSetup }: { initialSetup?: DomainSetup }) {
  const setup = initialSetup;
  const [verified, setVerified] = useState(false);

  function simulateVerification() {
    setVerified(true);
  }

  return (
    <section className="grid gap-4" aria-label="Domain dan DNS">
      <div className="rounded-card border border-warning/40 bg-warning-bg p-4">
        <p className="text-[11px] font-bold tracking-widest text-warning">{setup.releaseNote}</p>
        <p className="mt-1 text-xs text-secondary">
          Tidak ditampilkan di menu pasangan dan tidak dapat diaktifkan lewat URL langsung. Data
          .example di bawah hanya ilustrasi, bukan instruksi DNS produksi.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-card border border-border bg-surface p-5">
          <p className="text-[10px] font-bold tracking-widest text-muted">01 / ATUR RECORD DNS</p>
          <h3 className="mt-1 font-serif text-lg text-foreground">
            Hubungkan alamat pilihan Anda.
          </h3>
          <p className="mt-1 text-xs text-secondary">
            Tambahkan kedua record di pengelola DNS domain. Semua nilai .example di bawah hanya
            untuk pratinjau internal.
          </p>
          <label className="mt-4 grid gap-1.5">
            <span className="text-xs font-semibold text-foreground">Domain contoh</span>
            <input
              value={setup.domain}
              readOnly
              className="min-h-11 rounded-control border border-ux-control-border bg-canvas px-3 font-mono text-sm text-foreground"
            />
          </label>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="text-secondary">
                  <th className="py-1.5 font-semibold">Tipe</th>
                  <th className="py-1.5 font-semibold">Nama</th>
                  <th className="py-1.5 font-semibold">Nilai contoh</th>
                  <th className="py-1.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {setup.records.map((r) => (
                  <tr key={r.host} className="border-t border-border">
                    <td className="py-2 font-mono font-semibold">{r.type}</td>
                    <td className="py-2 font-mono">{r.host}</td>
                    <td className="py-2 font-mono">{r.value}</td>
                    <td className={`py-2 ${r.detected ? "text-success" : "text-warning"}`}>
                      {r.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid content-start gap-2 rounded-card border border-border bg-surface p-5">
          {setup.checks.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-control border border-border bg-canvas px-3 py-2.5"
            >
              <span className="text-xs font-semibold text-foreground">{c.label}</span>
              <span className={`text-xs font-bold ${c.pass ? "text-success" : "text-warning"}`}>
                {c.state}
              </span>
            </div>
          ))}
          <div className="mt-2 rounded-control border border-border bg-canvas p-3">
            <p className="text-xs font-bold text-foreground">
              Tautan lama tetap menjadi jalur pemulihan
            </p>
            <p className="mt-1 text-xs text-secondary">
              Jangan mengganti domain aktif sebelum kepemilikan, tujuan DNS, dan HTTPS valid. Token
              tamu tidak boleh berpindah ke domain milik pihak lain.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={simulateVerification}
          className="min-h-11 rounded-control bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Simulasikan verifikasi
        </button>
        <p className="text-xs text-secondary" role="status">
          {verified
            ? "Pemeriksaan simulasi selesai: TXT masih belum terdeteksi dan HTTPS belum diterbitkan. Domain tetap Hidden pada rilis aktif — tidak tersedia untuk produksi."
            : "Simulasi hanya untuk pratinjau internal; tidak ada DNS atau issuance nyata."}
        </p>
      </div>
    </section>
  );
}
