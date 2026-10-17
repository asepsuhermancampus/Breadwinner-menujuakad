"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { focusInvalidField } from "../lib/focus-invalid-field";
import { firstIssue, identifierSchema } from "../schemas/auth-schema";
import type { AuthMethod } from "../types/auth-contracts";
import { AuthMethodToggle } from "./auth-method-toggle";
import styles from "./auth-form.module.css";

export function RecoveryRequestForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (input: { method: AuthMethod; identifier: string }) => void;
}) {
  const [method, setMethod] = useState<AuthMethod>("email");
  const [values, setValues] = useState({ email: "", phone: "" });
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = identifierSchema(method).safeParse(values[method]);
    if (!result.success) {
      setError(firstIssue(result));
      focusInvalidField(event.currentTarget);
      return;
    }
    setError("");
    onSubmit({ method, identifier: result.data });
  }
  return (
    <form className={styles.form} onSubmit={submit} noValidate aria-busy={pending}>
      <AuthMethodToggle
        value={method}
        onChange={(next) => {
          setMethod(next);
          setError("");
        }}
        disabled={pending}
        recovery
      />
      <Field
        name="recovery-identifier"
        label={method === "email" ? "Alamat email" : "Nomor telepon"}
        type={method === "email" ? "email" : "tel"}
        value={values[method]}
        onChange={(event) => setValues({ ...values, [method]: event.target.value })}
        autoComplete={method === "email" ? "email" : "tel"}
        maxLength={254}
        required
        disabled={pending}
        {...(error ? { error } : {})}
      />
      <p className={styles.small}>
        Jika data cocok dengan akun terdaftar, petunjuk pemulihan akan tersedia. Kami tidak
        mengungkap apakah suatu akun terdaftar.
      </p>
      <Button type="submit" disabled={pending}>
        {pending ? "Memeriksa permintaan…" : "Lanjutkan pemulihan"}
      </Button>
    </form>
  );
}
