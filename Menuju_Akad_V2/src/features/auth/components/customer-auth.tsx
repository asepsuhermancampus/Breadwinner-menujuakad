"use client";
import { AuthLayout } from "./auth-layout";
import { AuthQueryAlert } from "./auth-query-alert";
import { GoogleAuthButton } from "./google-auth-button";
import { CredentialsForm } from "./credentials-form";
import type { AuthMode } from "../types/auth-contracts";
export function CustomerAuth({
  mode,
  initialReturnTo = "",
}: {
  mode: AuthMode;
  initialReturnTo?: string;
}) {
  return (
    <AuthLayout mode={mode} initialReturnTo={initialReturnTo}>
      <AuthQueryAlert />
      <div className={mode === "login" ? "space-y-4" : "space-y-5"}>
        <div className={mode === "login" ? "space-y-1.5" : "space-y-5"}>
          <h1 className="text-center font-heading text-[22px] font-semibold tracking-tight">
            {mode === "register"
              ? "Buat akun kalian"
              : mode === "recovery"
                ? "Pulihkan akses akun"
                : "Selamat datang kembali"}
          </h1>
          <p className="text-center text-xs leading-relaxed text-secondary">
            {mode === "recovery"
              ? "Gunakan akun Google yang sama untuk masuk kembali. Pemulihan kata sandi Google dikelola oleh Google."
              : "Simpan rencana kalian dengan email dan password atau akun Google."}
          </p>
        </div>
        <GoogleAuthButton disabled={false} />
        <div className="flex items-center gap-3 text-xs text-secondary">
          <span className="h-px flex-1 bg-ux-border" />
          atau
          <span className="h-px flex-1 bg-ux-border" />
        </div>
        {mode !== "recovery" && <CredentialsForm register={mode === "register"} />}
      </div>
    </AuthLayout>
  );
}
