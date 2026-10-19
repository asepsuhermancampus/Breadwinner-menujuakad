"use client";

import { Field } from "@/components/ui/field";
import type { BankRevisionDraft } from "../types/vendor";

export function VendorKybFields({
  draft,
  disabled,
  errors,
  onChange,
}: {
  draft: BankRevisionDraft;
  disabled: boolean;
  errors: Record<string, string>;
  onChange: (key: keyof BankRevisionDraft, value: string) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field
        label="Nama bank"
        value={draft.bankName}
        disabled={disabled}
        error={errors.bankName}
        onChange={(e) => onChange("bankName", e.target.value)}
      />
      <Field
        label="Nama pemilik rekening"
        value={draft.accountName}
        disabled={disabled}
        error={errors.accountName}
        onChange={(e) => onChange("accountName", e.target.value)}
      />
      <Field
        label="Nomor rekening baru"
        value={draft.accountNumber}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="off"
        placeholder="Masukkan nomor lengkap (sebelumnya ••6402)"
        error={errors.accountNumber}
        hint="Nomor lengkap hanya digunakan saat memeriksa pengajuan lokal ini."
        onChange={(e) => onChange("accountNumber", e.target.value)}
      />
      <Field
        label="Ketik ulang nomor rekening"
        value={draft.confirmAccountNumber}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="off"
        error={errors.confirmAccountNumber}
        onChange={(e) => onChange("confirmAccountNumber", e.target.value)}
      />
      <div className="sm:col-span-2">
        <Field
          label="Ketik ulang nama pemilik rekening"
          value={draft.confirmAccountName}
          disabled={disabled}
          autoComplete="off"
          error={errors.confirmAccountName}
          hint="Nama harus sama dengan bukti rekening yang diunggah."
          onChange={(e) => onChange("confirmAccountName", e.target.value)}
        />
      </div>
    </div>
  );
}
