"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { focusInvalidField } from "../lib/focus-invalid-field";
import { registerSchema } from "../schemas/auth-schema";
import type { RegisterInput } from "../types/auth-contracts";
import { GoogleAuthButton } from "./google-auth-button";
import { SecretField } from "./secret-field";
import styles from "./auth-form.module.css";

export function RegisterForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (input: RegisterInput) => void;
}) {
  const termsErrorId = useId();
  const [values, setValues] = useState({ name: "", email: "", password: "", acceptTerms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const strength =
    Number(values.password.length >= 8) +
    Number(/[A-Za-z]/.test(values.password)) +
    Number(/\d/.test(values.password));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = registerSchema.safeParse(values);
    if (result.success) {
      setErrors({});
      onSubmit(result.data);
      return;
    }
    const next: Record<string, string> = {};
    for (const issue of result.error.issues) next[String(issue.path[0])] ??= issue.message;
    setErrors(next);
    focusInvalidField(event.currentTarget);
  }
  return (
    <>
      <div className={styles.intro}>
        <h1>Mulai rencana kalian</h1>
        <p>Buat akun gratis. Rencanakan bersama pasangan.</p>
      </div>
      <form className={styles.form} onSubmit={submit} noValidate aria-busy={pending}>
        <GoogleAuthButton disabled={pending} />
        <Field
          name="name"
          label="Nama lengkap"
          value={values.name}
          autoComplete="name"
          maxLength={100}
          required
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          disabled={pending}
          {...(errors.name ? { error: errors.name } : {})}
        />
        <Field
          name="email"
          label="Alamat email"
          type="email"
          value={values.email}
          autoComplete="email"
          maxLength={254}
          required
          onChange={(event) => setValues({ ...values, email: event.target.value })}
          disabled={pending}
          {...(errors.email ? { error: errors.email } : {})}
        />
        <SecretField
          kind="password"
          name="password"
          label="Kata sandi"
          value={values.password}
          onChange={(password) => setValues({ ...values, password })}
          autoComplete="new-password"
          disabled={pending}
          error={errors.password}
        />
        <div className={styles.strength} aria-hidden="true">
          {[1, 2, 3].map((level) => (
            <span key={level} data-active={strength >= level} />
          ))}
        </div>
        <p className={styles.small}>Minimal 8 karakter, sertakan huruf dan angka.</p>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={values.acceptTerms}
            onChange={(event) => setValues({ ...values, acceptTerms: event.target.checked })}
            disabled={pending}
            aria-invalid={Boolean(errors.acceptTerms)}
            aria-describedby={errors.acceptTerms ? termsErrorId : undefined}
          />
          <span>Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi Menuju Akad.</span>
        </label>
        {errors.acceptTerms && (
          <p id={termsErrorId} className={styles.error} role="alert">
            {errors.acceptTerms}
          </p>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? "Menyiapkan akun…" : "Buat akun & mulai rencana"}
        </Button>
      </form>
    </>
  );
}
