"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { focusInvalidField } from "../lib/focus-invalid-field";
import { firstIssue, identifierSchema, pinSchema } from "../schemas/auth-schema";
import type { AuthMethod, LoginInput } from "../types/auth-contracts";
import { AuthMethodToggle } from "./auth-method-toggle";
import { GoogleAuthButton } from "./google-auth-button";
import { SecretField } from "./secret-field";
import styles from "./auth-form.module.css";

export function LoginForm({
  pending,
  onSubmit,
}: {
  pending: boolean;
  onSubmit: (input: LoginInput) => void;
}) {
  const [method, setMethod] = useState<AuthMethod>("email");
  const [values, setValues] = useState({ email: "", phone: "", password: "", pin: "" });
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({ identifier: "", secret: "" });
  const kind = method === "email" ? "password" : "pin";
  const update = (key: keyof typeof values, value: string) =>
    setValues((old) => ({ ...old, [key]: value }));

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const identifier = identifierSchema(method).safeParse(values[method]);
    const secretError =
      kind === "pin"
        ? pinSchema.safeParse(values.pin).success
          ? ""
          : "PIN harus terdiri dari 6 angka."
        : values.password.length > 0
          ? ""
          : "Masukkan kata sandi Anda.";
    setErrors({
      identifier: identifier.success ? "" : firstIssue(identifier),
      secret: secretError,
    });
    if (identifier.success && !secretError) {
      onSubmit({ method, identifier: identifier.data, secret: values[kind], remember });
    } else {
      focusInvalidField(event.currentTarget);
    }
  }

  return (
    <>
      <div className={styles.intro}>
        <h1>Selamat datang kembali</h1>
        <p>Masuk untuk melanjutkan rencana kalian.</p>
      </div>
      <form className={styles.form} onSubmit={submit} noValidate aria-busy={pending}>
        <GoogleAuthButton disabled={pending} />
        <div className={styles.divider}>atau</div>
        <AuthMethodToggle
          value={method}
          onChange={(next) => {
            setMethod(next);
            setErrors({ identifier: "", secret: "" });
          }}
          disabled={pending}
        />
        <Field
          name={method}
          label={method === "email" ? "Alamat email" : "Nomor telepon"}
          value={values[method]}
          onChange={(event) => update(method, event.target.value)}
          type={method === "email" ? "email" : "tel"}
          autoComplete={method === "email" ? "email" : "tel"}
          placeholder={method === "email" ? "nama@email.com" : "+62 812 3456 7890"}
          maxLength={254}
          required
          disabled={pending}
          {...(errors.identifier ? { error: errors.identifier } : {})}
        />
        <SecretField
          kind={kind}
          name={kind}
          label={kind === "pin" ? "PIN keamanan · 6 digit" : "Kata sandi"}
          value={values[kind]}
          onChange={(value) => update(kind, value)}
          disabled={pending}
          error={errors.secret}
        />
        <div className={styles.row}>
          <label className={styles.check}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={pending}
            />
            Ingat saya
          </label>
          <Link href="/auth/recovery">{method === "email" ? "Lupa kata sandi?" : "Lupa PIN?"}</Link>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Memeriksa akses…" : "Masuk ke ruang kita"}
        </Button>
        <p className={cn(styles.small, styles.center)}>
          Rencana pribadi, hanya untuk kalian berdua.
        </p>
      </form>
    </>
  );
}
