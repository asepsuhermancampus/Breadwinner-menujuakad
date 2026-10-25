"use client";
import { AuthLayout } from "./auth-layout";
import { AuthQueryAlert } from "./auth-query-alert";
import { GoogleAuthButton } from "./google-auth-button";
import { CredentialsForm } from "./credentials-form";
import type { AuthMode } from "../types/auth-contracts";
export function CustomerAuth({ mode }: { mode: AuthMode }) {
  return (
    <AuthLayout mode={mode}>
      <AuthQueryAlert />
      <div className="space-y-5">
        <h1 className="text-3xl font-semibold">
          {mode === "register"
            ? "Buat akun kalian"
            : mode === "recovery"
              ? "Pulihkan akses akun"
              : "Selamat datang kembali"}
        </h1>
        <p className="text-sm text-secondary">
          {mode === "recovery"
            ? "Gunakan akun Google yang sama untuk masuk kembali. Pemulihan kata sandi Google dikelola oleh Google."
            : "Simpan rencana kalian dengan email dan password atau akun Google."}
        </p>
        {mode !== "recovery" && <CredentialsForm register={mode === "register"} />}
        <div className="flex items-center gap-3 text-xs text-secondary">
          <span className="h-px flex-1 bg-ux-border" />
          atau
          <span className="h-px flex-1 bg-ux-border" />
        </div>
        <GoogleAuthButton disabled={false} />
      </div>
    </AuthLayout>
  );
}
