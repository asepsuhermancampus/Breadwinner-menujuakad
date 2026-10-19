"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { formatIdr } from "@/features/marketplace/utils/marketplace-calc";
import { ambassadorBalances } from "../domain/ambassador-commissions";
import {
  reconcileAmbassadorWithdrawal,
  requestAmbassadorWithdrawal,
} from "../domain/ambassador-withdrawals";
import type {
  AmbassadorContext,
  AmbassadorResult,
  AmbassadorState,
  WithdrawalInput,
} from "../types/ambassador";

export function AmbassadorWithdrawal({
  state,
  context,
  onResult,
  onClose,
}: {
  state: AmbassadorState;
  context: AmbassadorContext;
  onResult: (result: AmbassadorResult) => void;
  onClose: () => void;
}) {
  const [intent] = useState(() => ({
    operationId:
      state.withdrawals.find((row) => row.status === "unknown")?.operationId ?? crypto.randomUUID(),
    bankLast4: state.bank.last4,
    expectedVersion: state.version,
  }));
  const [amount, setAmount] = useState("1000000");
  const [ack, setAck] = useState(false);
  const [outcome, setOutcome] = useState<WithdrawalInput["outcome"]>("success");
  const [result, setResult] = useState<AmbassadorResult | null>(null);
  const request = state.withdrawals.find((row) => row.operationId === intent.operationId);
  const unknown = request?.status === "unknown";
  const value = request?.amountIdr ?? Number(amount);
  const available = ambassadorBalances(state).availableIdr - (request ? 0 : value);
  function submit() {
    const next = unknown
      ? reconcileAmbassadorWithdrawal(state, intent.operationId, context)
      : requestAmbassadorWithdrawal(
          state,
          { ...intent, amountIdr: value, acknowledged: ack, outcome },
          context,
        );
    setResult(next);
    onResult(next);
  }
  function close() {
    if (
      request ||
      amount === "1000000" ||
      window.confirm("Nominal belum diajukan. Buang perubahan penarikan?")
    )
      onClose();
  }
  return (
    <Dialog open title="Tinjau penarikan komisi" onClose={close}>
      <div className="grid gap-5">
        <p className="text-xs leading-relaxed text-secondary">
          Hanya saldo tervalidasi yang dapat ditahan untuk permohonan ini.
        </p>
        <Field
          label="Nominal diminta (Rp)"
          inputMode="numeric"
          value={request ? String(request.amountIdr) : amount}
          disabled={Boolean(request)}
          onChange={(e) => {
            setAmount(e.target.value);
            setAck(false);
          }}
          error={result?.errors?.amount}
        />
        <dl className="grid gap-3 rounded-card border border-border p-4 text-xs">
          {[
            ["Tujuan terverifikasi", `${state.bank.name} •••• ${intent.bankLast4}`],
            ["Biaya contoh", "Rp 0"],
            ["Diterima jika berhasil", formatIdr(value || 0)],
            ["Tersedia setelah ditahan", formatIdr(available || 0)],
          ].map(([label, text]) => (
            <div key={label} className="flex flex-wrap justify-between gap-2">
              <dt className="text-secondary">{label}</dt>
              <dd className="font-mono font-semibold">{text}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-control bg-subtle p-4">
          <h3 className="text-sm font-semibold">Permohonan, bukan bukti transfer</h3>
          <p className="mt-2 text-xs leading-relaxed text-secondary">
            Validasi rekening, saldo, biaya dan status sengketa saat konfirmasi. Jika koneksi putus,
            cek permohonan yang sama sebelum mencoba ulang.
          </p>
        </div>
        {!request && (
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
        {!request && (
          <label className="flex items-start gap-3 text-xs leading-relaxed">
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            Saya telah memeriksa saldo tervalidasi, nominal dan rekening tujuan, serta memahami
            status permohonan ini.
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
          <p role="status" className="text-xs text-warning">
            Hasil belum pasti. Permohonan tetap tercatat; periksa status yang sama sebelum
            mengajukan lagi.
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={close}>
            {request ? "Tutup" : "Batal"}
          </Button>
          {(!request || unknown) && (
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
