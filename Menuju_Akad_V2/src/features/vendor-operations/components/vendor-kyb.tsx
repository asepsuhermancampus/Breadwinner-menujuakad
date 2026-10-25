"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { submitVendorKyb } from "../domain/vendor-operations";
import type {
  BankRevisionDraft,
  UploadMetadata,
  VendorContext,
  VendorResult,
  VendorWorkspace,
} from "../types/vendor";
import { VendorKybFields } from "./vendor-kyb-fields";
import { VendorKybSteps } from "./vendor-kyb-steps";
import {
  VendorKybActiveBank,
  VendorKybNotice,
  VendorKybPendingDetails,
  VendorKybSummary,
} from "./vendor-kyb-summary";
import { VendorKybUpload } from "./vendor-kyb-upload";

export function VendorKyb({
  state,
  context,
  onResult,
  onDirtyChange,
  refreshRevision = 0,
}: {
  state: VendorWorkspace;
  context: VendorContext;
  onResult: (result: VendorResult) => void;
  onDirtyChange?: (dirty: boolean) => void;
  refreshRevision?: number;
}) {
  const [draft, setDraft] = useState<BankRevisionDraft>(() => ({
    bankName: state.kyb.proposedBank.bankName,
    accountName: state.kyb.proposedBank.accountName,
    accountNumber: "",
    confirmAccountName: "",
    confirmAccountNumber: "",
    document: null,
    acknowledged: false,
    operationId: crypto.randomUUID(),
  }));
  const [expectedVersion, setExpectedVersion] = useState(state.version);
  const [prevRefreshRevision, setPrevRefreshRevision] = useState(refreshRevision);
  if (refreshRevision !== prevRefreshRevision) {
    setPrevRefreshRevision(refreshRevision);
    setExpectedVersion(state.version);
  }
  const [uploadBusy, setUploadBusy] = useState(false);
  const [result, setResult] = useState<VendorResult | null>(null);
  const pending = state.kyb.status === "pending";
  const blocked =
    pending || !context.permissions.kybSubmit || !context.sessionValid || context.role !== "vendor";
  const dirty =
    !pending &&
    Boolean(
      draft.document ||
      draft.acknowledged ||
      draft.accountNumber ||
      draft.confirmAccountName ||
      draft.confirmAccountNumber ||
      draft.bankName !== state.kyb.proposedBank.bankName ||
      draft.accountName !== state.kyb.proposedBank.accountName,
    );
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);
  function change(key: keyof BankRevisionDraft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setResult(null);
  }
  function proof(document: UploadMetadata | null) {
    setDraft((current) => ({ ...current, document, acknowledged: false }));
    setResult(null);
  }
  function submit() {
    const outcome = submitVendorKyb(
      state,
      draft,
      { ...context, uploadState: uploadBusy ? "pending" : context.uploadState },
      expectedVersion,
    );
    setResult(outcome);
    onResult(outcome);
    if (outcome.ok) {
      setExpectedVersion(outcome.state.version);
      setDraft((current) => ({
        ...current,
        accountNumber: "",
        confirmAccountName: "",
        confirmAccountNumber: "",
        document: null,
        acknowledged: false,
      }));
    }
  }
  const ready =
    draft.document &&
    draft.acknowledged &&
    draft.accountNumber &&
    draft.confirmAccountName &&
    draft.confirmAccountNumber;
  return (
    <div className="grid gap-7">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
            Data usaha tetap terlindungi.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary">
            Pembaruan rekening · langkah 3 dari 4 · akun usaha sebelumnya tetap terverifikasi.
          </p>
        </div>
        <Button disabled={blocked || uploadBusy || !ready} onClick={submit}>
          Kirim revisi untuk ditinjau
          <Icon name="arrow-right" size={16} />
        </Button>
      </header>
      <VendorKybSteps pending={pending} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0">
          <VendorKybNotice pending={pending} />
          {pending ? (
            <VendorKybPendingDetails state={state} />
          ) : (
            <div className="mt-6 grid gap-6">
              <div>
                <h2 className="font-semibold">Perbarui rekening usaha</h2>
                <p className="mt-2 text-xs leading-relaxed text-secondary">
                  Usulan terakhir: {state.kyb.proposedBank.bankName} ••
                  {state.kyb.proposedBank.last4}, atas nama {state.kyb.proposedBank.accountName}.
                  Masukkan ulang detail untuk memastikan ketepatan.
                </p>
              </div>
              <VendorKybFields
                draft={draft}
                disabled={blocked}
                errors={result?.errors ?? {}}
                onChange={change}
              />
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Bukti rekening pengganti <span className="text-secondary">· privat</span>
                </h3>
                <VendorKybUpload disabled={blocked} onReady={proof} onBusyChange={setUploadBusy} />
                {result?.errors?.document && (
                  <p role="alert" className="mt-2 text-xs text-danger">
                    {result.errors.document}
                  </p>
                )}
              </div>
              <label className="flex items-start gap-3 rounded-control border border-border p-4 text-xs leading-relaxed">
                <input
                  type="checkbox"
                  className="mt-0.5 shrink-0"
                  checked={draft.acknowledged}
                  disabled={blocked || !draft.document || uploadBusy}
                  onChange={(e) =>
                    setDraft((current) => ({ ...current, acknowledged: e.target.checked }))
                  }
                />
                Saya memastikan rekening milik usaha ini, nama pemilik sesuai, dan bukti menampilkan
                detail rekening secara utuh.
              </label>
              <p className="text-xs text-secondary">
                Ganti bukti dan konfirmasikan kepemilikan untuk mengaktifkan pengiriman.
              </p>
            </div>
          )}
          {result && (
            <p
              role={result.ok ? "status" : "alert"}
              className={`mt-5 text-sm ${result.ok ? "text-success" : "text-danger"}`}
            >
              {result.message}
            </p>
          )}
          {!context.permissions.kybSubmit && (
            <p role="status" className="mt-4 text-xs text-secondary">
              Akses pengajuan rekening dinonaktifkan. Data tidak berubah.
            </p>
          )}
        </section>
        <VendorKybSummary state={state} />
      </div>
      <VendorKybActiveBank state={state} />
    </div>
  );
}
