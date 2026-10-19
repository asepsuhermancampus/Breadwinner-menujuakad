"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { requestFinanceOtp, verifyFinanceOtp } from "../domain/finance-settings";
import type { FinanceScreenProps } from "../types/admin-finance";
import { FinanceNote } from "./finance-parts";
import styles from "./finance.module.css";

export function FinanceOtp({
  state,
  context,
  onResult,
  onClose,
  onVerified,
}: FinanceScreenProps & { onClose: () => void; onVerified: () => void }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(context.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const remaining = Math.max(0, Math.ceil(((state.otp?.resendAfter ?? now) - now) / 1000));
  return (
    <Dialog open title="Verifikasi Admin Keuangan" onClose={onClose}>
      <form
        className={styles.stack}
        onSubmit={(event) => {
          event.preventDefault();
          const result = verifyFinanceOtp(state, code, context);
          onResult(result);
          setMessage(result.message);
          if (result.ok) {
            setCode("");
            onVerified();
          }
        }}
      >
        <p className="text-sm leading-7 text-secondary">
          Izin tindakan diperiksa terpisah. OTP tidak memberi hak akses baru.
        </p>
        <FinanceNote>
          Kanal n•••@menujuakad.id · simulasi tanpa pengiriman kode. Gunakan kode mock{" "}
          <strong>882016</strong>.
        </FinanceNote>
        <Field
          label="Kode OTP enam digit"
          value={code}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
          placeholder="••••••"
          onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
          error={message || undefined}
          className="text-center font-mono text-2xl tracking-[0.5em]"
        />
        <Button
          variant="ghost"
          disabled={remaining > 0}
          onClick={() => {
            const result = requestFinanceOtp(state, context);
            onResult(result);
            setMessage(result.ok ? "" : result.message);
          }}
        >
          Kirim ulang {remaining > 0 ? `00:${String(remaining).padStart(2, "0")}` : "kode mock"}
        </Button>
        <FinanceNote>
          Kode valid hanya membuka review. Konfigurasi aktif tetap sampai konfirmasi akhir, selama
          izin dan versi masih valid.
        </FinanceNote>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">Verifikasi & tinjau</Button>
        </div>
      </form>
    </Dialog>
  );
}
