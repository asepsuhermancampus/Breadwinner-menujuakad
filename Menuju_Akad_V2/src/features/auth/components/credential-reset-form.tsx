"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { focusInvalidField } from "../lib/focus-invalid-field";
import { firstIssue, passwordSchema, pinSchema } from "../schemas/auth-schema";
import type { CredentialKind } from "../types/auth-contracts";
import { SecretField } from "./secret-field";
import styles from "./auth-form.module.css";

export function CredentialResetForm({
  kind,
  destination,
  pending,
  onSubmit,
}: {
  kind: CredentialKind;
  destination: string;
  pending: boolean;
  onSubmit: (secret: string) => void;
}) {
  const [secret, setSecret] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState({ secret: "", confirmation: "" });
  const noun = kind === "password" ? "kata sandi" : "PIN";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = (kind === "password" ? passwordSchema : pinSchema).safeParse(secret);
    const confirmationError = confirmation === secret ? "" : `Konfirmasi ${noun} belum cocok.`;
    setErrors({
      secret: result.success ? "" : firstIssue(result),
      confirmation: confirmationError,
    });
    if (result.success && !confirmationError) onSubmit(result.data);
    else focusInvalidField(event.currentTarget);
  }
  return (
    <form className={styles.form} onSubmit={submit} noValidate aria-busy={pending}>
      <Status tone="success">{destination} · Terverifikasi untuk pemulihan</Status>
      <SecretField
        kind={kind}
        label={`${kind === "pin" ? "PIN" : "Kata sandi"} baru`}
        name="new-secret"
        value={secret}
        onChange={setSecret}
        error={errors.secret}
        disabled={pending}
        autoComplete="new-password"
      />
      <SecretField
        kind={kind}
        label={`Konfirmasi ${noun}`}
        name="confirm-secret"
        value={confirmation}
        onChange={setConfirmation}
        error={errors.confirmation}
        disabled={pending}
        autoComplete="new-password"
      />
      <p className={styles.small}>
        {kind === "password" ? "Minimal 8 karakter, sertakan huruf dan angka." : "Gunakan 6 angka."}
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan…" : `Simpan ${noun} baru`}
      </Button>
      <div className={styles.security}>
        Email / nomor terdaftar → kode OTP → sandi / PIN baru.
        <br />
        Perubahan hanya diproses dengan sesi pemulihan terverifikasi. Preview tidak mengubah akun
        produksi.
      </div>
    </form>
  );
}
