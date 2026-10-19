"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import {
  createVendorWallet,
  reconcileVendorPayout,
  requestVendorPayout,
  vendorAvailable,
  type WalletWorkspace,
} from "../domain/vendor-wallet";
import type { VendorContext, VendorResult } from "../types/vendor";

export function VendorPayout({
  state,
  context,
  onResult,
  onClose,
}: {
  state: WalletWorkspace;
  context: VendorContext;
  onResult: (result: VendorResult) => void;
  onClose: () => void;
}) {
  const [intent] = useState(() => ({
    operationId:
      state.wallet?.requests.find((item) => item.status === "unknown")?.operationId ??
      crypto.randomUUID(),
    expectedVersion: state.version,
    bankLast4: state.kyb.verifiedBank.last4,
  }));
  const [amount, setAmount] = useState("5000000");
  const [ack, setAck] = useState(false);
  const [outcome, setOutcome] = useState<"success" | "failure" | "unknown">("success");
  const [result, setResult] = useState<VendorResult | null>(null);
  const wallet = state.wallet ?? createVendorWallet();
  const existing = wallet.requests.find((item) => item.operationId === intent.operationId);
  const unknown = existing?.status === "unknown";
  const value = existing?.amountIdr ?? Number(amount);
  const after = vendorAvailable(wallet) - (existing ? 0 : value);
  function submit() {
    const next = unknown
      ? reconcileVendorPayout(state, intent.operationId, context)
      : requestVendorPayout(
          state,
          { ...intent, amountIdr: value, acknowledged: ack, outcome },
          context,
        );
    setResult(next);
    onResult(next);
  }
  function close() {
    if (
      existing ||
      amount === "5000000" ||
      window.confirm("Nominal belum diajukan. Buang perubahan pencairan?")
    )
      onClose();
  }
  return (
    <Dialog open title="Tinjau pencairan vendor" onClose={close}>
      <div className="grid gap-5">
        <p className="text-xs text-secondary">
          Simulasi {existing?.id ?? `WD-${105 + wallet.requests.length}`} · permohonan diterima
          belum berarti transfer.
        </p>
        <Field
          label="Nominal diminta (Rp)"
          value={existing ? String(existing.amountIdr) : amount}
          inputMode="numeric"
          disabled={Boolean(existing)}
          onChange={(e) => {
            setAmount(e.target.value);
            setAck(false);
          }}
          error={result?.errors?.amount}
        />
        <dl className="grid gap-3 rounded-card border border-border p-4 text-xs">
          {[
            ["Tujuan terverifikasi", `${state.kyb.verifiedBank.bankName} •••• ${intent.bankLast4}`],
            ["Biaya contoh", "Rp 0"],
            ["Diterima jika berhasil", formatIdr(value || 0)],
            ["Tersedia setelah ditahan", formatIdr(after || 0)],
          ].map(([label, text]) => (
            <div key={label} className="flex flex-wrap justify-between gap-2">
              <dt className="text-secondary">{label}</dt>
              <dd className="font-mono font-semibold">{text}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-control bg-subtle p-4">
          <h3 className="text-sm font-semibold">Validasi ulang saat konfirmasi</h3>
          <p className="mt-2 text-xs leading-relaxed text-secondary">
            Cek saldo, KYB, rekening, sengketa, biaya dan kunci permohonan. Pengulangan permintaan
            yang sama tidak menahan saldo dua kali.
          </p>
        </div>
        {!existing && (
          <label className="grid gap-2 text-xs">
            Respons adapter sandbox
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as typeof outcome)}
              className="min-h-11 rounded-control border border-ux-border bg-surface p-3"
            >
              <option value="success">Permohonan diterima</option>
              <option value="failure">Gagal sebelum pengajuan</option>
              <option value="unknown">Respons belum pasti</option>
            </select>
          </label>
        )}
        {!existing && (
          <label className="flex items-start gap-3 text-xs leading-relaxed">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            Saya telah memeriksa nominal, rekening terverifikasi, dan memahami ini permohonan
            pencairan.
          </label>
        )}
        {result && (
          <p
            role={result.ok ? "status" : "alert"}
            className={`text-sm ${result.ok ? "text-success" : "text-danger"}`}
          >
            {result.message}
          </p>
        )}
        {unknown && (
          <p role="status" className="text-xs leading-relaxed text-warning">
            Hasil belum pasti. Permohonan tetap tercatat; periksa status yang sama sebelum
            mengajukan lagi.
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            {existing ? "Tutup" : "Batal"}
          </Button>
          {(!existing || unknown) && (
            <Button
              disabled={!unknown && (!ack || !Number.isSafeInteger(value) || value <= 0)}
              onClick={submit}
            >
              {unknown
                ? "Periksa status permohonan yang sama"
                : result
                  ? "Coba lagi permohonan yang sama"
                  : "Konfirmasi permohonan"}
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
