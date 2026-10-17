"use client";

import type { AuthMethod } from "../types/auth-contracts";
import styles from "./auth-form.module.css";

export function AuthMethodToggle({
  value,
  onChange,
  disabled = false,
  recovery = false,
}: {
  value: AuthMethod;
  onChange: (method: AuthMethod) => void;
  disabled?: boolean;
  recovery?: boolean;
}) {
  return (
    <div
      className={styles.tabs}
      role="group"
      aria-label={recovery ? "Akses yang dipulihkan" : "Metode masuk"}
    >
      <button
        type="button"
        aria-pressed={value === "email"}
        onClick={() => onChange("email")}
        disabled={disabled}
      >
        {recovery ? "Kata sandi" : "Email"}
      </button>
      <button
        type="button"
        aria-pressed={value === "phone"}
        onClick={() => onChange("phone")}
        disabled={disabled}
      >
        {recovery ? "PIN 6 digit" : "Nomor telepon"}
      </button>
    </div>
  );
}
