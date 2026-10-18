export function QuoteExpiredView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-canvas rounded-2xl border border-border">
      {/* Vignette 1: Price Change */}
      <div className="p-4 bg-surface rounded-xl border border-warning/40 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-warning uppercase tracking-wide">
            1. Perubahan Harga Vendor
          </span>
          <span className="px-2 py-0.5 rounded bg-warning-bg text-warning font-mono text-[11px]">
            Q-PRICE/v8
          </span>
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          Harga salah satu item mengalami penyesuaian oleh vendor sebelum masa hold dibuat. Tinjau
          perubahan sebelum melanjutkan:
        </p>

        <div className="overflow-x-auto border border-border rounded-lg text-xs">
          <table className="w-full text-left">
            <thead className="bg-subtle text-secondary font-semibold">
              <tr>
                <th className="p-2">Snapshot</th>
                <th className="p-2">Dekorasi</th>
                <th className="p-2">Total Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="p-2 font-mono text-secondary">Q-PRICE/v7</td>
                <td className="p-2 font-mono">Rp 12.000.000</td>
                <td className="p-2 font-mono font-bold text-foreground">Rp 35.000.000</td>
              </tr>
              <tr className="border-t border-border bg-warning-bg/30">
                <td className="p-2 font-mono text-warning font-bold">Usulan v8</td>
                <td className="p-2 font-mono text-warning">Rp 13.000.000</td>
                <td className="p-2 font-mono font-bold text-warning">Rp 36.000.000</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-secondary bg-subtle p-2.5 rounded border border-border">
          DP 30% baru: <strong>Rp 10.800.000</strong> (naik Rp 300.000). Sistem tidak pernah
          menyetujui kenaikan harga secara sepihak atau otomatis.
        </div>
      </div>

      {/* Vignette 2: Hold Expired */}
      <div className="p-4 bg-surface rounded-xl border border-danger/40 space-y-3 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-danger uppercase tracking-wide">
              2. Hold Slot Berakhir
            </span>
            <span className="px-2 py-0.5 rounded bg-danger-bg text-danger font-mono font-bold">
              00:00 (EXPIRED)
            </span>
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Slot pemesanan sementara tidak lagi dijamin karena batas waktu server telah habis.
          </p>

          <div className="p-3 bg-danger-bg/20 rounded-lg border border-danger/20 text-xs space-y-1">
            <div className="font-semibold text-danger">Kapasitas Tanggal Dilepas ke Publik</div>
            <p className="text-secondary text-[11px]">
              Data pengisian Anda tetap aman tersimpan. Periksa ketersediaan slot terbaru sebelum
              membuat quote checkout baru.
            </p>
          </div>
        </div>

        <div className="text-[11px] text-muted leading-relaxed pt-2 border-t border-border">
          <strong>Integritas State:</strong> Server adalah otoritas penentu Time-to-Live (TTL).
          Aplikasi klien dilarang memperpanjang timer secara artifisial atau menagih pembayaran saat
          status hold kedaluwarsa.
        </div>
      </div>
    </div>
  );
}
