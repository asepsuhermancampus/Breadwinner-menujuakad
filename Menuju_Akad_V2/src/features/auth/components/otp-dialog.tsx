"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Status } from "@/components/ui/status";
import { authErrorMessage } from "../lib/auth-errors";
import { challengeTime, formatCountdown } from "../lib/challenge-time";
import type { AuthAdapter, AuthFailure, OtpChallenge } from "../types/auth-contracts";
import { OtpInput } from "./otp-input";
import styles from "./auth-form.module.css";
import otpStyles from "./otp.module.css";

export function OtpDialog({
  challenge,
  adapter,
  pending,
  failure,
  onClose,
  onVerify,
  onResend,
}: {
  challenge: OtpChallenge;
  adapter: AuthAdapter;
  pending: boolean;
  failure: AuthFailure | null;
  onClose: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
}) {
  const [now, setNow] = useState(() => adapter.now());
  const [code, setCode] = useState("");
  const firstRef = useRef<HTMLInputElement>(null);
  const time = challengeTime(challenge, now);
  const limited = failure?.code === "rate-limit" && (!failure.retryAt || now < failure.retryAt);
  useEffect(() => {
    const timer = setInterval(() => setNow(adapter.now()), 500);
    return () => clearInterval(timer);
  }, [adapter]);
  useEffect(() => {
    if (failure) firstRef.current?.focus();
  }, [failure]);
  return (
    <Dialog
      open
      title="Verifikasi akunmu"
      onClose={() => {
        if (!pending) onClose();
      }}
    >
      <form
        className={styles.form}
        aria-busy={pending}
        onSubmit={(event) => {
          event.preventDefault();
          if (code.length === 6 && !time.expired && !limited) onVerify(code);
        }}
      >
        <p className={styles.small}>
          {adapter.mode === "mock"
            ? "Kode simulasi 6 digit untuk "
            : "Masukkan kode 6 digit untuk "}
          <strong>{challenge.destination}</strong>
        </p>
        {challenge.purpose === "recovery" && (
          <Status>
            Jika data cocok dengan akun terdaftar, petunjuk pemulihan tersedia. Respons ini tidak
            mengungkap status akun.
          </Status>
        )}
        <div className={styles.tabs} role="group" aria-label="Kanal verifikasi">
          <button
            type="button"
            aria-pressed={challenge.channel === "email"}
            disabled
            aria-describedby="otp-channel"
          >
            Email
          </button>
          <button
            type="button"
            aria-pressed={challenge.channel === "phone"}
            disabled
            aria-describedby="otp-channel"
          >
            WhatsApp
          </button>
        </div>
        <p id="otp-channel" className={styles.small}>
          Kanal mengikuti metode akses. Gunakan “Ubah email / nomor telepon” untuk menggantinya.
        </p>
        <OtpInput
          firstRef={firstRef}
          onChange={setCode}
          invalid={Boolean(failure)}
          disabled={pending}
        />
        <div className={otpStyles.info}>
          <span>
            {time.expired ? "Kode kedaluwarsa" : "Kode berlaku"}{" "}
            <span className={otpStyles.timer}>{formatCountdown(time.expirySeconds)}</span>
          </span>
          <button
            type="button"
            disabled={pending || time.resendSeconds > 0 || Boolean(limited)}
            onClick={onResend}
          >
            {time.resendSeconds > 0
              ? `Kirim ulang dalam ${formatCountdown(time.resendSeconds)}`
              : "Kirim ulang kode"}
          </button>
        </div>
        {failure && (
          <div id="otp-error">
            <Status tone="danger">{authErrorMessage(failure.code)}</Status>
          </div>
        )}
        {time.expired && !failure && (
          <Status tone="warning">Kode sudah kedaluwarsa. Minta kode baru.</Status>
        )}
        <Button
          type="submit"
          disabled={pending || code.length !== 6 || time.expired || Boolean(limited)}
        >
          {pending ? "Memverifikasi…" : "Verifikasi & lanjutkan"}
        </Button>
        <p id="otp-guidance" className={styles.small}>
          {code.length < 6 ? "Isi keenam digit untuk melanjutkan. " : ""}
          {adapter.mode === "mock"
            ? "Preview tidak mengirim OTP nyata."
            : "Jangan membagikan kode verifikasi."}
        </p>
        <Button type="button" variant="ghost" disabled={pending} onClick={onClose}>
          Ubah email / nomor telepon
        </Button>
        <p className={styles.security}>
          Jangan bagikan kode ini kepada siapa pun, termasuk pihak yang mengaku dari Menuju Akad.
        </p>
      </form>
    </Dialog>
  );
}
