"use client";
import { Button } from "@/components/ui/button";
import { businessMetrics, cohort } from "../content/admin-content";

export function AdminExecutive({ onNavigate }: { onNavigate: (view: string) => void }) {
  function exportSummary() {
    const csv =
      "metric,value,scope\r\ncouples,2840,cumulative\r\nvendors,72,cumulative\r\npublished,1120,cumulative\r\ngmv_idr,240000000,cumulative\r\ncaptured_idr,180000000,cumulative\r\naccrued_fee_idr,9000000,cumulative\r\ncohort_registered,1000,2026-10-01_2026-10-25\r\ncohort_first_publish,320,2026-10-01_2026-10-25";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ringkasan-bisnis-agregat.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Gambaran bisnis, keputusan berikutnya.
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Snapshot sandbox 25 Oktober 2026 · metrik kumulatif dan funnel kohort dibedakan.
          </p>
        </div>
        <Button className="bg-primary" onClick={exportSummary}>
          Ekspor ringkasan
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 border-b border-ux-border py-6 sm:grid-cols-2 xl:grid-cols-4">
        {businessMetrics.map((metric) => (
          <div key={metric.label} className="grid gap-2">
            <p className="text-xs text-secondary">{metric.label}</p>
            <p className="font-mono text-[26px] tracking-tight">{metric.value}</p>
            <p className="text-xs text-secondary">{metric.detail}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="grid content-start gap-7">
          <div>
            <h2 className="text-[22px] font-semibold tracking-tight">Dari daftar sampai terbit</h2>
            <p className="mt-3 text-sm text-secondary">
              Kohort registrasi 1–25 Okt · 1.000 akun · 32% sampai publikasi
            </p>
          </div>
          <div className="grid gap-7">
            {cohort.map((row) => (
              <div
                key={row.label}
                className="grid items-center gap-3 sm:grid-cols-[150px_minmax(0,1fr)_55px]"
              >
                <label className="text-sm" htmlFor={`cohort-${row.value}`}>
                  {row.label}
                </label>
                <progress
                  id={`cohort-${row.value}`}
                  value={row.value}
                  max={1000}
                  className="h-7 w-full overflow-hidden rounded-control [&::-webkit-progress-bar]:bg-subtle [&::-webkit-progress-value]:bg-primary [&::-moz-progress-bar]:bg-primary"
                />
                <span className="text-right font-mono text-sm">
                  {new Intl.NumberFormat("id-ID").format(row.value)}
                </span>
              </div>
            ))}
          </div>
        </section>
        <aside className="grid content-start gap-5 rounded-card bg-ux-dock p-6">
          <h2 className="text-lg font-semibold">Perlu tindakan</h2>
          {[
            ["9 pengajuan KYB", "kyb"],
            ["6 caption perlu tinjauan", "moderation"],
            ["1 selisih status provider", "reconciliation"],
            ["4 permohonan payout", "payouts"],
          ].map(([label, view]) => (
            <Button
              key={view}
              variant="secondary"
              className="justify-start text-xs"
              onClick={() => onNavigate(view!)}
            >
              {label}
            </Button>
          ))}
          <div className="border-t border-ux-border pt-5">
            <p className="text-xs text-secondary">Fee terakru · contoh 5%</p>
            <p className="mt-3 font-mono text-[24px]">Rp 9.000.000</p>
            <p className="mt-3 text-xs leading-relaxed text-secondary">
              Dari Rp 180.000.000 pembayaran tercatat. GMV Rp 240 jt bukan saldo kas; biaya belum
              identik dengan pendapatan bersih.
            </p>
          </div>
        </aside>
      </div>
      <div className="grid gap-2 border-t border-ux-border pt-5">
        <p className="text-sm font-semibold">Kohort tidak dicampur dengan total historis</p>
        <p className="text-sm leading-relaxed text-secondary">
          320 publikasi adalah hasil kohort yang dipilih, bukan seluruh 1.120 undangan aktif. Data
          agregat tanpa daftar tamu, nomor telepon, atau rekening.
        </p>
      </div>
    </>
  );
}
