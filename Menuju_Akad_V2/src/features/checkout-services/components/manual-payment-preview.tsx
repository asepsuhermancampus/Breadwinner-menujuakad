import { Button } from "@/components/ui/button";

export function ManualPaymentPreview({ onClose }: { onClose?: () => void }) {
  return (
    <div className="p-5 bg-warning-bg/30 border border-warning rounded-2xl space-y-4">
      <div className="flex justify-between items-start gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-warning bg-warning-bg px-2 py-0.5 rounded">
            Preview Internal · Release #43 Baseline Nonaktif
          </span>
          <h3 className="font-bold text-base text-foreground mt-1">
            Pembayaran Transfer Manual / Bukti Unggah
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Bukan instruksi transfer nyata atau QRIS pembayaran aktif.
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="small" onClick={onClose}>
            ✕
          </Button>
        )}
      </div>

      <div className="p-3 bg-surface rounded-xl border border-border text-xs space-y-2">
        <div className="font-semibold text-foreground">Rekening Penampung Escrow (Simulasi)</div>
        <div className="font-mono text-secondary">
          Bank Central Asia · No. Rekening: ••••••••9087
        </div>
        <p className="text-[11px] text-muted leading-relaxed">
          Pada mode produksi, fitur transfer manual memerlukan otorisasi peran Admin Finance,
          rekonsiliasi mutasi bank resmi secara periodik, dan kode unik pembayaran.
        </p>
      </div>

      <div className="p-3 bg-canvas rounded-xl border border-border text-xs space-y-2">
        <div className="font-bold text-foreground">Kebijakan Verifikasi Pembayaran Manual:</div>
        <ul className="text-secondary list-disc pl-4 space-y-1">
          <li>
            <strong>Unggah bukti transfer bukan status Lunas:</strong> Status pembayaran tetap
            Menunggu Verifikasi hingga dicocokkan dengan mutasi rekening koran.
          </li>
          <li>
            <strong>Verifikasi idempoten:</strong> Persetujuan admin dicatat dengan ID petugas,
            stempel waktu, dan nomor referensi mutasi. Penolakan tidak otomatis membuat tagihan
            kedua.
          </li>
        </ul>
      </div>
    </div>
  );
}
