"use client";

import { useState, type KeyboardEvent, type RefObject } from "react";
import styles from "./otp.module.css";

export function OtpInput({
  onChange,
  firstRef,
  invalid,
  disabled,
}: {
  onChange: (code: string) => void;
  firstRef: RefObject<HTMLInputElement | null>;
  invalid: boolean;
  disabled: boolean;
}) {
  const [digits, setDigits] = useState<string[]>(Array<string>(6).fill(""));
  function focus(index: number) {
    const inputs = firstRef.current?.parentElement?.querySelectorAll("input");
    (inputs?.[Math.max(0, Math.min(index, 5))] as HTMLInputElement | undefined)?.focus();
  }
  function insert(index: number, value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    if (!numbers) next[index] = "";
    for (const [offset, digit] of [...numbers].entries()) {
      if (index + offset < 6) next[index + offset] = digit;
    }
    setDigits(next);
    onChange(next.join(""));
    if (numbers) focus(index + numbers.length);
  }
  function navigate(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      focus(index + (event.key === "ArrowLeft" ? -1 : 1));
    }
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      onChange(next.join(""));
      focus(index - 1);
    }
  }
  return (
    <fieldset>
      <legend className="sr-only">Kode verifikasi 6 digit</legend>
      <div className={styles.digits}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={index === 0 ? firstRef : undefined}
            aria-label={`Digit ${index + 1} dari 6`}
            aria-invalid={invalid}
            aria-describedby={invalid ? "otp-error" : "otp-guidance"}
            name={`otp-${index + 1}`}
            value={digit}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={6}
            disabled={disabled}
            onFocus={(event) => event.target.select()}
            onChange={(event) => insert(index, event.target.value)}
            onKeyDown={(event) => navigate(event, index)}
            onPaste={(event) => {
              event.preventDefault();
              insert(index, event.clipboardData.getData("text"));
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}
