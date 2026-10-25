"use client";

import { useState } from "react";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import type { CredentialKind } from "../types/auth-contracts";
import styles from "./auth-form.module.css";

export function SecretField({
  kind,
  label,
  name,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
  autoComplete = "current-password",
}: {
  kind: CredentialKind;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={styles.secret}>
      <Field
        name={name}
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={visible ? "text" : "password"}
        inputMode={kind === "pin" ? "numeric" : "text"}
        maxLength={kind === "pin" ? 6 : 128}
        autoComplete={autoComplete}
        required
        disabled={disabled}
        readOnly={readOnly}
        {...(error ? { error } : {})}
      />
      <button
        className={styles.reveal}
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={`${visible ? "Sembunyikan" : "Tampilkan"} ${kind === "pin" ? "PIN" : "kata sandi"}`}
        aria-pressed={visible}
        disabled={disabled}
      >
        <Icon name={visible ? "eye-off" : "eye"} size={18} />
      </button>
    </div>
  );
}
